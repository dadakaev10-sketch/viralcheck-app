import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Next.js 15 App Router: viewport MUST be exported separately.
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#7c3aed',
};

export const metadata = {
  title: {
    default: 'ViralCheck – KI Social Media Analyzer | Viral Score, Captions & Hashtags',
    template: '%s | ViralCheck',
  },
  description: 'Analysiere dein Foto mit KI und erfahre den Viral-Score, optimierte Captions und Hashtags für Instagram & TikTok. 3 kostenlose Analysen.',
  keywords: ['viral check', 'social media analyzer', 'instagram analyse', 'tiktok analyse', 'viral score', 'hashtag generator', 'caption generator', 'KI bildanalyse', 'social media marketing'],
  authors: [{ name: 'ViralCheck' }],
  creator: 'ViralCheck',
  publisher: 'ViralCheck',
  metadataBase: new URL('https://viralcheck.me'),
  alternates: {
    canonical: '/',
    languages: {
      'de': '/?lang=de',
      'en': '/?lang=en',
      'ru': '/?lang=ru',
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ViralCheck',
  },

  // Open Graph (Facebook, WhatsApp, Telegram, LinkedIn)
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    alternateLocale: ['en_US', 'ru_RU'],
    url: 'https://viralcheck.me',
    siteName: 'ViralCheck',
    title: 'ViralCheck – Geht dein Post viral?',
    description: 'KI analysiert dein Foto: Viral-Score, optimierte Captions & Hashtags für Instagram und TikTok.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ViralCheck – KI Social Media Analyzer',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'ViralCheck – Geht dein Post viral?',
    description: 'KI analysiert dein Foto: Viral-Score, Captions & Hashtags.',
    images: ['/og-image.png'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (add your IDs later)
  // verification: {
  //   google: 'your-google-verification-code',
  // },

  // App links
  other: {
    'application-name': 'ViralCheck',
    'apple-mobile-web-app-title': 'ViralCheck',
  },
};

// JSON-LD Structured Data for AI agents and search engines
function JsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'ViralCheck',
    url: 'https://viralcheck.me',
    description: 'AI-powered social media analyzer that checks your photo for viral potential, generates optimized captions and hashtags for Instagram and TikTok.',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: '3 free analyses, then 20 analyses for ~1 EUR via Telegram Stars',
    },
    featureList: [
      'Viral Score Analysis',
      'AI Caption Generation',
      'Hashtag Suggestions',
      'AI Image Enhancement',
      'Before/After Comparison',
      'Instagram & TikTok Optimization',
    ],
    inLanguage: ['de', 'en', 'ru'],
    creator: {
      '@type': 'Organization',
      name: 'ViralCheck',
      url: 'https://viralcheck.me',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '50',
      bestRating: '5',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="de" prefix="og: https://ogp.me/ns#">
      <head>
        {/* Structured Data */}
        <JsonLd />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Icons */}
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
        <link rel="apple-touch-icon" href="/logo.svg" />

        {/* AI Agent Discovery */}
        <link rel="alternate" type="text/plain" href="/llms.txt" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
