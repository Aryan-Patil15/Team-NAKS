import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Send,
  Heart,
  MessageCircle,
  Trophy,
  Loader2,
} from "lucide-react";

// Firebase
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";

/* ---------------- TYPES ---------------- */

interface FeedItem {
  id: string;
  author: string;
  initials: string;
  batch: string;
  content: string;
  likes: number;
  comments: number;
  likedBy: string[];
  createdAt: any;
}

/* ---------------- COOKIE HELPER ---------------- */

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

export function SuccessFeed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [cookieUserName, setCookieUserName] = useState<string | null>(null);

  const { toast } = useToast();

  /* ---------------- AUTH STATE ---------------- */

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsub();
  }, []);

  /* ---------------- READ COOKIE ---------------- */

  useEffect(() => {
    const nameFromCookie = getCookie("userName");
    setCookieUserName(nameFromCookie);
  }, []);

  /* ---------------- DERIVED STATE ---------------- */

  const canPost = !!user || !!cookieUserName;

  const authorName =
    user?.displayName || cookieUserName || "Alumni Member";

  const authorId = user?.uid || cookieUserName || "guest";

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  /* ---------------- FETCH FEED ---------------- */

  useEffect(() => {
    const q = query(
      collection(db, "success_feed"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FeedItem[];

        setFeed(posts);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, []);

  /* ---------------- POST SUCCESS ---------------- */

  const handlePost = async () => {
    if (!newPost.trim()) return;

    if (!canPost) {
      toast({
        title: "Access denied",
        description: "Login or valid session required.",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    try {
      await addDoc(collection(db, "success_feed"), {
        author: authorName,
        initials: getInitials(authorName),
        batch: "2024",
        content: newPost,
        likes: 0,
        comments: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      });

      setNewPost("");
      toast({
        title: "Success shared 🎉",
        description: "Your achievement is now visible.",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to post. Try again.",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  /* ---------------- LIKE TOGGLE ---------------- */

  const toggleLike = async (postId: string, likedBy: string[]) => {
    if (!canPost) return;

    const postRef = doc(db, "success_feed", postId);
    const hasLiked = likedBy.includes(authorId);

    await updateDoc(postRef, {
      likedBy: hasLiked
        ? arrayRemove(authorId)
        : arrayUnion(authorId),
      likes: increment(hasLiked ? -1 : 1),
    });
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex flex-col items-center py-12 space-y-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading success stories...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold">Success Feed</h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {feed.length} stories
        </span>
      </div>

      {/* Post Box */}
      <div className="glass-card p-4 border border-white/10">
        {canPost ? (
          <div className="flex gap-4">
            <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
              {getInitials(authorName)}
            </div>

            <div className="flex-1 space-y-3">
              <Textarea
                placeholder={`Hi ${authorName.split(" ")[0]}, share your win…`}
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                rows={2}
                className="resize-none"
              />

              <div className="flex justify-between items-center">
                <p className="text-[10px] text-muted-foreground italic">
                  Job updates, startups, achievements 🚀
                </p>

                <Button
                  size="sm"
                  onClick={handlePost}
                  disabled={!newPost.trim() || isPosting}
                >
                  {isPosting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">
            🔒 Login or active session required to share success
          </p>
        )}
      </div>

      {/* Feed */}
      <AnimatePresence>
        {feed.map((item) => {
          const isLiked = item.likedBy?.includes(authorId);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass-card p-5 border border-white/5"
            >
              <div className="flex gap-4">
                

                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-bold text-sm">{item.author}</p>
                    <span className="text-[10px] text-primary">
                      Batch {item.batch}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-foreground/80">
                    {item.content}
                  </p>

                  <div className="flex gap-6 mt-4 pt-4 border-t border-white/5">
                    <button
                      onClick={() => toggleLike(item.id, item.likedBy)}
                      disabled={!canPost}
                      className={`flex items-center gap-2 text-xs font-semibold ${
                        isLiked
                          ? "text-destructive"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isLiked ? "fill-current" : ""
                        }`}
                      />
                      {item.likes}
                    </button>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      {item.comments}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
