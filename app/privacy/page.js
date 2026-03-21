export const metadata = {
  title: 'Datenschutzerklärung – ViralCheck',
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: 'system-ui, sans-serif', color: '#1a1a2e', lineHeight: 1.7 }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Datenschutzerklärung</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Stand: März 2026</p>

      <h2>1. Verantwortlicher</h2>
      <p>ViralCheck · viralcheck.me · Kontakt: support@viralcheck.me</p>

      <h2>2. Welche Daten wir erheben</h2>
      <ul>
        <li><strong>Google-Konto:</strong> Name, E-Mail-Adresse und Profilbild beim Login über Google Sign-In.</li>
        <li><strong>Hochgeladene Bilder:</strong> Bilder werden ausschließlich zur Analyse an die xAI API übermittelt und nicht dauerhaft gespeichert.</li>
        <li><strong>Nutzungsdaten:</strong> Anzahl der durchgeführten Analysen und erworbene Credits werden in Firebase Firestore gespeichert.</li>
        <li><strong>Zahlungsdaten:</strong> Telegram Stars-Zahlungen werden über Telegram abgewickelt. Wir erhalten keine Zahlungsdaten.</li>
      </ul>

      <h2>3. Zweck der Verarbeitung</h2>
      <ul>
        <li>Bereitstellung der KI-Analyse-Funktionen</li>
        <li>Verwaltung von Nutzerkonten und Credits</li>
        <li>Verbesserung des Dienstes</li>
      </ul>

      <h2>4. Drittanbieter</h2>
      <ul>
        <li><strong>Google Firebase</strong> – Authentifizierung und Datenspeicherung (Google LLC, USA)</li>
        <li><strong>xAI (Grok API)</strong> – KI-Bildanalyse (xAI Corp, USA)</li>
        <li><strong>Vercel</strong> – Hosting (Vercel Inc., USA)</li>
        <li><strong>Telegram</strong> – Zahlungsabwicklung via Telegram Stars</li>
      </ul>

      <h2>5. Datenspeicherung und Löschung</h2>
      <p>Nutzerdaten werden so lange gespeichert, wie das Konto aktiv ist. Auf Anfrage werden alle Daten gelöscht. Kontakt: support@viralcheck.me</p>

      <h2>6. Deine Rechte</h2>
      <p>Du hast das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten gemäß DSGVO.</p>

      <h2>7. Kontakt</h2>
      <p>Bei Fragen zum Datenschutz: <a href="mailto:support@viralcheck.me" style={{ color: '#7c3aed' }}>support@viralcheck.me</a></p>
    </div>
  );
}
