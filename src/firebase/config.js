import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC6NCVMlJESFtj3bw6VbhcUqpGoV3_HtSw",
  authDomain: "gdghackathon-225e4.firebaseapp.com",
  projectId: "gdghackathon-225e4",
  storageBucket: "gdghackathon-225e4.firebasestorage.app",
  messagingSenderId: "1059573945689",
  appId: "1:1059573945689:web:94e2fef70e6ed3db126848",
  measurementId: "G-P54F9LE2GZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
