import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Props = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: Props) {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const getCookie = (name: string) => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
};

  useEffect(() => {
    const checkAccess = async () => {
      const adminId = getCookie("admin_session");
      if (!adminId) {
        setAllowed(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "admin", adminId));

        // ❌ No DB record or inactive
        if (!snap.exists() || snap.data().status !== "active") {
          setAllowed(false);
          return;
        }

        // ✅ Allowed
        setAllowed(true);
      } catch (err) {
        console.error("Auth check failed:", err);
        setAllowed(false);
      }
    };

    checkAccess();
  }, []);

  // ⏳ Wait for check
  if (allowed === null) return null;

  // ❌ Redirect if not allowed
  if (!allowed) return <Navigate to="/" replace />;

  // ✅ Render protected page
  return children;
}
