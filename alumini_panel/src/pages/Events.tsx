import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  MapPin,
  Users,
  QrCode,
  CreditCard,
  Loader2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  query,
  serverTimestamp,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "pk_test_your_key");

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  image?: string;
  venue: string;
  price?: number;
  maxCapacity?: number;
  registeredUsers?: string[];
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [ticketEvent, setTicketEvent] = useState<Event | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const user = auth.currentUser;
  const currentUserId = user?.uid || "guest_user";

  // Helper to get category-based images
  const getEventPlaceholder = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("workshop") || cat.includes("seminar")) 
      return "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800";
    if (cat.includes("networking") || cat.includes("meetup")) 
      return "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800";
    if (cat.includes("social") || cat.includes("party")) 
      return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800";
    if (cat.includes("reunion") || cat.includes("outdoor")) 
      return "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=800";
    return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800";
  };

  useEffect(() => {
    const q = query(collection(db, "events"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData: Event[] = [];
      const registeredIds = new Set<string>();

      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Event, 'id'>;
        eventsData.push({ id: doc.id, ...data });
        if (data.registeredUsers?.includes(currentUserId)) {
          registeredIds.add(doc.id);
        }
      });

      setEvents(eventsData);
      setRegisteredEvents(registeredIds);
      setLoading(false);
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUserId]);

  const handleRsvp = async (event: Event) => {
    if (registeredEvents.has(event.id)) {
      setTicketEvent(event);
      return;
    }

    if (event.price && event.price > 0) {
      setSelectedEvent(event);
      setShowPayment(true);
      return;
    }

    try {
      await updateDoc(doc(db, "events", event.id), {
        registeredUsers: arrayUnion(currentUserId),
        attendees: increment(1),
      });
      toast({ title: "Success!", description: "You are registered for this event." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const formatDate = (ds: string) => ds ? new Date(ds).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : "TBA";

  if (loading) return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="font-medium text-muted-foreground">Syncing live events...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-extrabold tracking-tight">Upcoming Events</h1>
        <p className="text-lg text-muted-foreground mt-2">Discover, join and increase your connections.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => {
          const isRegistered = registeredEvents.has(event.id);
          const isFull = event.maxCapacity && event.attendees >= event.maxCapacity;
          const eventImg = event.image || getEventPlaceholder(event.category);

          return (
            <motion.div 
              key={event.id} 
              layout 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group glass-card overflow-hidden border rounded-2xl flex flex-col hover:shadow-2xl transition-all duration-500 bg-card"
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={eventImg} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Badge className="absolute top-4 right-4 bg-white/90 text-black hover:bg-white">{event.category}</Badge>
              </div>

              <div className="p-6 space-y-5 flex-1 flex flex-col">
                <div className="space-y-2">
                  <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors">{event.title}</h3>
                  <div className="flex items-center gap-2 text-primary text-sm font-bold">
                    <Calendar className="h-4 w-4"/> 
                    {formatDate(event.date)}  {event.time}
                  </div>
                </div>
                
                <div className="space-y-3 text-sm text-muted-foreground flex-1">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-primary shrink-0"/> 
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{event.venue}</span>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary shrink-0"/> 
                    <span className="font-medium">
                      {event.attendees} {event.maxCapacity ? `/ ${event.maxCapacity}` : ""} Joined
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4 rounded-xl py-6" 
                  variant={isRegistered ? "outline" : "default"}
                  disabled={isFull && !isRegistered}
                  onClick={() => handleRsvp(event)}
                >
                  {isRegistered ? (
                    <><QrCode className="mr-2 h-4 w-4"/> Digital Ticket</>
                  ) : isFull ? (
                    "Event Full"
                  ) : (
                    `Reserve Spot ${event.price ? `(₹${event.price})` : '— Free'}`
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Ticket Dialog */}
      <Dialog open={!!ticketEvent} onOpenChange={() => setTicketEvent(null)}>
        <DialogContent className="sm:max-w-xs text-center p-0 overflow-hidden rounded-[2rem]">
          <div className="bg-primary p-8 text-primary-foreground relative">
             <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <h2 className="text-2xl font-black uppercase italic">Confirmed</h2>
            <p className="text-xs font-medium tracking-tighter opacity-80">Mumbai Event Pass</p>
          </div>
          <div className="p-8 flex flex-col items-center gap-6 bg-white">
            <div className="p-3 bg-white shadow-[0_0_20px_rgba(0,0,0,0.1)] rounded-2xl border">
              <QRCodeSVG 
                value={`ALUMNI-${ticketEvent?.id}-${currentUserId}`} 
                size={160}
                level="H"
              />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-xl">{ticketEvent?.title}</p>
              <p className="text-sm text-muted-foreground">Venue: {ticketEvent?.venue}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;