'use client';

import { useAuth } from '@/app/context/AuthContext';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function TestLimitCheck() {
  const { user, userProfile } = useAuth();

  const getTestLimit = () => {
    if (!user) return 1; // 1 free test without login
    if (!userProfile) return 0;
    if (userProfile.isPremium) return 20; // 20 per day for premium
    return 3; // 3 tests for logged in users
  };

  const getTestsRemaining = () => {
    if (!userProfile) return 0;
    return getTestLimit() - (userProfile.testsUsed || 0);
  };

  const canUseTest = () => {
    return getTestsRemaining() > 0;
  };

  const useOneTest = async () => {
    if (!user || !userProfile) {
      // Increment guest test count (stored in sessionStorage)
      const guestTests = parseInt(sessionStorage.getItem('guestTests') || '0');
      if (guestTests >= 1) {
        throw new Error('Kostenlose Tests aufgebraucht. Bitte melden Sie sich an.');
      }
      sessionStorage.setItem('guestTests', String(guestTests + 1));
      return;
    }

    if (!canUseTest()) {
      if (userProfile.isPremium) {
        throw new Error('Premium Tests für heute aufgebraucht.');
      }
      throw new Error('Tests aufgebraucht. Bitte aktualisieren Sie auf Premium.');
    }

    // Update tests used in Firestore
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      testsUsed: increment(1),
      lastTestDate: new Date(),
    });
  };

  return {
    canUseTest,
    useOneTest,
    testsRemaining: getTestsRemaining(),
    testLimit: getTestLimit(),
    isPremium: userProfile?.isPremium || false,
  };
}
