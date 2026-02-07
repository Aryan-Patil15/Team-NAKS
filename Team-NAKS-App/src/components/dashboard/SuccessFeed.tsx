import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  Heart,
  MessageCircle,
  Trophy,
} from "lucide-react";

interface FeedItem {
  id: number;
  author: string;
  initials: string;
  batch: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  liked: boolean;
}

const initialFeed: FeedItem[] = [
  {
    id: 1,
    author: "Kavya Nair",
    initials: "KN",
    batch: "2022",
    content: "Just closed a Series A for my startup! 🚀 Grateful to the alumni network for all the introductions.",
    likes: 42,
    comments: 8,
    time: "2h ago",
    liked: false,
  },
  {
    id: 2,
    author: "Rohan Mehta",
    initials: "RM",
    batch: "2023",
    content: "Thrilled to join Google as a Senior SWE! The mentorship from alumni in this community played a huge role. 🙏",
    likes: 67,
    comments: 15,
    time: "5h ago",
    liked: false,
  },
  {
    id: 3,
    author: "Ananya Desai",
    initials: "AD",
    batch: "2021",
    content: "Our paper on federated learning just got accepted at NeurIPS! Proud moment for our university. 🎉",
    likes: 89,
    comments: 12,
    time: "1d ago",
    liked: false,
  },
];

export function SuccessFeed() {
  const [feed, setFeed] = useState<FeedItem[]>(initialFeed);
  const [newPost, setNewPost] = useState("");
  const { toast } = useToast();

  const handlePost = () => {
    if (!newPost.trim()) return;

    const post: FeedItem = {
      id: feed.length + 1,
      author: "Arjun Raghavan",
      initials: "AR",
      batch: "2024",
      content: newPost,
      likes: 0,
      comments: 0,
      time: "Just now",
      liked: false,
    };

    setFeed([post, ...feed]);
    setNewPost("");
    toast({
      title: "Achievement Shared! 🎉",
      description: "Your success story is now live on the community wall.",
    });
  };

  const toggleLike = (id: number) => {
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, liked: !item.liked, likes: item.liked ? item.likes - 1 : item.likes + 1 }
          : item
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Success Feed</h2>
      </div>

      {/* Post input */}
      <div className="glass-card p-4">
        <div className="flex gap-3">
          <div className="h-9 w-9 rounded-full gradient-electric flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
            AR
          </div>
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Share an achievement with your alumni community..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={2}
              className="resize-none text-sm bg-secondary/30 border-border/50"
            />
            <div className="flex justify-end">
              <Button size="sm" onClick={handlePost} disabled={!newPost.trim()}>
                <Send className="h-4 w-4 mr-1.5" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <AnimatePresence>
        {feed.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-5"
          >
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                {item.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{item.author}</p>
                  <span className="badge-gold text-[10px]">Batch {item.batch}</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0 font-mono">{item.time}</span>
                </div>
                <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{item.content}</p>
                <div className="flex items-center gap-4 mt-3">
                  <button
                    onClick={() => toggleLike(item.id)}
                    className={`flex items-center gap-1 text-xs transition-all duration-200 ${
                      item.liked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                    }`}
                  >
                    <Heart className={`h-3.5 w-3.5 ${item.liked ? "fill-current" : ""}`} />
                    {item.likes}
                  </button>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {item.comments}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
