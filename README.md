# ViralCheck ✨

KI-gestützter Social Media Analyzer powered by **Gemini 2.5 Flash Vision**.

Lade dein Instagram/TikTok-Bild hoch → KI analysiert Viral-Potenzial, generiert optimierte Captions & Hashtags.

## Features

- 📊 Viral-Score (0–100) mit Kategorie-Auswertung
- ✅ Konkrete Verbesserungstipps basierend auf dem echten Bildinhalt
- ✍️ 3 fertige Captions (Locker / Storytelling / Call-to-Action)
- #️⃣ Hashtags in 3 Tiers (Trending / Nische / Micro)
- 🕐 Optimale Posting-Zeit

## Setup

### 1. API Key holen

Kostenlos unter: https://aistudio.google.com/apikey

### 2. Environment einrichten

```bash
cp .env.local.example .env.local
# GEMINI_API_KEY=dein_key_hier eintragen
```

### 3. Dependencies installieren & starten

```bash
npm install
npm run dev
```

App läuft auf http://localhost:3000

## Tech Stack

- **Next.js 15** (App Router)
- **Gemini 2.5 Flash** Vision API
- **Tailwind CSS**
- **React 19**

## Deployment

```bash
# Vercel (empfohlen)
npx vercel --prod

# GEMINI_API_KEY als Environment Variable in Vercel setzen
```
