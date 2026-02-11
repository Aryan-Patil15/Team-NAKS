import { useState, useEffect, useMemo } from "react";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

/* ---------------- TYPE ---------------- */

type AluminiRow = {
  id: string;
  name: string;
  branch: string;
  designation: string;
  company: string;
  city: string;
  year: string;
  available: string;
};

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          {Array.from({ length: 7 }).map((_, j) => (
            <TableCell key={j}>
              <div className="h-4 w-full max-w-[120px] rounded bg-secondary" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default function AluminiDirectory() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<AluminiRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAlumini();
  }, []);

  async function loadAlumini() {
    try {
      const snap = await getDocs(collection(db, "alumini"));

      const data: AluminiRow[] = snap.docs.map((d) => {
        const a = d.data();

        return {
          id: d.id,
          name: String(a.name ?? ""),
          branch: String(a.branch ?? ""),
          designation: String(a.designation ?? ""),
          company: String(a.employerDetails ?? ""),
          city: String(a.currentCity ?? ""),
          year: String(a.yearOfPassing ?? ""),
          available: String(a.isAvailable ?? ""),
        };
      });

      setRows(data);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    return rows.filter((r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rows, searchQuery]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">Alumni Directory</h1>
          <p className="text-sm text-muted-foreground">Faculty view of alumni records</p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-0">
            3
          </Badge>
        </Button>
        </div>
    </header>

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="flex items-center justify-between">
    <div className="relative max-w-sm w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9"
      />
    </div>

    {!loading && (
  <div className="px-3 py-1.5 rounded-full bg-secondary/40 border border-border/40 text-sm text-muted-foreground glow-card">
    <span className="text-foreground font-medium">{filtered.length}</span>{" "}
    Alumni Found
  </div>
)}

  </div>

        {/* Table */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Passing Year</TableHead>
                <TableHead>Available</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No alumni found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((a) => (
                  <TableRow key={a.id} className="hover:bg-secondary/30">
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell>{a.branch}</TableCell>
                    <TableCell>{a.designation}</TableCell>
                    <TableCell>{a.company}</TableCell>
                    <TableCell>{a.city}</TableCell>
                    <TableCell>{a.year}</TableCell>
                    <TableCell>
                      <Badge variant={a.available === "Yes" ? "default" : "secondary"}>
                        {a.available}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
