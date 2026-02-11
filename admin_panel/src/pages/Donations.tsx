import { useEffect, useState } from "react";
import {
  IndianRupee,
  Target,
  Loader2,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import AppLayout from "@/components/layout/AppLayout";

type Donation = {
  id: string;
  title_of_the_cause: string;
  description_title: string;
  field: string;
  type: string;
  goalAmount: string;
  raised_amount: string;
};

export default function DonationPage() {
  const [activeTab, setActiveTab] = useState<"create" | "progress">("create");
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    field: "",
    type: "",
    goalAmount: "",
  });

  /* ---------------- CREATE DONATION ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.field ||
      !form.type ||
      !form.goalAmount
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "donation"), {
        title_of_the_cause: form.title,
        description_title: form.description,
        field: form.field,
        type: form.type,
        goalAmount: `₹${form.goalAmount}`,
        raised_amount: "₹0",
        donoursCount: "0",
        createdAt: serverTimestamp(),
      });

      toast.success("Donation goal created");
      setForm({
        title: "",
        description: "",
        field: "",
        type: "",
        goalAmount: "",
      });
    } catch {
      toast.error("Failed to create donation goal");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH DONATIONS ---------------- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "donation"), (snap) => {
      const data: Donation[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Donation, "id">),
      }));
      setDonations(data);
    });

    return () => unsub();
  }, []);

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "donation", id));
    toast.success("Donation deleted");
  };

  /* ---------------- EDIT ---------------- */
  const startEdit = (d: Donation) => {
    setEditingId(d.id);
    setEditForm({
      title_of_the_cause: d.title_of_the_cause,
      description_title: d.description_title,
      field: d.field,
      type: d.type,
      goalAmount: d.goalAmount.replace("₹", ""),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async (id: string) => {
    await updateDoc(doc(db, "donation", id), {
      title_of_the_cause: editForm.title_of_the_cause,
      description_title: editForm.description_title,
      field: editForm.field,
      type: editForm.type,
      goalAmount: `₹${editForm.goalAmount}`,
    });

    toast.success("Donation goal updated");
    cancelEdit();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="animate-fade-up" style={{ animationDelay: '80ms' }}>
          <h1 className="text-2xl font-bold">DONATIONS</h1>
          <p className="text-sm text-muted-foreground">
            Manage donation goals and track progress
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 text-sm rounded-md ${
                activeTab === "create"
                  ? "bg-blue-600 text-white"
                  : "bg-muted/40"
              }`}
            >
              Create Goal
            </button>
            <button
              onClick={() => setActiveTab("progress")}
              className={`px-4 py-2 text-sm rounded-md ${
                activeTab === "progress"
                  ? "bg-blue-600 text-white"
                  : "bg-muted/40"
              }`}
            >
              Progress
            </button>
          </div>
        </div>

        {/* ---------------- CREATE TAB ---------------- */}
        {activeTab === "create" && (
          <div className="max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '80ms' }}>
            <form
              onSubmit={handleSubmit}
              className="rounded-xl glass-card p-6 space-y-5 bg-[#0a0c10]"
            >
              <Input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Field"
                  value={form.field}
                  onChange={(e) =>
                    setForm({ ...form, field: e.target.value })
                  }
                />
                <Input
                  placeholder="Type"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                />
              </div>
              <Input
                type="number"
                placeholder="Goal Amount"
                value={form.goalAmount}
                onChange={(e) =>
                  setForm({ ...form, goalAmount: e.target.value })
                }
              />
              <Button className="w-full bg-blue-600">
                Create Donation Goal
              </Button>
            </form>
          </div>
        )}

        {/* ---------------- PROGRESS TAB ---------------- */}
        {activeTab === "progress" && (
          <div className="space-y-4">
            {donations.map((d) => {
              const isEditing = editingId === d.id;
              const goal = Number(d.goalAmount.replace("₹", ""));
              const raised = Number(d.raised_amount.replace("₹", ""));
              const percent = Math.min((raised / goal) * 100, 100);

              return (
                <div
                  key={d.id}
                  className="glass-card p-5 rounded-xl border border-white/5"
                >
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={editForm.title_of_the_cause}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            title_of_the_cause: e.target.value,
                          })
                        }
                      />
                      <Textarea
                        value={editForm.description_title}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description_title: e.target.value,
                          })
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={editForm.field}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              field: e.target.value,
                            })
                          }
                        />
                        <Input
                          value={editForm.type}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              type: e.target.value,
                            })
                          }
                        />
                      </div>
                      <Input
                        type="number"
                        value={editForm.goalAmount}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            goalAmount: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600"
                          onClick={() => saveEdit(d.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">
                          {d.title_of_the_cause}
                        </h4>
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(d)}>
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(d.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">
                        {d.raised_amount} / {d.goalAmount}
                      </p>

                      <div className="w-full h-2 bg-muted/40 rounded-full mt-2">
                        <div
                          className="h-2 bg-blue-600 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
