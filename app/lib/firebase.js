import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAC618hKDS-fwbc3zoWF8WpZf7pA7XeysU",
  authDomain: "viralcheck-app.firebaseapp.com",
  projectId: "viralcheck-app",
  storageBucket: "viralcheck-app.firebasestorage.app",
  messagingSenderId: "342539743911",
  appId: "1:342539743911:web:a9c7f41acb185aed9c2182",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const db = getFirestore(app);
