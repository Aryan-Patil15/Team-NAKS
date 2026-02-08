import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // Added useLocation
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, Send, Loader2 } from "lucide-react";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  arrayUnion,
  Timestamp,
  where,
} from "firebase/firestore";


// --- COOKIE HELPER ---
const getStudentIdFromCookie = () => {
  const name = "user_session=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
};

interface Message {
  id: number;
  text: string;
  senderId: "me" | "mentor";
  timestamp: Date;
  isOwn: boolean;
}

interface ChatSession {
  id: string;
  name: string;
  status: string;
}

export default function Chat() {
  const { alumniId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // To grab instant name from Alumni.tsx
  const currentStudentId = getStudentIdFromCookie();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingSidebar, setLoadingSidebar] = useState(true);

  // Initialize name from navigation state if available to prevent "Connecting..." flicker
  const [alumniName, setAlumniName] = useState(location.state?.alumniName || "");

  /* ===================== SIDEBAR ===================== */

  useEffect(() => {
    // If there's no student ID yet, don't attempt to fetch
    if (!currentStudentId) return;

    // 🔹 Filter query to only show documents belonging to the current student
    const q = query(
      collection(db, "mentorship_requests"),
      where("studentId", "==", currentStudentId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: ChatSession[] = snap.docs.map((d) => ({
        id: d.id,
        name: d.data().name || "Alumnus",
        status: d.data().status || "accepted",
      }));

      setSessions(list);
      setLoadingSidebar(false);
    });

    return () => unsub();
  }, [currentStudentId]); // Depend on currentStudentId so it re-runs if the user logs in

  /* ===================== FETCH ALUMNI NAME ===================== */
  useEffect(() => {
    if (!alumniId || alumniName) return; // Skip if we already have it from state

    const alumniRef = doc(db, "alumini", alumniId);
    const unsub = onSnapshot(alumniRef, (snap) => {
      if (snap.exists()) {
        setAlumniName(snap.data().name || "Alumnus");
      }
    });

    return () => unsub();
  }, [alumniId, alumniName]);

  /* ===================== FETCH MESSAGES ===================== */
  useEffect(() => {
  // If there's no alumni selected or no student logged in, stop.
  if (!alumniId || !currentStudentId) return;

  const chatRef = doc(db, "mentorship_requests", alumniId);

  const unsub = onSnapshot(chatRef, (snap) => {
    if (!snap.exists()) {
      setCurrentMessages([]);
      return;
    }

    const data = snap.data();

    // 🔹 SECURITY CHECK: Only show messages if the studentId in the DB 
    // matches the current user's studentId from the cookie.
    if (data.studentId !== currentStudentId) {
      console.warn("Unauthorized access attempt to chat.");
      setCurrentMessages([]);
      return;
    }

    const msgs: Message[] = (data.messages || [])
      .map((m: any) => ({
        id: m.id,
        text: m.text,
        senderId: m.isFromMentor ? "mentor" : "me",
        timestamp: m.timestamp?.toDate() || new Date(),
        isOwn: !m.isFromMentor,
      }))
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    setCurrentMessages(msgs);
    
    // Sync the header name if it wasn't set by navigation state
    if (data.name && !alumniName) setAlumniName(data.name);
  });

  return () => unsub();
}, [alumniId, currentStudentId]);
  /* ===================== AUTO SCROLL ===================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  /* ===================== SEND MESSAGE ===================== */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !alumniId || !currentStudentId) return;

    const text = newMessage;
    setNewMessage("");

    try {
      const chatRef = doc(db, "mentorship_requests", alumniId);

      await setDoc(
        chatRef,
        { 
          batch: "",
          topic: "",
          name: alumniName,
          status: "accepted",
          studentId: currentStudentId, // Storing ID from cookie
          updatedAt: Timestamp.now(),
          messages: arrayUnion({
            id: Date.now(),
            isFromMentor: false,
            senderName: student?.name || "Student",
            text,
            timestamp: Timestamp.now(),
          
          }),
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to send message:", err);
      setNewMessage(text);
    }
  };

  /* ===================== UI ===================== */
  return (
      <div className="max-w-6xl mx-auto min-h-[calc(100vh-8rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Sidebar */}
          <div className="glass-card p-4 flex flex-col h-[650px] bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 px-2 tracking-widest">
              Active Chats
            </h3>

            <div className="space-y-2 overflow-y-auto flex-1 scrollbar-none">
              {loadingSidebar ? (
                <Loader2 className="animate-spin mx-auto mt-10 opacity-20 text-white" />
              ) : (
                sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                        setAlumniName(s.name);
                        navigate(`/chat/${s.id}`, { state: { alumniName: s.name } });
                    }}
                    className={cn(
                      "w-full text-left p-4 rounded-xl transition-all border",
                      alumniId === s.id
                        ? "bg-primary/20 border-primary/30"
                        : "hover:bg-white/5 border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                        {s.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">
                          {s.name}
                        </h4>
                        <p className="text-[10px] uppercase text-primary font-bold">
                          {s.status}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 glass-card flex flex-col h-[650px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            {alumniId ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-xs font-bold text-white">
                    {alumniName?.[0] || "?"}
                  </div>
                  <h2 className="font-semibold text-white">
                    {alumniName || "Connecting..."}
                  </h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        msg.isOwn ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2 border",
                          msg.isOwn
                            ? "bg-primary/20 border-primary/20 text-white rounded-br-none"
                            : "bg-white/10 border-white/5 text-gray-200 rounded-bl-none"
                        )}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p className="text-[9px] opacity-30 mt-1 text-right">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSendMessage()
                    }
                    placeholder="Type your message..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
                  <Button size="sm" onClick={handleSendMessage} className="bg-primary hover:bg-primary/80">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                <p>Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}