import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function EventForm() {
  const [form, setForm] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      toast.error("Please fill in required fields");
      return;
    }
    toast.success(`Event "${form.title}" created successfully`);
    setForm({ title: "", date: "", location: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 card-elevated space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
          <CalendarPlus className="h-4 w-4 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">Create Event</h3>
          <p className="text-xs text-muted-foreground">Fill in the details below</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Event Title *</Label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Annual Alumni Gala"
            className="bg-muted border-border text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Date *</Label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="bg-muted border-border text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Location / Link</Label>
        <Input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="University Campus or https://zoom.us/..."
          className="bg-muted border-border text-sm"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Description</Label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Brief event description..."
          rows={3}
          className="bg-muted border-border text-sm resize-none"
        />
      </div>

      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
        <CalendarPlus className="h-4 w-4 mr-2" />
        Create Event
      </Button>
    </form>
  );
}
