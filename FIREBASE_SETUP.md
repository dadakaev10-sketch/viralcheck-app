# Firebase Setup Guide

## 1. Firebase Project erstellen
1. Gehe zu https://console.firebase.google.com
2. Neues Projekt erstellen
3. Firestore Database aktivieren (Production Mode)
4. Authentication aktivieren

## 2. Web App registrieren
1. Projekt-Einstellungen → "Deine Apps"
2. Web App hinzufügen
3. Firebase-Config kopieren:
```json
{
  "apiKey": "...",
  "authDomain": "...",
  "projectId": "...",
  "storageBucket": "...",
  "messagingSenderId": "...",
  "appId": "..."
}
```

Diese Werte in `.env.local` eintragen:
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 3. Service Account für Backend
1. Projekt-Einstellungen → "Dienstkonten"
2. "Neuen privaten Schlüssel generieren"
3. JSON-Datei herunterladen
4. Folgende Werte aus der JSON kopieren:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

## 4. Google OAuth konfigurieren
1. Gehe zu https://console.cloud.google.com
2. "APIs & Services" → "OAuth 2.0 Consent Screen"
3. OAuth 2.0 Client ID (Web) erstellen
4. Authorized redirect URIs hinzufügen:
   ```
   http://localhost:3000/
   https://your-app.vercel.app/
   ```
5. Client ID und Secret kopieren:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

## 5. Firestore Database Struktur
Die App erstellt automatisch diese Struktur:

```
users/
  ├── {userId}
  │   ├── uid: string
  │   ├── email: string
  │   ├── displayName: string
  │   ├── photoURL: string
  │   ├── createdAt: timestamp
  │   ├── isPremium: boolean
  │   ├── testsUsed: number (daily)
  │   ├── premiumExpiresAt: timestamp
  │   └── stripeChargeId: string
```

## 6. Firestore Rules deployen
```bash
firebase deploy --only firestore:rules
```

## 7. Vercel Environment Variables
Alle diese Variablen in Vercel Project Settings hinzufügen:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- FIREBASE_ADMIN_PROJECT_ID
- FIREBASE_ADMIN_CLIENT_EMAIL
- FIREBASE_ADMIN_PRIVATE_KEY
- NEXT_PUBLIC_GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- NEXT_PUBLIC_STRIPE_PRICE_ID
- NEXT_PUBLIC_APP_URL

## 8. Testen
```bash
npm run dev
```

Gehe zu http://localhost:3000 und teste die Authentifizierung.
