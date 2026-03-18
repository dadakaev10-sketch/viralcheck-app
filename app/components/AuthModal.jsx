'use client';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { GoogleSignIn } from './GoogleSignIn';
import { loadStripe } from '@stripe/js';

export function AuthModal({ isOpen, onClose }) {
  const { user, userProfile } = useAuth();
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  const handlePremiumUpgrade = async () => {
    if (!user) {
      alert('Bitte melden Sie sich zunächst an');
      return;
    }

    setIsLoadingCheckout(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      });

      const { sessionId } = await response.json();
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout fehlgeschlagen');
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">
          {user ? 'Account' : 'Anmelden'}
        </h2>

        {!user ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm mb-4">
              Melden Sie sich an für 3 kostenlose Tests
            </p>
            <GoogleSignIn />
            <button
              onClick={onClose}
              className="w-full mt-4 text-gray-600 hover:text-gray-900"
            >
              Später
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold">{userProfile?.email}</p>
            </div>

            {userProfile?.isPremium ? (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded">
                <p className="text-sm font-semibold text-blue-900">
                  ✨ Premium aktiv
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  20 Generierungen pro Tag
                </p>
              </div>
            ) : (
              <button
                onClick={handlePremiumUpgrade}
                disabled={isLoadingCheckout}
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoadingCheckout ? 'Wird geladen...' : 'Premium für 19€'}
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-900"
            >
              Schließen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
