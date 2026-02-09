import type { Announcement, Alumni, Event, Stats } from "@/types";

export const mockStats: Stats[] = [
  {
    label: "Total Alumni",
    value: "12,847",
    iconName: "users",
    trend: { value: 12, isPositive: true },
  },
  {
    label: "Active Engagements",
    value: "1,234",
    iconName: "activity",
    trend: { value: 8, isPositive: true },
  },
  {
    label: "This Month Events",
    value: "18",
    iconName: "calendar",
    trend: { value: 5, isPositive: false },
  },
  {
    label: "Announcements",
    value: "47",
    iconName: "megaphone",
    trend: { value: 23, isPositive: true },
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Annual Alumni Meet 2024 - Registration Now Open",
    date: "Feb 15, 2024",
    category: "event",
    isPinned: true,
  },
  {
    id: "2",
    title: "New Scholarship Program for Current Students",
    date: "Feb 12, 2024",
    category: "academic",
    isPinned: true,
  },
  {
    id: "3",
    title: "Campus Infrastructure Updates - New Library Wing",
    date: "Feb 10, 2024",
    category: "general",
    isPinned: false,
  },
  {
    id: "4",
    title: "Urgent: Semester Exam Schedule Changes",
    date: "Feb 8, 2024",
    category: "urgent",
    isPinned: false,
  },
  {
    id: "5",
    title: "Guest Lecture Series by Industry Experts",
    date: "Feb 5, 2024",
    category: "academic",
    isPinned: false,
  },
  {
    id: "6",
    title: "Sports Day 2024 - Call for Volunteers",
    date: "Feb 3, 2024",
    category: "event",
    isPinned: false,
  },
];

export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Alumni Networking Mixer",
    date: "2024-02-20",
    time: "6:00 PM",
    location: "Grand Hall",
  },
  {
    id: "2",
    title: "Career Workshop: Tech Industry",
    date: "2024-02-22",
    time: "2:00 PM",
    location: "Auditorium A",
  },
  {
    id: "3",
    title: "Board of Trustees Meeting",
    date: "2024-02-25",
    time: "10:00 AM",
    location: "Conference Room 1",
  },
  {
    id: "4",
    title: "Research Symposium",
    date: "2024-02-28",
    time: "9:00 AM",
    location: "Science Building",
  },
];

export const mockAlumni: Alumni[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    company: "Google",
    graduationYear: 2018,
    engagementScore: 92,
  },
  {
    id: "2",
    name: "Michael Chen",
    company: "Microsoft",
    graduationYear: 2019,
    engagementScore: 88,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    company: "Amazon",
    graduationYear: 2020,
    engagementScore: 76,
  },
  {
    id: "4",
    name: "David Kim",
    company: "Apple",
    graduationYear: 2017,
    engagementScore: 95,
  },
  {
    id: "5",
    name: "Jessica Patel",
    company: "Meta",
    graduationYear: 2021,
    engagementScore: 64,
  },
  {
    id: "6",
    name: "Ryan Thompson",
    company: "Netflix",
    graduationYear: 2019,
    engagementScore: 81,
  },
  {
    id: "7",
    name: "Amanda Lee",
    company: "Spotify",
    graduationYear: 2020,
    engagementScore: 73,
  },
  {
    id: "8",
    name: "Christopher Brown",
    company: "Tesla",
    graduationYear: 2016,
    engagementScore: 89,
  },
  {
    id: "9",
    name: "Michelle Wang",
    company: "Adobe",
    graduationYear: 2018,
    engagementScore: 67,
  },
  {
    id: "10",
    name: "James Wilson",
    company: "Salesforce",
    graduationYear: 2022,
    engagementScore: 54,
  },
];

export const graduationYears = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
