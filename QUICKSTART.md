# 🚀 Quick Start

## Installation & Setup (5 Minuten)

### 1. Setup ausführen
```bash
npm run setup
```

Das Skript fragt dich nach:
- **Firebase Project ID** (von https://console.firebase.google.com)
- **Firebase Config** (API Key, Auth Domain, etc.)
- **Google OAuth** Credentials
- **Stripe** Publishable & Secret Keys
- **Firebase Admin** Service Account

### 2. Antworte auf die Fragen

Alle Informationen findest du hier:
- 🔥 Firebase: https://console.firebase.google.com/project/{PROJECT_ID}/settings/general
- 🔵 Google OAuth: https://console.cloud.google.com/apis/credentials
- 💳 Stripe: https://dashboard.stripe.com/test

### 3. Starte dein Projekt
```bash
npm run dev
```

Öffne http://localhost:3000

---

## 📋 Was wird automatisch konfiguriert?

✅ Firebase Authentifizierung
✅ Google Sign-In
✅ Firestore Datenbank
✅ Stripe Zahlungen
✅ Test-Limits System
✅ Umgebungsvariablen

---

## 🔧 Einzelne Setup-Befehle

Wenn du nur einen Teil neu konfigurieren möchtest:

```bash
# Nur Firebase
npm run setup:firebase

# Nur Vercel
npm run setup:vercel
```

---

## 📚 Ausführliche Dokumentation

- `FIREBASE_SETUP.md` - Detaillierte Firebase-Anleitung
- `STRIPE_SETUP.md` - Stripe-Zahlungen konfigurieren
- `GOOGLE_OAUTH_SETUP.md` - Google OAuth einrichten

---

## 🚨 Troubleshooting

### Firebase CLI nicht gefunden?
```bash
npm install -g firebase-tools
firebase login
```

### Env-Variablen nicht geladen?
Starte den Dev-Server neu:
```bash
npm run dev
```

### Stripe Zahlungen funktionieren nicht?
1. Prüfe `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`
2. Prüfe `STRIPE_SECRET_KEY`
3. Webhook konfiguriert? `STRIPE_WEBHOOK_SECRET`

---

## 📞 Support

Alle Dateien sind gut dokumentiert. Schau in:
- `app/context/AuthContext.jsx` - Auth Logic
- `app/components/AuthModal.jsx` - Login UI
- `app/api/` - Backend APIs

---

**Viel Erfolg! 🎉**
