import AppLayout from "@/components/layout/AppLayout";
import { UserCheck, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* 🔹 Firestore Alumni Schema (EXACT match) */
type Alumni = {
  id: string;
  name: string;
  emailId: string;
  phoneNumber: string;
  branch: string;
  designation: string;
  employerDetails: string;
  currentCity: string;
  yearOfPassing: string;
};

export default function AlumniListPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* 🔹 Fetch alumni from Firestore */
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const snapshot = await getDocs(collection(db, "alumini"));
        const data: Alumni[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Alumni, "id">),
        }));
        setAlumni(data);
      } catch (error) {
        console.error("Failed to fetch alumni:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  /* 🔹 Search logic */
  const filtered = alumni.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.emailId.toLowerCase().includes(search.toLowerCase()) ||
      a.employerDetails.toLowerCase().includes(search.toLowerCase()) ||
      a.branch.toLowerCase().includes(search.toLowerCase()) ||
      a.currentCity.toLowerCase().includes(search.toLowerCase()) ||
      a.designation.toLowerCase().includes(search.toLowerCase()) ||
      a.yearOfPassing.includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between animate-fade-up">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Alumni List
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse registered alumni members
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserCheck className="h-4 w-4 text-primary icon-glow" />
            </div>
            <span className="text-lg font-bold font-mono">
              {alumni.length}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative animate-fade-up" style={{ animationDelay: "80ms" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, company, branch, city, or designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card border-border text-sm h-10"
          />
        </div>

        {/* Table */}
        <div
          className="rounded-xl glass-card card-gradient-border overflow-hidden animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-sm text-muted-foreground text-center">
                Loading alumni...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground text-center">
                No alumni data found
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">Name</th>
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">Branch</th>
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">Company</th>
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">Designation</th>
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">City</th>
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">Year</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((person, index) => (
                    <tr
                      key={person.id}
                      className="border-b border-border/30 last:border-0 hover:bg-primary/5 transition-colors animate-fade-up"
                      style={{ animationDelay: `${240 + index * 60}ms` }}
                    >
                      {/* Name + Email */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary font-mono">
                              {person.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{person.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {person.emailId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-sm text-muted-foreground">
                        {person.branch}
                      </td>

                      <td className="px-5 py-3.5 text-sm">
                        {person.employerDetails}
                      </td>

                      <td className="px-5 py-3.5 text-sm text-muted-foreground">
                        {person.designation}
                      </td>

                      <td className="px-5 py-3.5 text-sm">
                        {person.currentCity}
                      </td>

                      <td className="px-5 py-3.5 text-sm font-mono">
                        {person.yearOfPassing}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
