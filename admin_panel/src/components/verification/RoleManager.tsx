import { useState } from "react";
import { managedUsers, ManagedUser } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const roleBadgeVariants: Record<string, string> = {
  student: "bg-info/10 text-info border-info/20",
  alumni: "bg-primary/10 text-primary border-primary/20",
  moderator: "bg-accent/10 text-accent border-accent/20",
};

export default function RoleManager() {
  const [users, setUsers] = useState<ManagedUser[]>(managedUsers);

  const handleRoleChange = (userId: string, newRole: ManagedUser["role"]) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    const user = users.find((u) => u.id === userId);
    toast.success(`${user?.name} is now a ${newRole}`);
  };

  return (
    <div className="rounded-xl border border-border bg-card card-elevated overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                User
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Status
              </th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors animate-fade-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <td className="px-5 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <Badge
                    variant="outline"
                    className={`text-[10px] uppercase tracking-wider font-semibold ${
                      user.status === "active"
                        ? "bg-primary/10 text-primary border-primary/20"
                        : "bg-destructive/10 text-destructive border-destructive/20"
                    }`}
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="px-5 py-3.5">
                  <Select
                    value={user.role}
                    onValueChange={(val) => handleRoleChange(user.id, val as ManagedUser["role"])}
                  >
                    <SelectTrigger className="w-[140px] h-8 text-xs bg-muted border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
