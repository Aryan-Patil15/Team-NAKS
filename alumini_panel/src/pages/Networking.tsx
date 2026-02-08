import { useState, useEffect, useRef } from "react";
import { db, auth } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Sparkles,
  Send,
  X,
  User,
  ChevronRight,
  Clock
} from "lucide-react";

/* =============================
   COOKIE HELPER
   ============================= */
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

const Networking = () => {
  const [mentorshipEnabled, setMentorshipEnabled] = useState(true);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [mentorUserName, setMentorUserName] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  /* =============================
     LOAD USERNAME FROM COOKIE
     ============================= */
  useEffect(() => {
    const username = getCookie("userName");
    if (username) {
      // Decode in case of spaces/special characters in Mumbai-based names
      setMentorUserName(decodeURIComponent(username));
    }
  }, []);

  /* =============================
     FETCH LOGGED-IN MENTOR PROFILE
     ============================= */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user?.email) return;

      const q = query(
        collection(db, "alumini"),
        where("emailId", "==", user.email)
      );

      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setUserData(snapshot.docs[0].data());
        }
      });
    });

    return () => unsubscribe();
  }, []);

  /* =============================
     FETCH ONLY MENTOR-SPECIFIC CHATS
     Filters by 'name' and gets student from 'senderName'
     ============================= */
  useEffect(() => {
    if (!mentorUserName) return;

    // Based on screenshot: 'name' stores the Alumni/Mentor name
    const q = query(
      collection(db, "mentorship_requests"),
      where("name", "==", mentorUserName)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          
        // Correct student name extraction
let studentDisplayName = "Student";

// 1️⃣ BEST: studentId.name (stable)
if (data.studentId?.name) {
  studentDisplayName = data.studentId.name;
}

// 2️⃣ FALLBACK: first student message senderName
else if (Array.isArray(data.messages)) {
  const studentMsg = data.messages.find(
    (msg) => msg.isFromMentor === false && msg.senderName
  );

  if (studentMsg) {
    studentDisplayName = studentMsg.senderName;
  }
}


          return {
            id: doc.id,
            ...data,
            studentName: studentDisplayName,
            topic: data.topic || "Career Guidance",
            messages: data.messages || [],
          };
        })
      );
    });

    return () => unsubscribe();
  }, [mentorUserName]);

  /* =============================
     AUTO SCROLL
     ============================= */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [requests, selectedChat]);

  /* =============================
     SEND MESSAGE
     ============================= */
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    try {
      await updateDoc(doc(db, "mentorship_requests", selectedChat), {
        messages: arrayUnion({
          id: Date.now(),
          senderName: mentorUserName || "Mentor",
          text: messageInput.trim(),
          timestamp: Timestamp.now(),
          isFromMentor: true,
        }),
        updatedAt: Timestamp.now()
      });

      setMessageInput("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const activeChat = requests.find((r) => r.id === selectedChat);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
              Mentorship Hub <Sparkles className="h-6 w-6 text-blue-500" />
            </h1>
            <p className="text-slate-400 mt-2 italic">
              Logged in as: <span className="text-blue-400 font-semibold">{mentorUserName}</span>
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
            <div>
              <span className="text-xs text-slate-500 uppercase">Profile Status</span>
              <p className="font-bold text-blue-400">
                {mentorshipEnabled ? "Accepting Chats" : "Offline"}
              </p>
            </div>
            <Switch
              checked={mentorshipEnabled}
              onCheckedChange={setMentorshipEnabled}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">

          {/* SIDEBAR */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-500" />
                <h3 className="font-bold">Student Enquiries</h3>
              </div>
              <Badge className="bg-blue-600 px-2 py-0">{requests.length}</Badge>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 space-y-2">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => setSelectedChat(req.id)}
                    className={`p-4 rounded-2xl cursor-pointer transition-all border ${
                      selectedChat === req.id
                        ? "bg-blue-600 border-blue-400 text-white"
                        : "bg-slate-800 border-transparent hover:bg-slate-700 text-slate-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm tracking-tight">
                        {req.studentName}
                      </span>
                      <ChevronRight className="h-3 w-3 opacity-50" />
                    </div>
                    <p className={`text-[11px] truncate mt-1 ${selectedChat === req.id ? "text-blue-100" : "text-slate-500"}`}>
                      {req.topic}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* CHAT WINDOW */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden">
            {activeChat ? (
              <>
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/30">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-500">
                        {activeChat.studentName.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-white leading-none">{activeChat.studentName}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">{activeChat.topic}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedChat(null)}
                    className="hover:bg-slate-800 text-slate-400"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-6">
                    {activeChat.messages.map((msg: any) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isFromMentor ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[75%] flex flex-col ${msg.isFromMentor ? "items-end" : "items-start"}`}>
                          <div
                            className={`p-4 rounded-2xl text-sm ${
                              msg.isFromMentor
                                ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20"
                                : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-600 px-1 font-bold">
                             <Clock className="h-2 w-2" />
                             {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Sent"}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={scrollRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex gap-2">
                  <Input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type your guidance..."
                    className="bg-slate-950 border-slate-800 focus:ring-blue-600 h-12"
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    className="bg-blue-600 hover:bg-blue-700 h-12 px-6 font-bold"
                  >
                    <Send className="h-4 w-4 mr-2" /> Reply
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-40 bg-slate-950/20">
                <div className="bg-slate-900 p-6 rounded-full border border-slate-800 mb-4">
                    <MessageCircle className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold">Select an Enquiry</h3>
                <p className="text-sm">Click on a student's request to begin mentoring.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Networking;