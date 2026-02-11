// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);
export const db = getFirestore(app,"alumini2");
export const auth = getAuth(app);