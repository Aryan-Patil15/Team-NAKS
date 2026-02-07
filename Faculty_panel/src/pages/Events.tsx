import { useState, useEffect } from "react";
import { MapPin, Clock, Plus, X } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Event } from "@/types";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

function EventSkeleton() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="h-16 w-14 rounded-lg bg-secondary" />
        <div className="flex-1">
          <div className="h-5 w-3/4 rounded bg-secondary mb-3" />
          <div className="h-4 w-1/2 rounded bg-secondary mb-2" />
          <div className="h-4 w-1/3 rounded bg-secondary" />
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Networking");
  const [venue, setVenue] = useState("");
  const [fee, setFee] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    const snap = await getDocs(
      query(collection(db, "events"), orderBy("createdAt", "desc"))
    );

    const data: Event[] = snap.docs.map((d) => {
      const e = d.data();
      const eventDate = new Date(e.date);

      return {
        id: d.id,
        title: String(e.name),
        date: eventDate.toISOString(),
        time: eventDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        location: String(e.venue),
      };
    });

    setEvents(data);
    setLoading(false);
  }

  async function addEvent() {
    if (!name || !date || !venue) return;

    await addDoc(collection(db, "events"), {
      name,
      date,
      category,
      venue,
      entryFee: fee,
      description,
      attendees: 0,
      registeredUsers: [],
      status: "upcoming",
      createdAt: serverTimestamp(),
    });

    setOpen(false);
    setName("");
    setDate("");
    setVenue("");
    setFee(0);
    setDescription("");

    loadEvents();
  }

  return (
    <div className="min-h-screen">
      <Header title="Events" subtitle="Upcoming and past events" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <EventSkeleton key={i} />)
            : events.map((event, index) => (
                <div
                  key={event.id}
                  className={cn(
                    "rounded-xl border border-border/50 bg-card p-5",
                    "glow-card transition-smooth hover:border-border",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center min-w-[56px] py-2 px-3 rounded-lg bg-primary/10 text-primary">
                      <span className="text-xs font-medium uppercase">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-2xl font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-2">
                        {event.title}
                      </h3>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* ADD EVENT MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass p-6 rounded-xl w-full max-w-xl space-y-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold">Event Management</h2>
              <X onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>

            <Input placeholder="Event Name *" value={name} onChange={(e) => setName(e.target.value)} />

            <div className="grid grid-cols-2 gap-3">
              <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Networking">Networking</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Reunion">Reunion</SelectItem>
                  <SelectItem value="Social">Social</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input placeholder="Location / Venue *" value={venue} onChange={(e) => setVenue(e.target.value)} />

            <Input
              type="number"
              placeholder="Entry Fee ₹"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
            />

            <Textarea placeholder="Details" value={description} onChange={(e) => setDescription(e.target.value)} />

            <Button className="w-full" onClick={addEvent}>
              Publish Event
            </Button>
          </div>
        </div>
      )}

      <Button
        size="lg"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-glow-lg bg-primary hover:bg-primary/90"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
