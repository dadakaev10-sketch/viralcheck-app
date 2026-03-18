import { db } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Usage limits
const LIMITS = {
  anonymous: 1,    // Without login: 1 free test
  free: 3,         // With login: 3 free tests
  premium: 20,     // Premium: 20 per day
};

/**
 * Get today's date string in YYYY-MM-DD format (UTC)
 */
function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Check usage and return remaining count.
 * @param {string|null} userId - Firebase UID or null for anonymous
 * @param {string|null} anonId - Anonymous fingerprint/IP for non-logged-in users
 * @returns {{ allowed: boolean, remaining: number, limit: number, used: number, isPremium: boolean }}
 */
export async function checkUsage(userId, anonId) {
  const dateKey = today();

  if (userId) {
    // Logged-in user
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data() || {};
    const isPremium = userData.premium === true;
    const limit = isPremium ? LIMITS.premium : LIMITS.free;

    const usageRef = db.collection('usage').doc(`${userId}_${dateKey}`);
    const usageDoc = await usageRef.get();
    const used = usageDoc.data()?.count || 0;

    return {
      allowed: used < limit,
      remaining: Math.max(0, limit - used),
      limit,
      used,
      isPremium,
    };
  }

  // Anonymous user (by IP)
  const anonRef = db.collection('usage_anon').doc(`${anonId}_${dateKey}`);
  const anonDoc = await anonRef.get();
  const used = anonDoc.data()?.count || 0;

  return {
    allowed: used < LIMITS.anonymous,
    remaining: Math.max(0, LIMITS.anonymous - used),
    limit: LIMITS.anonymous,
    used,
    isPremium: false,
  };
}

/**
 * Increment usage counter after a successful analysis.
 */
export async function incrementUsage(userId, anonId) {
  const dateKey = today();

  if (userId) {
    const usageRef = db.collection('usage').doc(`${userId}_${dateKey}`);
    await usageRef.set(
      { count: FieldValue.increment(1), date: dateKey, userId },
      { merge: true }
    );
    return;
  }

  const anonRef = db.collection('usage_anon').doc(`${anonId}_${dateKey}`);
  await anonRef.set(
    { count: FieldValue.increment(1), date: dateKey },
    { merge: true }
  );
}

/**
 * Ensure user document exists in Firestore.
 */
export async function ensureUser(userId, email, displayName, photoURL) {
  const userRef = db.collection('users').doc(userId);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    await userRef.set({
      email,
      displayName: displayName || '',
      photoURL: photoURL || '',
      premium: false,
      createdAt: FieldValue.serverTimestamp(),
    });
  }
  return (await userRef.get()).data();
}
