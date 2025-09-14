import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBaJ20V4MJn0aDnHVZy3AhNfWnqCg9hW8k",
  authDomain: "travel-agent-admin.firebaseapp.com",
  projectId: "travel-agent-admin",
  storageBucket: "travel-agent-admin.firebasestorage.app",
  messagingSenderId: "45294515438",
  appId: "1:45294515438:web:e4f29b301b890efb8fefff",
  measurementId: "G-BPGBNV2N8Y",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

let analytics: any;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, db, auth, analytics };
