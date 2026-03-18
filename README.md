# ViralCheck ✨

KI-gestützter Social Media Analyzer powered by **X.AI Grok 4 Vision & Image Generation**.

Lade dein Instagram/TikTok-Bild hoch → KI analysiert Viral-Potenzial, generiert optimierte Captions & Hashtags → Regeneriere dein Bild basierend auf Empfehlungen!

## Features

- 📊 Viral-Score (0–100) mit Kategorie-Auswertung
- ✅ Konkrete Verbesserungstipps basierend auf dem echten Bildinhalt
- 🎨 **Bild-Regeneration** mit deinen Empfehlungen (NEW!)
- ✍️ 3 fertige Captions (Locker / Storytelling / Call-to-Action)
- #️⃣ Hashtags in 3 Tiers (Trending / Nische / Micro)
- 🕐 Optimale Posting-Zeit

## Setup

### 1. API Keys holen

Kostenlos unter: https://console.x.ai/

- `XAI_API_KEY` - Für Bildanalyse mit Grok Vision
- `XAI_IMAGE_API_KEY` - Für Bild-Regeneration

### 2. Environment einrichten

```bash
cp .env.local.example .env.local
# XAI_API_KEY und XAI_IMAGE_API_KEY eintragen
```

### 3. Dependencies installieren & starten

```bash
npm install
npm run dev
```

App läuft auf http://localhost:3000

## Tech Stack

- **Next.js 15** (App Router)
- **X.AI Grok 4.1 Fast Reasoning** (Image Analysis)
- **X.AI Grok Imagine** (Image Generation)
- **Tailwind CSS**
- **React 19**

## Deployment

```bash
# Vercel (empfohlen)
npx vercel --prod

# XAI_API_KEY und XAI_IMAGE_API_KEY als Environment Variables in Vercel setzen
```
