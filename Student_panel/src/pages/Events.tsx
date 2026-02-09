import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Calendar, Clock, MapPin, Users, Video, CalendarPlus, ExternalLink, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase"; 
import { collection, getDocs, query, doc, updateDoc, arrayUnion } from "firebase/firestore";

// Helper to get student ID from cookies (matching your Jobs page logic)
const getStudentIdFromCookie = () => {
  const name = "user_session=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1);
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
};

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: "webinar" | "workshop" | "networking" | "career-fair" | "reunion";
  location: string;
  speaker: string;
  speakerRole: string;
  attendees: number;
  image: string;
  isLive: boolean;
  countdown?: number;
  registeredUsers: string[];
}

function CountdownTimer({ seconds }: { seconds: number }) {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const secs = time % 60;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <div className="px-3 py-2 rounded-lg bg-primary/20 border border-primary/30">
          <span className="text-2xl font-bold text-primary">{hours.toString().padStart(2, "0")}</span>
        </div>
        <span className="text-primary font-bold">:</span>
        <div className="px-3 py-2 rounded-lg bg-primary/20 border border-primary/30">
          <span className="text-2xl font-bold text-primary">{minutes.toString().padStart(2, "0")}</span>
        </div>
        <span className="text-primary font-bold">:</span>
        <div className="px-3 py-2 rounded-lg bg-primary/20 border border-primary/30">
          <span className="text-2xl font-bold text-primary">{secs.toString().padStart(2, "0")}</span>
        </div>
      </div>
    </div>
  );
}

const typeColors = {
  webinar: "neonViolet",
  workshop: "neonCyan",
  networking: "success",
  "career-fair": "warning",
  reunion: "neonViolet",
} as const;

const typeLabels: Record<string, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  networking: "Networking",
  "career-fair": "Career Fair",
  reunion: "Reunion",
};

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const currentStudentId = getStudentIdFromCookie();

  const fetchEvents = async () => {
    try {
      const eventsRef = collection(db, "events");
      const querySnapshot = await getDocs(query(eventsRef));
      
      const fetchedEvents = querySnapshot.docs.map(doc => {
        const data = doc.data();

        // Fix for "Objects are not valid as a React child" (Timestamp Fix)
        const formatDate = (dateVal: any) => {
          if (!dateVal) return "TBA";
          if (dateVal.toDate) return dateVal.toDate().toLocaleDateString(); 
          if (typeof dateVal === 'string') return dateVal.split('T')[0];
          return "TBA";
        };

        return {
          id: doc.id,
          title: data.name || "Untitled Event",
          description: data.description || "",
          date: formatDate(data.date),
          time: typeof data.date === 'string' ? data.date.split('T')[1] : "TBA",
          type: (data.category || "webinar") as any,
          location: data.venue || "Virtual",
          speaker: data.speaker || "Guest",
          speakerRole: data.speakerRole || "",
          attendees: data.attendees || 0,
          image: data.image || "🎯",
          isLive: data.status === "live", 
          countdown: data.countdown || 3600,
          registeredUsers: data.registeredUsers || [],
        } as Event;
      });

      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string, currentAttendees: number) => {
    if (!currentStudentId) {
      alert("Please log in to register.");
      return;
    }

    try {
      const eventRef = doc(db, "events", eventId);
      
      await updateDoc(eventRef, {
        registeredUsers: arrayUnion(currentStudentId),
        attendees: currentAttendees + 1
      });

      alert("Successfully registered!");
      fetchEvents(); // Refresh data
    } catch (error) {
      console.error("Registration error:", error);
      alert("Error during registration.");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30">
              <Calendar className="h-6 w-6 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Events & Webinars</h1>
          </div>
          <p className="text-muted-foreground">Discover workshops, webinars, and networking opportunities</p>
        </div>

        {/* Featured Live Event */}
        {events.filter((e) => e.isLive).map((event) => (
          <div key={event.id} className="glass-card p-8 mb-8 relative overflow-hidden neon-border-violet">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col lg:flex-row items-start gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="neonViolet" className="animate-pulse">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2 animate-ping" />
                    Starting Soon
                  </Badge>
                  <Badge variant="glass">{typeLabels[event.type] || event.type}</Badge>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">{event.title}</h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{event.description}</p>
                <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>{event.date}</span></div>
                  <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{event.time}</span></div>
                  <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{event.attendees} attending</span></div>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="gradient" size="lg"><Video className="h-4 w-4 mr-2" />Join Live</Button>
                  <Button variant="outline" size="lg" onClick={() => handleRegister(event.id, event.attendees)}>
                    <CalendarPlus className="h-4 w-4 mr-2" />Register Now
                  </Button>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-sm text-muted-foreground mb-3">Starts in</p>
                <CountdownTimer seconds={event.countdown!} />
              </div>
            </div>
          </div>
        ))}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
          {events.filter((e) => !e.isLive).map((event) => {
            const isRegistered = event.registeredUsers?.includes(currentStudentId);

            return (
              <div key={event.id} className="glass-card-hover p-6 group">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl border border-white/10">
                    {event.image}
                  </div>
                  <div className="flex-1">
                    <Badge variant={typeColors[event.type as keyof typeof typeColors] || "neonViolet"} className="mb-2">
                      {typeLabels[event.type] || event.type}
                    </Badge>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{event.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /><span>{event.date}</span></div>
                  <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /><span>{event.time}</span></div>
                  <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /><span>{event.location}</span></div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{event.attendees} attending</span>
                  </div>
                  <Button 
                    variant={isRegistered ? "glass" : "neonViolet"} 
                    size="sm"
                    disabled={isRegistered}
                    onClick={() => handleRegister(event.id, event.attendees)}
                  >
                    {isRegistered ? "Registered" : "Register"}
                    {!isRegistered && <ExternalLink className="h-3.5 w-3.5 ml-2" />}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}