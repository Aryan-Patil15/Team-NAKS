// Core data interfaces for the Faculty Dashboard

export interface Announcement {
  id: string;
  title: string;
  date: string;
  content: string;
  batch: string;
  isPinned: boolean;
}

export interface Alumni {
  id: string;
  name: string;
  company: string;
  graduationYear: number;
  engagementScore: number;
}

export interface Stats {
  label: string;
  value: string | number;
  iconName: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}
