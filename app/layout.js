import './globals.css';

export const metadata = {
  title: 'ViralCheck – KI Social Media Analyzer',
  description: 'Lade dein Bild hoch und erfahre, ob dein Post viral geht. Powered by Gemini 2.5 Flash.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
