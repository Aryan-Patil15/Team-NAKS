import AppLayout from "@/components/layout/AppLayout";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

/* 🔹 Student schema (EXACT Firestore match) */
type Student = {
  id: string;
  name: string;
  emailId: string;
  phoneNumber: string;
  username: string;
  branch: string;
  graduationYear: string;
};

export default function StudentsListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* 🔹 Fetch students from Firestore */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "student"));
        const data: Student[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Student, "id">),
        }));
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* 🔹 Search logic */
  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.emailId.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase()) ||
      s.username.toLowerCase().includes(search.toLowerCase()) ||
      s.graduationYear.includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between animate-fade-up">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Students List
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and view all enrolled students
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary icon-glow" />
            </div>
            <span className="text-lg font-bold font-mono">
              {students.length}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative animate-fade-up" style={{ animationDelay: "80ms" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, branch, or username..."
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
                Loading students...
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground text-center">
                No student data found
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">
                      Name
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">
                      Branch
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">
                      Username
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-mono uppercase text-muted-foreground">
                      Grad Year
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((student, index) => (
                    <tr
                      key={student.id}
                      className="border-b border-border/30 last:border-0 hover:bg-primary/5 transition-colors animate-fade-up"
                      style={{ animationDelay: `${240 + index * 60}ms` }}
                    >
                      {/* Name + Email */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary font-mono">
                              {student.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {student.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {student.emailId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-sm text-muted-foreground">
                        {student.branch}
                      </td>

                      <td className="px-5 py-3.5 text-sm">
                        {student.username}
                      </td>

                      <td className="px-5 py-3.5 text-sm font-mono">
                        {student.graduationYear}
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
