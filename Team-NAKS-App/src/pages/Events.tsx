import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  MapPin,
  Users,
  Ticket,
  QrCode,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  category: string;
  image: string;
}

const eventsData: Event[] = [
  {
    id: 1,
    title: "Annual Alumni Reunion 2024",
    date: "March 15, 2024",
    time: "6:00 PM",
    location: "Grand Auditorium, Main Campus",
    attendees: 320,
    category: "Reunion",
    image: "🎓",
  },
  {
    id: 2,
    title: "Tech Networking Night",
    date: "April 5, 2024",
    time: "7:30 PM",
    location: "Innovation Hub, Building 4",
    attendees: 85,
    category: "Networking",
    image: "💡",
  },
  {
    id: 3,
    title: "Startup Founders Meetup",
    date: "April 18, 2024",
    time: "5:00 PM",
    location: "Entrepreneurship Center",
    attendees: 48,
    category: "Networking",
    image: "🚀",
  },
  {
    id: 4,
    title: "Distinguished Alumni Lecture",
    date: "May 2, 2024",
    time: "4:00 PM",
    location: "Convocation Hall",
    attendees: 500,
    category: "Lecture",
    image: "🎤",
  },
  {
    id: 5,
    title: "Sports Day & BBQ",
    date: "May 20, 2024",
    time: "10:00 AM",
    location: "University Grounds",
    attendees: 200,
    category: "Social",
    image: "⚽",
  },
  {
    id: 6,
    title: "Career Fair 2024",
    date: "June 8, 2024",
    time: "9:00 AM",
    location: "Main Exhibition Hall",
    attendees: 150,
    category: "Career",
    image: "💼",
  },
];

const Events = () => {
  const [rsvpd, setRsvpd] = useState<Set<number>>(new Set());
  const [ticketEvent, setTicketEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  const handleRsvp = (event: Event) => {
    if (rsvpd.has(event.id)) {
      setTicketEvent(event);
      return;
    }
    setRsvpd((prev) => new Set([...prev, event.id]));
    toast({
      title: "RSVP Confirmed! 🎉",
      description: `You're registered for ${event.title}`,
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
          Discover & Attend
        </p>
        <h1 className="text-3xl font-bold text-foreground">Events & Ticketing</h1>
        <p className="text-muted-foreground mt-1">
          Reunions, networking nights, and exclusive alumni gatherings.
        </p>
      </motion.div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {eventsData.map((event, i) => {
          const isRsvpd = rsvpd.has(event.id);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="glass-card overflow-hidden group transition-all duration-200"
            >
              {/* Event header */}
              <div className="h-28 gradient-hero flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/50" />
                <span className="text-5xl relative z-10">{event.image}</span>
                <Badge className="absolute top-3 right-3 text-[10px] font-mono" variant="secondary">
                  {event.category}
                </Badge>
              </div>

              <div className="p-5 flex flex-col gap-3">
                <h3 className="text-base font-semibold text-foreground leading-snug">
                  {event.title}
                </h3>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-primary" />
                    {event.date} · {event.time}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-primary" />
                    {event.location}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="h-3 w-3 text-primary" />
                    {event.attendees + (isRsvpd ? 1 : 0)} attending
                  </p>
                </div>

                <Button
                  className="w-full mt-1 transition-all duration-200"
                  variant={isRsvpd ? "outline" : "default"}
                  onClick={() => handleRsvp(event)}
                >
                  {isRsvpd ? (
                    <>
                      <QrCode className="h-4 w-4 mr-1.5" />
                      View Ticket
                    </>
                  ) : (
                    <>
                      <Ticket className="h-4 w-4 mr-1.5" />
                      RSVP
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Ticket Modal */}
      <Dialog open={!!ticketEvent} onOpenChange={() => setTicketEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Ticket</DialogTitle>
          </DialogHeader>
          {ticketEvent && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{ticketEvent.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {ticketEvent.date} · {ticketEvent.time}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ticketEvent.location}
                </p>
              </div>

              <div className="p-4 bg-foreground/5 rounded-xl border border-border">
                <QRCodeSVG
                  value={`ALUMNIHUB-TICKET-${ticketEvent.id}-ARJUN-2024`}
                  size={180}
                  level="M"
                  bgColor="transparent"
                  fgColor="hsl(210, 100%, 56%)"
                />
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">Ticket ID</p>
                <p className="text-sm font-mono font-semibold text-primary">
                  AH-{ticketEvent.id.toString().padStart(4, "0")}-2024
                </p>
              </div>

              <p className="text-[11px] text-muted-foreground text-center">
                Show this QR code at the venue entrance. Screenshot for offline access.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Events;
