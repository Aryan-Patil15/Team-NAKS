import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  onSnapshot, 
  Timestamp 
} from "firebase/firestore";
import { db } from "./firebase"; // Make sure this points to your firebase config
import type { Event } from "@/types";

// Helper to format dates safely
const formatDate = (dateVal: unknown): string => {
  if (!dateVal) return new Date().toISOString();
  if (typeof dateVal === 'string') return dateVal;
  if (dateVal instanceof Timestamp) return dateVal.toDate().toISOString();
  return new Date().toISOString();
};

// 1. Get Upcoming Events (One-time fetch)
export const getUpcomingEvents = async (limitCount: number = 5): Promise<Event[]> => {
  try {
    const q = query(
      collection(db, "events"),
      orderBy("date", "asc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.name || data.title || "Untitled Event",
        description: data.description || "",
        date: formatDate(data.date),
        location: data.venue || data.location || "TBD",
        status: data.status || "upcoming",
        category: data.category || "general",
        attendees: data.attendees || 0,
        time: data.time || ""
      } as Event;
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// 2. Real-time Listener for Events
export const subscribeToEvents = (callback: (data: Event[]) => void) => {
  const q = query(collection(db, "events"), orderBy("date", "asc"));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => {
      const d = doc.data();
      return {
        id: doc.id,
        title: d.name || d.title || "Untitled Event",
        description: d.description || "",
        date: formatDate(d.date),
        location: d.venue || d.location || "TBD",
        status: d.status || "upcoming",
        category: d.category || "general",
        attendees: d.attendees || 0,
        time: d.time || ""
      } as Event;
    });
    callback(data);
  });
};