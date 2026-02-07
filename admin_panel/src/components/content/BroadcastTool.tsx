import { useState } from "react";
import { CalendarDays, Send, MapPin, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function EventCreator() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    eventName: "",
    dateTime: "",
    location: "",
    type: "networking",
    description: "",
    entryFee: "", // 🔹 NEW
  });

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!form.eventName || !form.dateTime || !form.location) {
      toast.error("Required fields missing", {
        description: "Please provide a name, date, and location.",
      });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "events"), {
        name: form.eventName,
        date: form.dateTime,
        venue: form.location,
        category: form.type,
        description: form.description,
        entryFee: Number(form.entryFee) || 0, // 🔹 STORED AS NUMBER
        status: "upcoming",
        createdAt: serverTimestamp(),
      });

      toast.success("Event Published!", {
        description: `${form.eventName} is now live in the database.`,
      });

      setForm({
        eventName: "",
        dateTime: "",
        location: "",
        type: "networking",
        description: "",
        entryFee: "",
      });
    } catch (error: any) {
      console.error("Firestore Write Error:", error);
      toast.error("Backend Connection Failed", {
        description: error.message || "Could not save event.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form
        onSubmit={handleCreateEvent}
        className="rounded-xl glass-card card-gradient-border p-6 space-y-5 border border-white/5 bg-[#0a0c10]"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <CalendarDays className="h-4 w-4 text-blue-500 icon-glow" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Event Management</h3>
            <p className="text-xs text-muted-foreground">
              Broadcast to the community
            </p>
          </div>
        </div>

        {/* Event Name */}
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase">Event Name *</Label>
          <Input
            value={form.eventName}
            onChange={(e) =>
              setForm({ ...form, eventName: e.target.value })
            }
            placeholder="e.g. Alumni Homecoming 2026"
          />
        </div>

        {/* Date & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-mono uppercase">
              Date & Time *
            </Label>
            <Input
              type="datetime-local"
              value={form.dateTime}
              onChange={(e) =>
                setForm({ ...form, dateTime: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-mono uppercase">Category</Label>
            <Select
              value={form.type}
              onValueChange={(val) =>
                setForm({ ...form, type: val })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="reunion">Reunion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase">
            Location / Venue *
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
            <Input
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
              placeholder="Physical address or digital link"
              className="pl-10"
            />
          </div>
        </div>

        {/* 🔹 ENTRY FEE */}
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase">
            Entry Fee (₹)
          </Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/50" />
            <Input
              type="number"
              min="0"
              value={form.entryFee}
              onChange={(e) =>
                setForm({ ...form, entryFee: e.target.value })
              }
              placeholder="0"
              className="pl-10"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-xs font-mono uppercase">Details</Label>
          <Textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={3}
          />
        </div>

        {/* Submit */}
        <Button type="submit" disabled={loading} className="w-full">
          <Send className="h-4 w-4 mr-2" />
          {loading ? "Syncing with Database..." : "Publish Event"}
        </Button>
      </form>
    </div>
  );
}
