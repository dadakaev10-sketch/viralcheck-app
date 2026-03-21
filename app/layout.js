import './globals.css';
import { AuthProvider } from './context/AuthContext';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Next.js 15 App Router: viewport MUST be exported separately.
// Manually adding <meta name="viewport"> in <head> creates a DUPLICATE tag
// which breaks iOS Safari (blank screen).
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',   // safe-area for iPhone notch
  themeColor: '#7c3aed',  // Android status bar color (replaces <meta name="theme-color">)
};

export const metadata = {
  title: 'ViralCheck – KI Social Media Analyzer',
  description: 'Lade dein Bild hoch und erfahre, ob dein Post viral geht. Powered by Gemini 2.5 Flash.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ViralCheck',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Icons */}
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        {/* iOS requires a raster PNG for apple-touch-icon; SVG is ignored */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
