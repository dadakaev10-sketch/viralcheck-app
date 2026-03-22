'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../lib/firebase';

const AuthContext = createContext(null);
const FREE_LIMIT = 3;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    let unsubSnapshot = null;

    const unsubAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (unsubSnapshot) { unsubSnapshot(); unsubSnapshot = null; }

      if (fbUser) {
        setUser(fbUser);
        const userRef = doc(db, 'users', fbUser.uid);

        // Create doc if it doesn't exist yet
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            email: fbUser.email,
            displayName: fbUser.displayName,
            photoURL: fbUser.photoURL,
            analysisCount: 0,
            credits: 0,
            createdAt: new Date(),
          });
        }

        // Live listener — updates instantly when credits change (e.g. after Telegram payment)
        unsubSnapshot = onSnapshot(userRef, (s) => {
          if (s.exists()) {
            setAnalysisCount(s.data().analysisCount || 0);
            setCredits(s.data().credits || 0);
          }
          setAuthLoading(false);
        });
      } else {
        setUser(null);
        setAnalysisCount(0);
        setCredits(0);
        setAuthLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubSnapshot) unsubSnapshot();
    };
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
    const userRef = doc(db, 'users', user.uid);
    if (credits > 0) {
      await updateDoc(userRef, { credits: increment(-1) });
      setCredits((c) => c - 1);
    } else {
      await updateDoc(userRef, { analysisCount: increment(1) });
      setAnalysisCount((c) => c + 1);
    }
  };

  // Upload regenerated image (base64 data URL) to Firebase Storage
  // Returns download URL or null on failure
  const uploadRegeneratedImage = async (base64DataUrl, analysisId) => {
    if (!user || !base64DataUrl) return null;
    try {
      const storageRef = ref(storage, `users/${user.uid}/analyses/${analysisId}/regenerated.png`);
      await uploadString(storageRef, base64DataUrl, 'data_url');
      return await getDownloadURL(storageRef);
    } catch (err) {
      console.error('Image upload failed:', err);
      return null;
    }
  };

  // Save analysis result to Firestore, optionally with a regenerated image URL
  const saveAnalysis = async (result, platform, category, regeneratedImageUrl = null) => {
    if (!user || !result) return null;
    try {
      const analysesRef = collection(db, 'users', user.uid, 'analyses');
      const docRef = await addDoc(analysesRef, {
        platform,
        category,
        viralScore: result.viralScore ?? 0,
        scores: result.scores ?? {},
        captions: result.captions ?? {},
        hashtags: result.hashtags ?? {},
        wasGutIst: result.wasGutIst ?? [],
        wasVerbessern: result.wasVerbessern ?? [],
        bestPostingTime: result.bestPostingTime ?? '',
        trendWindow: result.trendWindow ?? '',
        imageContent: result.imageContent ?? '',
        regeneratedImageUrl,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (err) {
      console.error('saveAnalysis failed:', err);
      return null;
    }
  };

  // Update an existing analysis with regenerated image URL
  const updateAnalysisImage = async (analysisId, regeneratedImageUrl) => {
    if (!user || !analysisId) return;
    try {
      const analysisRef = doc(db, 'users', user.uid, 'analyses', analysisId);
      await updateDoc(analysisRef, { regeneratedImageUrl });
    } catch (err) {
      console.error('updateAnalysisImage failed:', err);
    }
  };

  // Load last N analyses for the history view
  const loadAnalyses = async (count = 20) => {
    if (!user) return [];
    try {
      const analysesRef = collection(db, 'users', user.uid, 'analyses');
      const q = query(analysesRef, orderBy('createdAt', 'desc'), limit(count));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.error('loadAnalyses failed:', err);
      return [];
    }
  };

  const canAnalyze = credits > 0 || analysisCount < FREE_LIMIT;
  const freeRemaining = Math.max(0, FREE_LIMIT - analysisCount);
  const remaining = credits > 0 ? credits : freeRemaining;
  const isPremium = credits > 0;

  return (
    <AuthContext.Provider value={{
      user, authLoading, analysisCount, credits, canAnalyze, remaining, isPremium,
      signInWithGoogle, signOut: signOutUser, incrementUsage,
      saveAnalysis, uploadRegeneratedImage, updateAnalysisImage, loadAnalyses,
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
