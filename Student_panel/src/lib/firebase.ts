import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // For Database
import { getAuth } from "firebase/auth";           // For Authentication
import { getStorage } from "firebase/storage";     // For File Uploads

const firebaseConfig = {
  apiKey: "AIzaSyCplFPhPpAyjs7cLh_pgwokRADfuv5YiHs",
  authDomain: "alumini-meet-8b114.firebaseapp.com",
  projectId: "alumini-meet-8b114",
  storageBucket: "alumini-meet-8b114.firebasestorage.app",
  messagingSenderId: "1021220913689",
  appId: "1:1021220913689:web:430c9b3cf5c45aeac16088",
  measurementId: "G-LTYVB0P18Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and Export Services
export const auth = getAuth(app);
export const db = getFirestore(app,"alumini2");
export const storage = getStorage(app);

// Analytics (Only runs in browser environments)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;