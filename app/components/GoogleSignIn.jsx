'use client';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState } from 'react';

export function GoogleSignIn() {
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async (credentialResponse) => {
    try {
      const credential = GoogleAuthProvider.credential(
        credentialResponse.credential
      );
      await signInWithCredential(auth, credential);
    } catch (err) {
      setError('Anmeldung fehlgeschlagen');
      console.error('Google sign-in error:', err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="flex flex-col gap-2">
        <GoogleLogin
          onSuccess={handleGoogleSignIn}
          onError={() => setError('Google Anmeldung fehlgeschlagen')}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </GoogleOAuthProvider>
  );
}
