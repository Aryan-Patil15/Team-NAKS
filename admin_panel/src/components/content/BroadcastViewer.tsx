import { useEffect, useState } from "react";
import { CalendarDays, Trash2, Pencil, Check, X } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Event = {
  id: string;
  name: string;
  date: string;
  venue: string;
  category: string;
  description: string;
};

export default function BroadcastViewer() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  /* Fetch events */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "events"), (snap) => {
      const data: Event[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Event, "id">),
      }));
      setEvents(data);
    });

    return () => unsub();
  }, []);

  /* Delete event */
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "events", id));
    toast.success("Event deleted");
  };

  /* Edit logic */
  const startEdit = (event: Event) => {
    setEditingId(event.id);
    setEditForm(event);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    await updateDoc(doc(db, "events", editingId!), {
      name: editForm.name,
      date: editForm.date,
      venue: editForm.venue,
      category: editForm.category,
      description: editForm.description,
    });

    toast.success("Event updated");
    cancelEdit();
  };

  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center">
          No events found
        </p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="glass-card p-5 rounded-xl border border-white/5"
          >
            {editingId === event.id ? (
              <div className="space-y-3">
                <Input
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
                <Input
                  type="datetime-local"
                  value={editForm.date}
                  onChange={(e) =>
                    setEditForm({ ...editForm, date: e.target.value })
                  }
                />
                <Input
                  value={editForm.venue}
                  onChange={(e) =>
                    setEditForm({ ...editForm, venue: e.target.value })
                  }
                />
                <Input
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                />
                <Textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value,
                    })
                  }
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-600"
                    onClick={saveEdit}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(event.date).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => startEdit(event)}>
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(event.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  {event.venue} · {event.category}
                </p>
                <p className="text-sm mt-1">{event.description}</p>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}
