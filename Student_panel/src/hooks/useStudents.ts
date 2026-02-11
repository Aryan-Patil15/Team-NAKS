import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { db } from "@/lib/firebase";
import { doc, getDoc } from 'firebase/firestore';

export const useStudent = () => {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const sessionCookie = Cookies.get('user_session');
        
        if (!sessionCookie) {
          setError("No session found");
          setLoading(false);
          return;
        }

        const { userId } = JSON.parse(sessionCookie);
        const docRef = doc(db, "student", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setStudent(docSnap.data());
        } else {
          setError("Student document not found");
        }
      } catch (err) {
        setError("Failed to fetch student data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  return { student, loading, error };
};