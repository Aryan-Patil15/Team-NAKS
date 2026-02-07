export interface PendingUser {
  id: string;
  name: string;
  email: string;
  graduationYear: number;
  degree: string;
  appliedAt: string;
  avatarInitials: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "alumni" | "moderator";
  graduationYear: number;
  status: "active" | "suspended";
}

export interface PendingJob {
  id: string;
  title: string;
  company: string;
  postedBy: string;
  postedAt: string;
  type: "Full-time" | "Part-time" | "Internship" | "Contract";
  location: string;
  description: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  status: "upcoming" | "past" | "draft";
}

export const pendingUsers: PendingUser[] = [
  { id: "1", name: "Sarah Chen", email: "sarah.chen@alumni.edu", graduationYear: 2021, degree: "B.S. Computer Science", appliedAt: "2 hours ago", avatarInitials: "SC" },
  { id: "2", name: "Marcus Johnson", email: "m.johnson@alumni.edu", graduationYear: 2019, degree: "MBA Finance", appliedAt: "5 hours ago", avatarInitials: "MJ" },
  { id: "3", name: "Priya Patel", email: "priya.p@alumni.edu", graduationYear: 2022, degree: "M.S. Data Science", appliedAt: "1 day ago", avatarInitials: "PP" },
  { id: "4", name: "James O'Brien", email: "j.obrien@alumni.edu", graduationYear: 2018, degree: "B.A. Economics", appliedAt: "1 day ago", avatarInitials: "JO" },
  { id: "5", name: "Aisha Williams", email: "a.williams@alumni.edu", graduationYear: 2023, degree: "B.S. Mechanical Eng.", appliedAt: "2 days ago", avatarInitials: "AW" },
];

export const managedUsers: ManagedUser[] = [
  { id: "u1", name: "Elena Rodriguez", email: "elena.r@alumni.edu", role: "alumni", graduationYear: 2020, status: "active" },
  { id: "u2", name: "David Kim", email: "d.kim@student.edu", role: "student", graduationYear: 2025, status: "active" },
  { id: "u3", name: "Rachel Foster", email: "r.foster@alumni.edu", role: "moderator", graduationYear: 2017, status: "active" },
  { id: "u4", name: "Tomás Silva", email: "t.silva@student.edu", role: "student", graduationYear: 2026, status: "active" },
  { id: "u5", name: "Nina Kapoor", email: "n.kapoor@alumni.edu", role: "alumni", graduationYear: 2019, status: "suspended" },
];

export const pendingJobs: PendingJob[] = [
  { id: "j1", title: "Software Engineer II", company: "TechCorp Inc.", postedBy: "Elena Rodriguez", postedAt: "3 hours ago", type: "Full-time", location: "San Francisco, CA", description: "Looking for a mid-level engineer to join our platform team. React & Node.js experience required." },
  { id: "j2", title: "Data Analyst Intern", company: "DataFlow Labs", postedBy: "Marcus Johnson", postedAt: "8 hours ago", type: "Internship", location: "Remote", description: "Summer internship opportunity for students interested in data analytics and visualization." },
  { id: "j3", title: "Product Manager", company: "StartupXYZ", postedBy: "Rachel Foster", postedAt: "1 day ago", type: "Full-time", location: "New York, NY", description: "Lead product strategy for our B2B SaaS platform. 3+ years PM experience preferred." },
];

export const events: Event[] = [
  { id: "e1", title: "Annual Alumni Gala 2026", date: "2026-03-15", location: "Grand Ballroom, University Campus", description: "Join us for an evening of networking, awards, and celebration.", status: "upcoming" },
  { id: "e2", title: "Tech Talk: AI in Healthcare", date: "2026-02-20", location: "https://zoom.us/j/123456", description: "Guest speaker Dr. Lisa Wang discusses the latest AI innovations in healthcare.", status: "upcoming" },
  { id: "e3", title: "Career Fair Spring 2026", date: "2026-04-10", location: "Student Center, Hall B", description: "Connect with 50+ employers looking for talented alumni and students.", status: "draft" },
];

export const dashboardMetrics = {
  totalUsers: 12847,
  alumni: 8932,
  students: 3915,
  totalDonations: 2847500,
  activeJobListings: 156,
  pendingApprovals: pendingUsers.length,
  eventsThisMonth: 4,
  monthlyActiveUsers: 3241,
};
