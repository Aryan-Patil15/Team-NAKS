import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase"; // Ensure your firebase config is exported from here
import { 
  collection, 
  onSnapshot, 
  updateDoc, 
  doc, 
  arrayUnion, 
  query, 
  Timestamp 
} from "firebase/firestore";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  UserCheck,
  UserX,
  Sparkles,
  Shield,
  Send,
  X,
} from "lucide-react";

// Updated Interfaces to support Firebase String IDs
interface Message {
  id: number;
  senderId: string | number;
  senderName: string;
  text: string;
  timestamp: any; // Firestore Timestamp
  isFromMentor: boolean;
}

interface MentorRequest {
  id: string; // Firestore Doc ID
  name: string;
  batch: string;
  topic: string;
  status: "pending" | "accepted" | "declined";
  messages: Message[];
  unreadCount: number;
}

const Networking = () => {
  const [mentorshipEnabled, setMentorshipEnabled] = useState(true);
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const { toast } = useToast();

  // 1. REAL-TIME LISTENER: Syncs UI with Firestore
  useEffect(() => {
    const q = query(collection(db, "mentorship_requests"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MentorRequest[];
      
      setRequests(firebaseRequests);
    });

    return () => unsubscribe();
  }, []);

  // 2. UPDATE STATUS: Accept Request
  const handleAccept = async (id: string) => {
    try {
      const requestRef = doc(db, "mentorship_requests", id);
      await updateDoc(requestRef, { status: "accepted" });
      toast({
        title: "Request Accepted",
        description: "The student will be notified live!",
      });
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // 3. UPDATE STATUS: Decline Request
  const handleDecline = async (id: string) => {
    try {
      const requestRef = doc(db, "mentorship_requests", id);
      await updateDoc(requestRef, { status: "declined" });
      setSelectedChat(null);
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  // 4. SEND MESSAGE: Real-time update via arrayUnion
  const handleSendMessage = async () => {
    if (!messageInput.trim() || selectedChat === null) return;

    const newMessage = {
      id: Date.now(),
      senderId: "mentor_1", // Replace with real Auth UID if available
      senderName: "You",
      text: messageInput.trim(),
      timestamp: Timestamp.now(),
      isFromMentor: true,
    };

    try {
      const requestRef = doc(db, "mentorship_requests", selectedChat);
      await updateDoc(requestRef, {
        messages: arrayUnion(newMessage)
      });
      setMessageInput("");
    } catch (error) {
      toast({ title: "Error", description: "Could not send message." });
    }
  };

  const openChat = (id: string) => {
    setSelectedChat(id);
    // Mark messages as read (Optional: could also update Firestore unreadCount)
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const totalUnread = requests.reduce((sum, r) => sum + r.unreadCount, 0);
  const activeChatRequest = requests.find((r) => r.id === selectedChat);

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Give Back</p>
        <h1 className="text-3xl font-bold text-foreground">Networking & Mentorship</h1>
        <p className="text-muted-foreground mt-1">Guide students from your alma mater in Mumbai and beyond.</p>
      </motion.div>

      {/* Toggle Card */}
      <div className="elevated-card p-6 bg-card border rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Mentorship Mode</h2>
              <p className="text-sm text-muted-foreground">
                {mentorshipEnabled ? "Accepting requests" : "Currently offline"}
              </p>
            </div>
          </div>
          <Switch checked={mentorshipEnabled} onCheckedChange={setMentorshipEnabled} />
        </div>
      </div>

      {/* Requests List */}
      {mentorshipEnabled && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Incoming Doubts</h2>
            {pendingCount > 0 && <Badge variant="default">{pendingCount} new</Badge>}
          </div>

          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="p-4 border rounded-lg bg-card flex items-center gap-4 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                  {req.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{req.name}</span>
                    <Badge variant="outline" className="text-[10px]">Batch {req.batch}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{req.topic}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => openChat(req.id)}>Chat</Button>
                  {req.status === "pending" && (
                    <Button size="sm" onClick={() => handleAccept(req.id)}>Accept</Button>
                  )}
                  {req.status === "accepted" && <Badge className="bg-green-500/10 text-green-600 border-none">Active</Badge>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Modal */}
      <AnimatePresence>
        {selectedChat && activeChatRequest && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedChat(null)}
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }}
              className="bg-background rounded-2xl w-full max-w-lg h-[600px] flex flex-col overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-xs">
                    {activeChatRequest.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{activeChatRequest.name}</p>
                    <p className="text-[10px] text-muted-foreground">{activeChatRequest.topic}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedChat(null)}><X className="h-4 w-4"/></Button>
              </div>

              <ScrollArea className="flex-1 p-4 bg-slate-50/50">
                <div className="space-y-4">
                  {activeChatRequest.messages?.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isFromMentor ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-2xl max-w-[80%] text-sm ${msg.isFromMentor ? "bg-primary text-primary-foreground" : "bg-white border shadow-sm"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t flex gap-2">
                <Input 
                  value={messageInput} 
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type advice..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage}><Send className="h-4 w-4"/></Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Networking;