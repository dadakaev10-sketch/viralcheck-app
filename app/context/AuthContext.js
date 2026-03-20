'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext(null);
const FREE_LIMIT = 3;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        const ref = doc(db, 'users', fbUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setAnalysisCount(snap.data().analysisCount || 0);
          setCredits(snap.data().credits || 0);
        } else {
          await setDoc(ref, {
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            analysisCount: 0,
            credits: 0,
            createdAt: new Date(),
          });
          setAnalysisCount(0);
          setCredits(0);
        }
      } else {
        setUser(null);
        setAnalysisCount(0);
        setCredits(0);
      }
      setAuthLoading(false);
    });
    return unsub;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOutUser = async () => {
    await fbSignOut(auth);
  };

  const incrementUsage = async () => {
    if (!user) return;
    const ref = doc(db, 'users', user.uid);
    if (credits > 0) {
      // Use a credit first
      await updateDoc(ref, { credits: increment(-1) });
      setCredits((c) => c - 1);
    } else {
      // Use free quota
      await updateDoc(ref, { analysisCount: increment(1) });
      setAnalysisCount((c) => c + 1);
    }
  };

  // Can analyze if has credits OR free quota remaining
  const canAnalyze = credits > 0 || analysisCount < FREE_LIMIT;
  const freeRemaining = Math.max(0, FREE_LIMIT - analysisCount);
  const remaining = credits > 0 ? credits : freeRemaining;
  const isPremium = credits > 0;

  return (
    <AuthContext.Provider value={{
      user, authLoading, analysisCount, credits, canAnalyze, remaining, isPremium,
      signInWithGoogle, signOut: signOutUser, incrementUsage,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
