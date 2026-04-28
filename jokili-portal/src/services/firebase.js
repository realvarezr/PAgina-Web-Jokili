import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBUGhPXTI1TjLewc0lNN_lS_7A1zxy5J4",
  authDomain: "jokili-portal.firebaseapp.com",
  projectId: "jokili-portal",
  storageBucket: "jokili-portal.firebasestorage.app",
  messagingSenderId: "1010420706697",
  appId: "1:1010420706697:web:517aa988a33cfc968b4558"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
export default app;
