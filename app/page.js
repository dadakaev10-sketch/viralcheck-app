'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

const PLATFORMS = ['Instagram Post', 'Story', 'TikTok', 'Reels'];
const CATEGORIES = [
  { label: '☕ Food', value: 'Food' },
  { label: '👗 Fashion', value: 'Fashion' },
  { label: '🌿 Lifestyle', value: 'Lifestyle' },
  { label: '💪 Fitness', value: 'Fitness' },
  { label: '✈️ Travel', value: 'Travel' },
  { label: '💼 Business', value: 'Business' },
];

function scoreColor(v) {
  if (v >= 80) return { text: 'text-green-600', bar: 'bg-gradient-to-r from-green-400 to-green-600' };
  if (v >= 60) return { text: 'text-orange-500', bar: 'bg-gradient-to-r from-yellow-400 to-orange-500' };
  return { text: 'text-red-500', bar: 'bg-gradient-to-r from-red-400 to-red-600' };
}

function useCopy() {
  const [copiedKey, setCopiedKey] = useState(null);
  const copy = useCallback((text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);
  return { copiedKey, copy };
}

function ScoreBar({ label, value }) {
  const c = scoreColor(value);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-[#3d3a52]">{label}</span>
        <span className={`text-xs font-bold font-mono ${c.text}`}>{value}/100</span>
      </div>
      <div className="h-2 bg-[#e8e5f0] rounded-full overflow-hidden">
        <div className={`h-full rounded-full bar-animate ${c.bar}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function CopyButton({ text, copyKey, copiedKey, copy, full = false }) {
  const copied = copiedKey === copyKey;
  return (
    <button
      onClick={() => copy(text, copyKey)}
      className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95
        ${full ? 'w-full' : ''}
        ${copied
          ? 'border-green-400 text-green-600 bg-green-50'
          : 'border-[#e8e5f0] text-[#6b6884] hover:border-violet-400 hover:text-violet-700 hover:bg-violet-50'
        }`}
    >
      {copied ? '✓ Kopiert!' : '⎘ Kopieren'}
    </button>
  );
}

// ─── PWA Install Banner ───────────────────────────────
function PWAInstallBanner({ onInstall, onDismiss }) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div
        className="w-full max-w-sm bg-white border border-[#e8e5f0] rounded-2xl shadow-2xl p-4 flex items-center gap-3 pointer-events-auto fade-up"
        style={{ boxShadow: '0 8px 32px rgba(124,58,237,0.18)' }}
      >
        {/* App icon */}
        <div
          className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-2xl shadow-sm"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
        >
          ✨
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-extrabold text-[#0f0e17] leading-tight">App installieren</div>
          <div className="text-xs text-[#6b6884] mt-0.5">Zum Homescreen hinzufügen</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <button
            onClick={onInstall}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
          >
            Installieren
          </button>
          <button
            onClick={onDismiss}
            className="text-[11px] font-medium text-[#a09db8] hover:text-[#6b6884] transition-colors"
          >
            Nicht jetzt
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Zone ──────────────────────────────────────
function UploadZone({ onFile }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith('image/')) onFile(f);
  };
  return (
    <div
      className={`w-full border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all
        ${dragging ? 'border-violet-500 bg-violet-50' : 'border-[#d4d0e8] bg-white hover:border-violet-400 hover:bg-violet-50'}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files[0]; if (f) onFile(f); }} />
      <div className="text-4xl mb-3">📤</div>
      <div className="text-base font-bold text-[#0f0e17] mb-1">Bild auswählen</div>
      <div className="text-sm text-[#6b6884] mb-5 hidden sm:block">oder hierher ziehen</div>
      <div className="inline-block px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold">
        Datei auswählen
      </div>
      <div className="mt-3 text-xs text-[#a09db8]">JPG, PNG, WEBP · max. 10 MB</div>
    </div>
  );
}

// ─── Analysis Tabs ────────────────────────────────────
function AnalysisTabs({ data }) {
  const [tab, setTab] = useState('analyse');
  const { copiedKey, copy } = useCopy();

  const allHashtags = [
    ...(data.hashtags?.trending || []),
    ...(data.hashtags?.nische || []),
    ...(data.hashtags?.micro || []),
  ].join(' ');

  const totalTags = (data.hashtags?.trending?.length || 0)
    + (data.hashtags?.nische?.length || 0)
    + (data.hashtags?.micro?.length || 0);

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="flex bg-white border border-[#e8e5f0] rounded-t-xl px-1 pt-1 gap-0.5">
        {[
          { id: 'analyse', label: '📊 Analyse' },
          { id: 'caption', label: '✍️ Caption' },
          { id: 'hashtags', label: '#️⃣ Hashtags' },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 px-2 py-2.5 rounded-t-lg text-xs sm:text-sm font-bold transition-all
              ${tab === t.id
                ? 'bg-[#f5f4f8] text-violet-700 border border-[#e8e5f0] border-b-[#f5f4f8] relative top-px'
                : 'text-[#6b6884]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="bg-[#f5f4f8] border border-[#e8e5f0] rounded-b-xl rounded-tr-xl p-4 sm:p-5 flex flex-col gap-4">

        {/* ── ANALYSE ── */}
        {tab === 'analyse' && (
          <>
            {/* Viral score */}
            <div className="flex items-center gap-4 bg-white border border-[#e8e5f0] rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="w-[72px] h-[72px] sm:w-20 sm:h-20 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 80 80">
                  <defs>
                    <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#f3f0ff" strokeWidth="6" />
                  <circle cx="40" cy="40" r="30" fill="none" stroke="url(#sg)" strokeWidth="6"
                    strokeLinecap="round" strokeDasharray="188.5"
                    strokeDashoffset={188.5 - (188.5 * data.viralScore) / 100}
                    transform="rotate(-90 40 40)" />
                  <text x="40" y="45" textAnchor="middle" fontSize="18" fontWeight="800"
                    fill="#f97316" fontFamily="Plus Jakarta Sans">{data.viralScore}</text>
                </svg>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold tracking-widest text-[#a09db8] uppercase mb-1">Viral-Score</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-orange-500 leading-none mb-1">
                  {data.viralScore}<span className="text-base sm:text-lg text-[#a09db8]">/100</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#3d3a52] mb-1.5">
                  {data.viralScore >= 80 ? '🚀 Top-Potenzial!' : data.viralScore >= 60 ? '⚡ Gutes Potenzial' : '⚠️ Verbesserung nötig'}
                </div>
                <div className="text-xs text-[#6b6884] flex flex-wrap items-center gap-1.5">
                  <span>Ø Reichweite:</span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full font-bold whitespace-nowrap">
                    {data.viralScore >= 80 ? '8K–30K' : data.viralScore >= 60 ? '2.4K–8K' : '500–2.4K'}
                  </span>
                </div>
              </div>
            </div>

            {/* Score bars */}
            <div className="bg-white border border-[#e8e5f0] rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm">
              <div className="text-[10px] font-bold tracking-widest text-[#a09db8] uppercase">Kategorie-Auswertung</div>
              <ScoreBar label="Bildqualität" value={data.scores?.bildqualitaet ?? 0} />
              <ScoreBar label="Hook-Faktor" value={data.scores?.hookFaktor ?? 0} />
              <ScoreBar label="Trend-Relevanz" value={data.scores?.trendRelevanz ?? 0} />
              <ScoreBar label="Engagement-Potenzial" value={data.scores?.engagementPotenzial ?? 0} />
            </div>

            {/* Feedback – single col on mobile, 2 col on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white border border-[#e8e5f0] rounded-2xl p-4 shadow-sm">
                <div className="text-xs font-bold text-green-600 mb-3">✅ Was gut ist</div>
                {(data.wasGutIst || []).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2.5 last:mb-0 text-xs leading-relaxed text-[#3d3a52]">
                    <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">✓</div>
                    {item}
                  </div>
                ))}
              </div>
              <div className="bg-white border border-[#e8e5f0] rounded-2xl p-4 shadow-sm">
                <div className="text-xs font-bold text-orange-500 mb-3">⚠️ Was verbessern</div>
                {(data.wasVerbessern || []).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2.5 last:mb-0 text-xs leading-relaxed text-[#3d3a52]">
                    <div className="w-4 h-4 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">!</div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Timing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white border border-[#e8e5f0] rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">🕐</span>
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-[#a09db8] uppercase mb-0.5">Beste Posting-Zeit</div>
                  <div className="text-sm font-bold text-[#0f0e17]">{data.bestPostingTime || '—'}</div>
                </div>
              </div>
              <div className="bg-white border border-[#e8e5f0] rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">📈</span>
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-[#a09db8] uppercase mb-0.5">Trend-Fenster</div>
                  <div className="text-sm font-bold text-[#0f0e17]">{data.trendWindow || '—'}</div>
                </div>
              </div>
            </div>

            {/* Quick flags */}
            <div className="bg-white border border-[#e8e5f0] rounded-xl p-4 shadow-sm">
              <div className="text-[10px] font-bold tracking-widest text-[#a09db8] uppercase mb-3">Schnellbewertung</div>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  ['Bildinhalt', data.imageContent ? data.imageContent.slice(0, 40) + (data.imageContent.length > 40 ? '…' : '') : '—', true],
                  ['Person sichtbar', data.personSichtbar ? 'Ja ✓' : 'Nein ⚠️', data.personSichtbar],
                  ['Text-Overlay', data.textOverlay ? 'Vorhanden ✓' : 'Fehlt ⚠️', data.textOverlay],
                ].map(([label, val, ok]) => (
                  <div key={label} className="flex justify-between items-center border-b border-[#f0eef8] pb-2 last:border-0 last:pb-0">
                    <span className="text-[#6b6884] font-medium">{label}</span>
                    <span className={`font-bold text-right ml-2 ${ok ? 'text-green-600' : 'text-orange-500'}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── CAPTIONS ── */}
        {tab === 'caption' && (
          <div className="flex flex-col gap-3">
            {[
              { key: 'locker', badge: 'Locker 😊', badgeCls: 'bg-yellow-100 text-yellow-800', text: data.captions?.locker },
              { key: 'storytelling', badge: 'Storytelling 📖', badgeCls: 'bg-blue-100 text-blue-800', text: data.captions?.storytelling },
              { key: 'cta', badge: 'Call-to-Action 🎯', badgeCls: 'bg-violet-100 text-violet-800', text: data.captions?.cta },
            ].map(({ key, badge, badgeCls, text }) => (
              <div key={key} className="bg-white border border-[#e8e5f0] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeCls}`}>{badge}</span>
                  <span className="text-xs text-[#a09db8] font-mono">{(text || '').length} Zeichen</span>
                </div>
                <p className="text-sm text-[#3d3a52] leading-relaxed mb-3 whitespace-pre-line">{text || '—'}</p>
                <CopyButton text={text || ''} copyKey={key} copiedKey={copiedKey} copy={copy} full />
              </div>
            ))}
          </div>
        )}

        {/* ── HASHTAGS ── */}
        {tab === 'hashtags' && (
          <div className="flex flex-col gap-4">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-xs text-violet-800 font-medium">
              💡 <strong>Mix empfohlen:</strong> 3 Trending + 5 Nische + 5 Micro
            </div>
            {[
              { title: '🔥 Trending', reach: '1M–50M Posts', tags: data.hashtags?.trending || [], cls: 'bg-orange-50 text-orange-700 border-orange-200' },
              { title: '🎯 Nische', reach: '100K–1M Posts', tags: data.hashtags?.nische || [], cls: 'bg-blue-50 text-blue-700 border-blue-200' },
              { title: '💎 Micro', reach: '10K–100K Posts', tags: data.hashtags?.micro || [], cls: 'bg-green-50 text-green-700 border-green-200' },
            ].map(({ title, reach, tags, cls }) => (
              <div key={title} className="bg-white border border-[#e8e5f0] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-[#3d3a52]">{title}</span>
                  <span className="text-xs text-[#a09db8]">{reach}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} onClick={() => copy(tag, `tag-${tag}`)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer active:scale-95 transition-transform ${cls}`}>
                      {copiedKey === `tag-${tag}` ? '✓' : tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={() => copy(allHashtags, 'all-hashtags')}
              className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                ${copiedKey === 'all-hashtags' ? 'bg-green-500 text-white' : 'bg-violet-600 text-white hover:bg-violet-700'}`}>
              {copiedKey === 'all-hashtags' ? '✓ Alle kopiert!' : `⎘ Alle ${totalTags} Hashtags kopieren`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────
export default function Home() {
  const [platform, setPlatform] = useState('Instagram Post');
  const [category, setCategory] = useState('Lifestyle');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // PWA install prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Capture the install prompt before the browser shows its own
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    // Hide banner if user already installed
    const handleAppInstalled = () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismissBanner = () => setShowInstallBanner(false);

  const LOADING_STEPS = [
    'Bild erkannt & verarbeitet',
    'Komposition & Bildqualität analysieren…',
    'Trend-Abgleich mit aktuellen Daten…',
    'Caption & Hashtags generieren…',
  ];

  const handleFile = (file) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    setLoadingStep(1);
    const stepTimers = [900, 1800, 2600].map((delay, i) =>
      setTimeout(() => setLoadingStep(i + 2), delay)
    );
    try {
      const fd = new FormData();
      fd.append('image', imageFile);
      fd.append('platform', platform);
      fd.append('category', category);
      const res = await fetch('/api/analyze', { method: 'POST', body: fd });
      const data = await res.json();
      stepTimers.forEach(clearTimeout);
      if (!res.ok) throw new Error(data.error || 'Analyse fehlgeschlagen');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const reset = () => {
    setResult(null);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
  };

  return (
    <div className="min-h-screen" style={{ background: '#f5f4f8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Topbar ── */}
      <header className="bg-white border-b border-[#e8e5f0] px-4 sm:px-8 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 text-base font-extrabold text-[#0f0e17] tracking-tight">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>✨</div>
          Viral<span className="text-violet-600">Check</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex text-xs font-semibold text-[#6b6884] bg-violet-50 border border-violet-200 px-3 py-1 rounded-full">
            Gemini 2.5 Flash
          </span>
          {result && (
            <button onClick={reset}
              className="text-xs sm:text-sm font-bold text-violet-600 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors active:scale-95">
              ← Neues Bild
            </button>
          )}
        </div>
      </header>

      {/* ── Loading overlay ── */}
      {loading && (
        <div className="fixed inset-0 bg-[#f5f4f8]/90 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white border border-[#e8e5f0] rounded-2xl p-7 w-full max-w-sm shadow-xl text-center">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-lg font-extrabold text-[#0f0e17] mb-1 tracking-tight">Analyse läuft…</div>
            <div className="text-sm text-[#6b6884] mb-5">KI analysiert dein Bild</div>
            <div className="h-1.5 bg-[#e8e5f0] rounded-full overflow-hidden mb-5">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${[0, 25, 55, 80, 100][loadingStep] || 0}%`, background: 'linear-gradient(90deg, #7c3aed, #ec4899)' }} />
            </div>
            <div className="text-left flex flex-col gap-2.5">
              {LOADING_STEPS.map((step, i) => (
                <div key={i} className={`text-xs flex items-center gap-2 transition-all
                  ${i < loadingStep ? 'text-green-600 font-semibold' : i === loadingStep ? 'text-[#3d3a52]' : 'text-[#a09db8]'}`}>
                  {i < loadingStep
                    ? <span className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] flex-shrink-0">✓</span>
                    : i === loadingStep
                      ? <span className="spinner w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full flex-shrink-0 inline-block" />
                      : <span className="w-4 h-4 rounded-full bg-[#f0eef8] flex-shrink-0" />
                  }
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Upload State ── */}
      {!result && (
        <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg flex flex-col items-center gap-5">

            {/* Headline */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-violet-100 rounded-full text-xs font-bold text-violet-700 mb-4">
                ✨ Gemini 2.5 Flash Vision
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f0e17] mb-2 leading-tight">
                Geht dein Post<br />
                <span style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  viral?
                </span>
              </h1>
              <p className="text-sm text-[#6b6884]">KI analysiert Viral-Potenzial, Caption & Hashtags.</p>
            </div>

            {/* Platform – scrollable row on mobile */}
            <div className="flex bg-white border border-[#e8e5f0] rounded-xl p-1 gap-1 w-full">
              {PLATFORMS.map((p) => (
                <button key={p} onClick={() => setPlatform(p)}
                  className={`flex-1 py-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap px-1
                    ${platform === p ? 'bg-violet-600 text-white shadow-sm' : 'text-[#6b6884]'}`}>
                  {p}
                </button>
              ))}
            </div>

            {/* Category */}
            <div className="flex flex-wrap gap-2 justify-center">
              {CATEGORIES.map(({ label, value }) => (
                <button key={value} onClick={() => setCategory(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all active:scale-95
                    ${category === value
                      ? 'bg-violet-100 border-violet-400 text-violet-700'
                      : 'bg-white border-[#e8e5f0] text-[#6b6884]'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Upload / Preview */}
            {!imagePreview ? (
              <UploadZone onFile={handleFile} />
            ) : (
              <div className="w-full bg-white border border-[#e8e5f0] rounded-2xl overflow-hidden shadow-sm">
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover" />
                  <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 text-white rounded-full text-base flex items-center justify-center">
                    ×
                  </button>
                </div>
                <div className="p-4">
                  <div className="text-sm font-bold text-[#0f0e17] mb-0.5 truncate">{imageFile?.name}</div>
                  <div className="text-xs text-[#6b6884] mb-4">{platform} · {category} · {(imageFile?.size / 1024).toFixed(0)} KB</div>
                  <button onClick={handleAnalyze} disabled={loading}
                    className="w-full py-3.5 bg-violet-600 text-white rounded-xl text-sm font-bold hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]">
                    ✨ Jetzt analysieren →
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PWA Install Banner ── */}
      {showInstallBanner && (
        <PWAInstallBanner onInstall={handleInstall} onDismiss={handleDismissBanner} />
      )}

      {/* ── Result State ── */}
      {result && (
        <div className="max-w-5xl mx-auto px-4 sm:px-5 py-5 fade-up">

          {/* Result header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={reset}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6b6884] border border-[#e8e5f0] bg-white px-3 sm:px-4 py-2 rounded-lg active:scale-95 transition-all">
              ← Neues Bild
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
              📸 {platform} · {category}
            </div>
          </div>

          {/* Mobile: stacked. Desktop: side by side */}
          <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-4 items-start">

            {/* Image card – compact on mobile */}
            <div className="lg:sticky lg:top-20">
              <div className="bg-white border border-[#e8e5f0] rounded-2xl overflow-hidden shadow-sm">
                {/* Mobile: horizontal layout */}
                <div className="flex lg:block">
                  {imagePreview && (
                    <img src={imagePreview} alt="Uploaded"
                      className="w-28 h-28 sm:w-36 sm:h-36 lg:w-full lg:h-auto lg:aspect-square object-cover flex-shrink-0" />
                  )}
                  <div className="p-3 sm:p-4 flex-1 min-w-0">
                    <div className="flex flex-col gap-1.5 text-xs">
                      {[
                        ['Datei', imageFile?.name?.slice(0, 18) + (imageFile?.name?.length > 18 ? '…' : '')],
                        ['Plattform', platform],
                        ['Kategorie', category],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-2">
                          <span className="text-[#6b6884]">{k}</span>
                          <span className="font-bold text-[#0f0e17] text-right truncate">{v}</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={reset}
                      className="mt-2.5 w-full py-2 border border-[#e8e5f0] rounded-lg text-xs font-bold text-[#6b6884] hover:border-violet-400 hover:text-violet-600 transition-all active:scale-95">
                      ↺ Neu analysieren
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <AnalysisTabs data={result} />
          </div>
        </div>
      )}
    </div>
  );
}
