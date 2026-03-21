'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { translations } from './i18n';
import { useAuth } from './context/AuthContext';
import Stepper, { Step } from './components/Stepper';

// ─── Category SVG icons ────────────────────────────────
const CATEGORY_ICONS = {
  Food: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15a3 3 0 01-3 3H9l-1 3H5l-1-3"/><path d="M21 6c0-2-1-4-3-4s-3 2-3 4 1 3 3 3v12"/>
    </svg>
  ),
  Moda: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
    </svg>
  ),
  Mode: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
    </svg>
  ),
  Fashion: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
    </svg>
  ),
  Lifestyle: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/>
    </svg>
  ),
  Fitness: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M3 9.5h3v5H3z"/><path d="M18 9.5h3v5h-3z"/><path d="M9 6.5v11"/><path d="M15 6.5v11"/>
    </svg>
  ),
  Travel: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2a.5.5 0 00-.5.2l-.9.9a.5.5 0 000 .7l5 3.4-2.8 2.8-1.5-.4a.5.5 0 00-.5.1l-.5.5a.5.5 0 000 .7l2 2 2 2a.5.5 0 00.7 0l.5-.5a.5.5 0 00.1-.5l-.4-1.5 2.8-2.8 3.4 5a.5.5 0 00.7 0l.9-.9a.5.5 0 00.2-.5z"/>
    </svg>
  ),
  Business: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Luxury: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Бизнес: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  Лайфстайл: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/>
    </svg>
  ),
  Фитнес: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/><path d="M3 9.5h3v5H3z"/><path d="M18 9.5h3v5h-3z"/><path d="M9 6.5v11"/><path d="M15 6.5v11"/>
    </svg>
  ),
  Путешествия: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19.5 2.5S18 2 16.5 3.5L13 7 4.8 5.2a.5.5 0 00-.5.2l-.9.9a.5.5 0 000 .7l5 3.4-2.8 2.8-1.5-.4a.5.5 0 00-.5.1l-.5.5a.5.5 0 000 .7l2 2 2 2a.5.5 0 00.7 0l.5-.5a.5.5 0 00.1-.5l-.4-1.5 2.8-2.8 3.4 5a.5.5 0 00.7 0l.9-.9a.5.5 0 00.2-.5z"/>
    </svg>
  ),
  Еда: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2"/><path d="M7 2v20"/><path d="M21 15a3 3 0 01-3 3H9l-1 3H5l-1-3"/><path d="M21 6c0-2-1-4-3-4s-3 2-3 4 1 3 3 3v12"/>
    </svg>
  ),
  Мода: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.57a1 1 0 00.99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 002-2V10h2.15a1 1 0 00.99-.84l.58-3.57a2 2 0 00-1.34-2.23z"/>
    </svg>
  ),
};

const PLATFORMS = ['Instagram', 'TikTok'];

// ─── Safe localStorage helpers (iOS Safari Private Mode throws on access) ──────
function getLang() {
  try { return localStorage.getItem('vc-lang'); } catch { return null; }
}
function saveLang(l) {
  try { localStorage.setItem('vc-lang', l); } catch { /* ignore */ }
}

const LANGS = [
  { code: 'de', flag: '🇩🇪', label: 'DE' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'ru', flag: '🇷🇺', label: 'RU' },
];

function scoreColor(v) {
  if (v >= 80) return { text: 'text-green-600', bar: 'bg-gradient-to-r from-green-400 to-green-600' };
  if (v >= 60) return { text: 'text-orange-500', bar: 'bg-gradient-to-r from-yellow-400 to-orange-500' };
  return { text: 'text-red-500', bar: 'bg-gradient-to-r from-red-400 to-red-600' };
}

function useCopy() {
  const [copiedKey, setCopiedKey] = useState(null);
  const copy = useCallback((text, key) => {
    // navigator.clipboard requires secure context + user gesture; guard for older iOS
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      // Fallback: execCommand (deprecated but works on old iOS Safari)
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch { /* ignore */ }
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }, []);
  return { copiedKey, copy };
}

// ─── Before / After Image Comparison Slider ──────────────────────────
function ImageCompareSlider({ before, after, labelBefore = 'Vorher', labelAfter = 'Nachher' }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50);
  const [containerW, setContainerW] = useState(0);
  const [aspect, setAspect] = useState(null); // w/h ratio of the after image
  const dragging = useRef(false);

  // Detect aspect ratio from the after image
  useEffect(() => {
    const img = new Image();
    img.onload = () => setAspect(img.naturalWidth / img.naturalHeight);
    img.src = after;
  }, [after]);

  // Track container width for the before-image sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updatePos = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      updatePos(cx);
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [updatePos]);

  const onStart = (e) => {
    dragging.current = true;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    updatePos(cx);
  };

  // Portrait: limit width. All formats: cap height at 60vh
  const isPortrait = aspect !== null && aspect < 0.9;
  const maxH = '60vh';
  const wrapStyle = isPortrait
    ? { maxWidth: `calc(${maxH} * ${aspect || 0.5625})`, margin: '0 auto' }
    : {};

  return (
    <div style={wrapStyle}>
      <div
        ref={containerRef}
        className="relative w-full select-none overflow-hidden rounded-2xl border border-[#e8e5f0] bg-black cursor-col-resize"
        style={{ maxHeight: maxH }}
        onMouseDown={onStart}
        onTouchStart={onStart}
      >
        {/* After image (full, sets container height) */}
        <img src={after} alt="After" draggable={false}
          className="block w-full h-auto" style={{ maxHeight: maxH, objectFit: 'contain' }} />

        {/* Before image (clipped from left) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={before} alt="Before" draggable={false}
            className="block h-full"
            style={{ width: containerW || '100%', maxWidth: 'none', objectFit: 'cover' }} />
        </div>

        {/* Divider line */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none"
          style={{ left: `${pos}%`, transform: 'translateX(-50%)', boxShadow: '0 0 8px rgba(0,0,0,0.4)' }}>
          {/* Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl border-2 border-violet-500 flex items-center justify-center pointer-events-none">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 9L2 9M2 9L4 7M2 9L4 11" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13 9L16 9M16 9L14 7M16 9L14 11" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-bold backdrop-blur-sm pointer-events-none">
          {labelBefore}
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-bold backdrop-blur-sm pointer-events-none">
          {labelAfter}
        </div>
      </div>
    </div>
  );
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

function CopyButton({ text, copyKey, copiedKey, copy, full = false, t }) {
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
      {copied ? t.copied : t.copy}
    </button>
  );
}

// ─── PWA Install Banner ───────────────────────────────
function PWAInstallBanner({ onInstall, onDismiss, t }) {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div
        className="w-full max-w-sm bg-white border border-[#e8e5f0] rounded-2xl shadow-2xl p-4 flex items-center gap-3 pointer-events-auto fade-up"
        style={{ boxShadow: '0 8px 32px rgba(124,58,237,0.18)' }}
      >
        <img src="/logo.svg" alt="ViralCheck" className="w-12 h-12 rounded-xl flex-shrink-0 shadow-sm" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-extrabold text-[#0f0e17] leading-tight">{t.pwaTitle}</div>
          <div className="text-xs text-[#6b6884] mt-0.5">{t.pwaSub}</div>
        </div>
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button
            onClick={onInstall}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95 w-full"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
          >{t.pwaBtn}</button>
          <span
            onClick={onDismiss}
            className="text-[11px] font-medium text-[#a09db8] hover:text-[#6b6884] transition-colors cursor-pointer bg-white px-2 py-0.5 rounded w-full text-center"
          >{t.pwaDismiss}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Upload Zone ──────────────────────────────────────
function UploadZone({ onFile, t }) {
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
      <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" className="hidden"
        onChange={(e) => { const f = e.target.files[0]; if (f) onFile(f); }} />
      <div className="text-4xl mb-3">📤</div>
      <div className="text-base font-bold text-[#0f0e17] mb-1">{t.uploadTitle}</div>
      <div className="text-sm text-[#6b6884] mb-5 hidden sm:block">{t.uploadDrag}</div>
      <div className="inline-block px-6 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-bold">
        {t.uploadBtn}
      </div>
      <div className="mt-3 text-xs text-[#a09db8]">{t.uploadHint}</div>
    </div>
  );
}

// ─── Analysis Tabs ────────────────────────────────────
function AnalysisTabs({ data, t }) {
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

  const TABS = [
    { id: 'analyse',  label: t.tabAnalysis },
    { id: 'caption',  label: t.tabCaption },
    { id: 'hashtags', label: t.tabHashtags },
  ];

  return (
    <div className="flex flex-col">
      {/* Tab bar */}
      <div className="flex bg-white border border-[#e8e5f0] rounded-t-xl px-1 pt-1 gap-0.5">
        {TABS.map((item) => (
          <button key={item.id} onClick={() => setTab(item.id)}
            className={`flex-1 px-2 py-2.5 rounded-t-lg text-xs sm:text-sm font-bold transition-all
              ${tab === item.id
                ? 'bg-[#f5f4f8] text-violet-700 border border-[#e8e5f0] border-b-[#f5f4f8] relative top-px'
                : 'text-[#6b6884]'}`}>
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab body */}
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
                <div className="text-[10px] font-bold tracking-widest text-[#a09db8] uppercase mb-1">{t.viralScore}</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-orange-500 leading-none mb-1">
                  {data.viralScore}<span className="text-base sm:text-lg text-[#a09db8]">/100</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-[#3d3a52] mb-1.5">
                  {data.viralScore >= 80 ? t.top : data.viralScore >= 60 ? t.good : t.weak}
                </div>
                <div className="text-xs text-[#6b6884] flex flex-wrap items-center gap-1.5">
                  <span>{t.avgReach}</span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full font-bold whitespace-nowrap">
                    {data.viralScore >= 80 ? '8K–30K' : data.viralScore >= 60 ? '2.4K–8K' : '500–2.4K'}
                  </span>
                </div>
              </div>
            </div>

            {/* Score bars */}
            <div className="bg-white border border-[#e8e5f0] rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-sm">
              <div className="text-[10px] font-bold tracking-widest text-[#a09db8] uppercase">{t.categoryAnalysis}</div>
              <ScoreBar label={t.imageQuality}        value={data.scores?.bildqualitaet      ?? 0} />
              <ScoreBar label={t.hookFactor}           value={data.scores?.hookFaktor          ?? 0} />
              <ScoreBar label={t.trendRelevance}       value={data.scores?.trendRelevanz       ?? 0} />
              <ScoreBar label={t.engagementPotential}  value={data.scores?.engagementPotenzial ?? 0} />
            </div>

            {/* Feedback */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white border border-[#e8e5f0] rounded-2xl p-4 shadow-sm">
                <div className="text-xs font-bold text-green-600 mb-3">{t.whatIsGood}</div>
                {(data.wasGutIst || []).map((item, i) => (
                  <div key={i} className="flex items-start gap-2 mb-2.5 last:mb-0 text-xs leading-relaxed text-[#3d3a52]">
                    <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5">✓</div>
                    {item}
                  </div>
                ))}
              </div>
              <div className="bg-white border border-[#e8e5f0] rounded-2xl p-4 shadow-sm">
                <div className="text-xs font-bold text-orange-500 mb-3">{t.whatToImprove}</div>
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
                  <div className="text-[10px] font-bold tracking-wider text-[#a09db8] uppercase mb-0.5">{t.bestTime}</div>
                  <div className="text-sm font-bold text-[#0f0e17]">{data.bestPostingTime || '—'}</div>
                </div>
              </div>
              <div className="bg-white border border-[#e8e5f0] rounded-xl p-4 flex items-center gap-3 shadow-sm">
                <span className="text-2xl">📈</span>
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-[#a09db8] uppercase mb-0.5">{t.trendWindow}</div>
                  <div className="text-sm font-bold text-[#0f0e17]">{data.trendWindow || '—'}</div>
                </div>
              </div>
            </div>

            {/* Quick flags */}
            <div className="bg-white border border-[#e8e5f0] rounded-xl p-4 shadow-sm">
              <div className="text-[10px] font-bold tracking-widest text-[#a09db8] uppercase mb-3">{t.quickRating}</div>
              <div className="flex flex-col gap-2 text-xs">
                {[
                  [t.imageContent,  data.imageContent ? data.imageContent.slice(0, 40) + (data.imageContent.length > 40 ? '…' : '') : '—', true],
                  [t.personVisible, data.personSichtbar ? t.yes : t.no,        data.personSichtbar],
                  [t.textOverlay,   data.textOverlay   ? t.present : t.missing, data.textOverlay],
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
              { key: 'locker',       badge: t.captionCasual, badgeCls: 'bg-yellow-100 text-yellow-800', text: data.captions?.locker },
              { key: 'storytelling', badge: t.captionStory,  badgeCls: 'bg-blue-100 text-blue-800',   text: data.captions?.storytelling },
              { key: 'cta',          badge: t.captionCTA,    badgeCls: 'bg-violet-100 text-violet-800', text: data.captions?.cta },
            ].map(({ key, badge, badgeCls, text }) => (
              <div key={key} className="bg-white border border-[#e8e5f0] rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeCls}`}>{badge}</span>
                  <span className="text-xs text-[#a09db8] font-mono">{(text || '').length} {t.characters}</span>
                </div>
                <p className="text-sm text-[#3d3a52] leading-relaxed mb-3 whitespace-pre-line">{text || '—'}</p>
                <CopyButton text={text || ''} copyKey={key} copiedKey={copiedKey} copy={copy} full t={t} />
              </div>
            ))}
          </div>
        )}

        {/* ── HASHTAGS ── */}
        {tab === 'hashtags' && (
          <div className="flex flex-col gap-4">
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-xs text-violet-800 font-medium">
              💡 <strong>{t.hashtagTipBold}</strong> {t.hashtagTipText}
            </div>
            {[
              { title: t.hTrending, reach: t.hTrendingReach, tags: data.hashtags?.trending || [], cls: 'bg-orange-50 text-orange-700 border-orange-200' },
              { title: t.hNiche,    reach: t.hNicheReach,    tags: data.hashtags?.nische   || [], cls: 'bg-blue-50 text-blue-700 border-blue-200' },
              { title: t.hMicro,   reach: t.hMicroReach,    tags: data.hashtags?.micro     || [], cls: 'bg-green-50 text-green-700 border-green-200' },
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
              {copiedKey === 'all-hashtags' ? t.allCopied : t.copyAllTags(totalTags)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────
export default function Home() {
  const { user, authLoading, canAnalyze, remaining, credits, isPremium, signInWithGoogle, signOut, incrementUsage, saveAnalysis, uploadRegeneratedImage, updateAnalysisImage } = useAuth();
  const [lang, setLang] = useState('de');
  const t = translations[lang];

  const [platform, setPlatform] = useState('Instagram');
  const [category, setCategory] = useState('Lifestyle');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [regeneratedImage, setRegeneratedImage] = useState(null);
  const [currentAnalysisId, setCurrentAnalysisId] = useState(null);
  const [customPurpose, setCustomPurpose] = useState('');
  const [stepperStep, setStepperStep] = useState(1);

  // PWA install prompt
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Restore saved language preference (safe – won't throw in iOS Private Mode)
    const saved = getLang();
    if (saved && translations[saved]) setLang(saved);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
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

  const changeLang = (l) => {
    setLang(l);
    saveLang(l);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismissBanner = () => setShowInstallBanner(false);

  const handleFile = (file) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      setError('❌ Nur JPEG, PNG oder WebP werden unterstützt. SVG funktioniert nicht.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    if (!canAnalyze) {
      setError(t.limitReached);
      return;
    }
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
      fd.append('language', lang);
      if (customPurpose) fd.append('customPurpose', customPurpose);
      const res = await fetch('/api/analyze', { method: 'POST', body: fd });
      const data = await res.json();
      stepTimers.forEach(clearTimeout);
      if (!res.ok) throw new Error(data.error || 'Analyse fehlgeschlagen');
      setResult(data);
      await incrementUsage();
      // Save analysis to Firestore
      const analysisId = await saveAnalysis(data, platform, category);
      setCurrentAnalysisId(analysisId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleRegenerateImage = async () => {
    if (!result || !result.wasVerbessern || !imageFile) return;
    setRegenerating(true);
    setError(null);
    try {
      // Convert image to base64 so the API can see the original
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result.split(',')[1]);
        reader.readAsDataURL(imageFile);
      });
      const res = await fetch('/api/regenerate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          improvements: result.wasVerbessern,
          imageContent: result.imageContent,
          imageBase64: base64Image,
          imageMimeType: imageFile.type || 'image/jpeg',
          platform,
          category,
          customPurpose,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Regeneration fehlgeschlagen');
      setRegeneratedImage(data.image);
      // Upload to Firebase Storage & update Firestore
      if (currentAnalysisId && data.image) {
        const url = await uploadRegeneratedImage(data.image, currentAnalysisId);
        if (url) await updateAnalysisImage(currentAnalysisId, url);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRegenerating(false);
    }
  };

  const reset = () => {
    setResult(null);
    setImageFile(null);
    setImagePreview(null);
    setError(null);
    setRegeneratedImage(null);
    setCurrentAnalysisId(null);
    setCustomPurpose('');
    setStepperStep(1);
  };

  return (
    <div className="min-h-screen" style={{ background: '#f5f4f8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Topbar ── */}
      <header className="bg-white border-b border-[#e8e5f0] px-4 sm:px-8 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2 text-base font-extrabold text-[#0f0e17] tracking-tight">
          <img src="/logo.svg" alt="ViralCheck" className="w-7 h-7 rounded-lg flex-shrink-0" />
          Viral<span className="text-violet-600">Check</span>
        </div>

        <div className="flex items-center gap-2">
          {/* ── Language switcher ── */}
          <div className="flex items-center bg-[#f5f4f8] border border-[#e8e5f0] rounded-lg p-0.5 gap-0.5">
            {LANGS.map(({ code, flag, label }) => (
              <button key={code} onClick={() => changeLang(code)}
                className={`px-1.5 sm:px-2 py-1 rounded-md text-[11px] sm:text-xs font-bold transition-all
                  ${lang === code ? 'bg-white text-[#0f0e17] shadow-sm' : 'text-[#6b6884] hover:text-[#3d3a52]'}`}>
                {flag} {label}
              </button>
            ))}
          </div>

          {result && (
            <button onClick={reset}
              className="text-xs sm:text-sm font-bold text-violet-600 border border-violet-200 px-3 py-1.5 rounded-lg hover:bg-violet-50 transition-colors active:scale-95">
              {t.newImage}
            </button>
          )}

          {/* User info */}
          {user && (
            <div className="flex items-center gap-2">
              {/* Credits/remaining badge */}
              {isPremium ? (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 border border-yellow-300">
                  <span className="text-[10px] font-bold text-yellow-700">{t.creditsLabel(credits)}</span>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200">
                  <span className="text-[10px] font-bold text-violet-600">{t.remaining(remaining)}</span>
                </div>
              )}
              {user.photoURL && (
                <img src={user.photoURL} alt="" className="w-7 h-7 rounded-full border border-[#e8e5f0]" referrerPolicy="no-referrer" />
              )}
              <button onClick={signOut} title={t.logout}
                className="text-[#6b6884] hover:text-red-500 transition-colors p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Loading overlay ── */}
      {loading && (
        <div className="fixed inset-0 bg-[#f5f4f8]/90 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-white border border-[#e8e5f0] rounded-2xl p-7 w-full max-w-sm shadow-xl text-center">
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-lg font-extrabold text-[#0f0e17] mb-1 tracking-tight">{t.loadingTitle}</div>
            <div className="text-sm text-[#6b6884] mb-5">{t.loadingSub}</div>
            <div className="h-1.5 bg-[#e8e5f0] rounded-full overflow-hidden mb-5">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${[0, 25, 55, 80, 100][loadingStep] || 0}%`, background: 'linear-gradient(90deg, #7c3aed, #ec4899)' }} />
            </div>
            <div className="text-left flex flex-col gap-2.5">
              {t.loadingSteps.map((step, i) => (
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
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0f0e17] mb-2 leading-tight">
                {t.heroLine1}<br />
                <span style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {t.heroLine2}
                </span>
              </h1>
              <p className="text-sm text-[#6b6884]">{t.heroSub}</p>
            </div>

            {/* Not logged in → show login */}
            {!authLoading && !user ? (
              <div className="w-full bg-white border border-[#e8e5f0] rounded-2xl p-8 text-center shadow-sm">
                <div className="text-4xl mb-3">🔐</div>
                <h2 className="text-lg font-extrabold text-[#0f0e17] mb-1">{t.loginTitle}</h2>
                <p className="text-sm text-[#6b6884] mb-5">{t.loginSub}</p>
                <button onClick={signInWithGoogle}
                  className="w-full py-3.5 bg-[#0f0e17] text-white rounded-xl text-sm font-bold hover:bg-[#1a1930] transition-colors flex items-center justify-center gap-3 active:scale-[0.98]">
                  <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                  {t.loginBtn}
                </button>
              </div>
            ) : authLoading ? (
              <div className="py-12 flex items-center justify-center">
                <span className="spinner w-6 h-6 border-2 border-violet-400 border-t-transparent rounded-full inline-block" />
              </div>
            ) : (
              <>
                {/* Remaining analyses badge (mobile) */}
                <div className={`sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${isPremium ? 'bg-yellow-50 border-yellow-300' : 'bg-violet-50 border-violet-200'}`}>
                  <span className={`text-xs font-bold ${isPremium ? 'text-yellow-700' : 'text-violet-600'}`}>
                    {isPremium ? t.creditsLabel(credits) : t.remaining(remaining)}
                  </span>
                </div>

                {/* Limit reached */}
                {!canAnalyze ? (
                  <div className="w-full bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-200 rounded-2xl p-8 text-center">
                    <div className="text-4xl mb-3">🔒</div>
                    <h2 className="text-lg font-extrabold text-[#0f0e17] mb-2">{t.upgradeTitle}</h2>
                    <p className="text-sm text-[#6b6884] mb-5">{t.upgradeSub}</p>
                    <a
                      href={`https://t.me/ViralCheckApp_bot?start=${user?.uid || ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3.5 bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-xl text-sm font-bold hover:from-violet-700 hover:to-pink-700 transition-all active:scale-[0.98] text-center">
                      {t.upgradeBtn}
                    </a>
                    <p className="text-[11px] text-[#a09db8] mt-3">{t.upgradeNote}</p>
                  </div>
                ) : (
                  <div className="w-full bg-white border border-[#e8e5f0] rounded-2xl shadow-sm overflow-hidden">
                    <Stepper
                      initialStep={stepperStep}
                      onStepChange={setStepperStep}
                      onFinalStepCompleted={handleAnalyze}
                      backButtonText={lang === 'de' ? 'Zurück' : lang === 'ru' ? 'Назад' : 'Back'}
                      nextButtonText={lang === 'de' ? 'Weiter' : lang === 'ru' ? 'Далее' : 'Next'}
                      nextDisabled={stepperStep === 1 && !imageFile}
                      stepLabels={
                        lang === 'de' ? ['Foto', 'Stil', 'Start'] :
                        lang === 'ru' ? ['Фото', 'Стиль', 'Старт'] :
                        ['Photo', 'Style', 'Start']
                      }
                    >
                      {/* ── Step 1: Upload ── */}
                      <Step>
                        <div className="pb-2">
                          <h2 className="text-base font-extrabold text-[#0f0e17] mb-1">
                            {lang === 'de' ? 'Foto hochladen' : lang === 'ru' ? 'Загрузите фото' : 'Upload photo'}
                          </h2>
                          <p className="text-xs text-[#6b6884] mb-4">
                            {lang === 'de' ? 'JPEG, PNG oder WebP · max. 10 MB' : lang === 'ru' ? 'JPEG, PNG или WebP · макс. 10 МБ' : 'JPEG, PNG or WebP · max 10 MB'}
                          </p>
                          {!imagePreview ? (
                            <UploadZone onFile={handleFile} t={t} />
                          ) : (
                            <div className="relative rounded-xl overflow-hidden border border-[#e8e5f0] bg-[#f5f4f8]" style={{ height: '220px' }}>
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                              <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                                className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full text-base flex items-center justify-center hover:bg-black/80 font-bold">
                                ×
                              </button>
                              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full truncate max-w-[70%]">
                                {imageFile?.name} · {(imageFile?.size / 1024).toFixed(0)} KB
                              </div>
                            </div>
                          )}
                        </div>
                      </Step>

                      {/* ── Step 2: Style & Platform ── */}
                      <Step>
                        <div className="pb-2">
                          <h2 className="text-base font-extrabold text-[#0f0e17] mb-1">
                            {lang === 'de' ? 'Stil wählen' : lang === 'ru' ? 'Выберите стиль' : 'Choose style'}
                          </h2>
                          <p className="text-xs text-[#6b6884] mb-4">
                            {lang === 'de' ? 'Für welchen Bereich ist dein Post?' : lang === 'ru' ? 'Для какой ниши твой пост?' : 'What niche is your post for?'}
                          </p>

                          {/* Category grid */}
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                            {t.categories.map(({ label, value }) => {
                              const icon = CATEGORY_ICONS[label] || CATEGORY_ICONS[value];
                              return (
                                <button key={value} onClick={() => setCategory(value)}
                                  className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all active:scale-95 text-center
                                    ${category === value
                                      ? 'border-violet-500 bg-violet-50 text-violet-700'
                                      : 'border-[#e8e5f0] bg-white text-[#6b6884] hover:border-violet-300'}`}>
                                  <span className={category === value ? 'text-violet-600' : 'text-[#9896ab]'}>
                                    {icon || '✦'}
                                  </span>
                                  <span className="text-[10px] font-bold leading-tight">{label}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Platform tabs */}
                          <p className="text-xs font-bold text-[#3d3a52] mb-2">
                            {lang === 'de' ? 'Plattform' : lang === 'ru' ? 'Платформа' : 'Platform'}
                          </p>
                          <div className="flex bg-[#f5f4f8] border border-[#e8e5f0] rounded-xl p-1 gap-1 mb-4">
                            {PLATFORMS.map((p) => (
                              <button key={p} onClick={() => setPlatform(p)}
                                className={`flex-1 py-1.5 rounded-lg text-[10px] sm:text-xs font-bold transition-all px-1
                                  ${platform === p ? 'bg-violet-600 text-white shadow-sm' : 'text-[#6b6884]'}`}>
                                {p}
                              </button>
                            ))}
                          </div>

                          {/* Custom purpose */}
                          <p className="text-xs font-bold text-[#3d3a52] mb-2">
                            {lang === 'de' ? 'Eigenen Zweck hinzufügen (optional)' : lang === 'ru' ? 'Добавить свою цель (необязательно)' : 'Add custom purpose (optional)'}
                          </p>
                          <input
                            type="text"
                            value={customPurpose}
                            onChange={(e) => setCustomPurpose(e.target.value)}
                            maxLength={120}
                            placeholder={lang === 'de' ? 'z.B. Bauunternehmen in Hamburg bewerben …' : lang === 'ru' ? 'Например, продвижение строительной компании …' : 'e.g. promote a construction company in Berlin …'}
                            className="w-full px-3 py-2.5 border border-[#e8e5f0] rounded-xl text-sm text-[#0f0e17] placeholder-[#b0aec8] focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 bg-white"
                          />
                        </div>
                      </Step>

                      {/* ── Step 3: Start ── */}
                      <Step>
                        <div className="pb-2 flex flex-col gap-3">
                          {imagePreview && (
                            <div className="w-full rounded-xl overflow-hidden border border-[#e8e5f0] bg-[#f5f4f8]" style={{ height: '240px' }}>
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div>
                            <h2 className="text-base font-extrabold text-[#0f0e17] mb-0.5">
                              {lang === 'de' ? 'Alles bereit!' : lang === 'ru' ? 'Всё готово!' : 'Ready to go!'}
                            </h2>
                            {customPurpose && (
                              <p className="text-xs text-[#6b6884] italic">„{customPurpose}"</p>
                            )}
                          </div>
                          <div className="w-full bg-[#f5f4f8] rounded-xl p-3 text-xs text-[#6b6884]">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-green-500">✓</span>
                              <span>{lang === 'de' ? 'Bild hochgeladen' : lang === 'ru' ? 'Фото загружено' : 'Photo uploaded'}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-green-500">✓</span>
                              <span>{lang === 'de' ? `Stil: ${category}` : lang === 'ru' ? `Стиль: ${category}` : `Style: ${category}`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-green-500">✓</span>
                              <span>{lang === 'de' ? `Plattform: ${platform}` : lang === 'ru' ? `Платформа: ${platform}` : `Platform: ${platform}`}</span>
                            </div>
                          </div>
                          <p className="text-[11px] text-[#a09db8] text-center">
                            {lang === 'de' ? `Noch ${remaining} ${remaining === 1 ? 'Analyse' : 'Analysen'} übrig` : lang === 'ru' ? `Осталось ${remaining} анализов` : `${remaining} ${remaining === 1 ? 'analysis' : 'analyses'} left`}
                          </p>
                        </div>
                      </Step>
                    </Stepper>
                  </div>
                )}

              </>
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
        <PWAInstallBanner onInstall={handleInstall} onDismiss={handleDismissBanner} t={t} />
      )}

      {/* ── Result State ── */}
      {result && (
        <div className="max-w-5xl mx-auto px-4 sm:px-5 py-5 fade-up">

          {/* Result header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={reset}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#6b6884] border border-[#e8e5f0] bg-white px-3 sm:px-4 py-2 rounded-lg active:scale-95 transition-all">
              {t.newImage}
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}>
              📸 {platform} · {category}
            </div>
          </div>

          {/* Image section – before/after slider when regenerated */}
          {imagePreview && (
            <div className="mb-4">
              {regeneratedImage ? (
                <div className="flex flex-col gap-3">
                  <ImageCompareSlider
                    before={imagePreview}
                    after={regeneratedImage}
                    labelBefore={lang === 'de' ? 'Vorher' : lang === 'en' ? 'Before' : 'До'}
                    labelAfter={lang === 'de' ? 'Nachher' : lang === 'en' ? 'After' : 'После'}
                  />
                  <div className="flex gap-2">
                    <button onClick={async () => {
                      try {
                        const res = await fetch(regeneratedImage);
                        const blob = await res.blob();
                        const file = new File([blob], 'viralcheck-regenerated.png', { type: 'image/png' });
                        if (navigator.canShare?.({ files: [file] })) {
                          await navigator.share({ files: [file], title: 'ViralCheck' });
                        } else {
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url; a.download = 'viralcheck-regenerated.png';
                          document.body.appendChild(a); a.click(); document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      } catch (e) { if (e.name !== 'AbortError') console.error(e); }
                    }}
                      className="flex-1 py-2.5 bg-gradient-to-r from-violet-500 to-violet-700 text-white rounded-xl text-xs font-bold text-center hover:from-violet-600 hover:to-violet-800 transition-all active:scale-95">
                      📲 {lang === 'de' ? 'In Fotos speichern' : lang === 'en' ? 'Save to Photos' : 'Сохранить в фото'}
                    </button>
                    <button onClick={reset}
                      className="px-4 py-2.5 border border-[#e8e5f0] rounded-xl text-xs font-bold text-[#6b6884] hover:border-violet-400 hover:text-violet-600 transition-all active:scale-95">
                      {t.reanalyze}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-[#e8e5f0] rounded-2xl overflow-hidden shadow-sm">
                  <img src={imagePreview} alt="Uploaded"
                    className="w-full h-auto max-h-[60vh] object-contain" />
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex gap-3 text-xs text-[#6b6884]">
                      <span>{imageFile?.name?.slice(0, 20)}{imageFile?.name?.length > 20 ? '…' : ''}</span>
                      <span className="font-bold text-[#0f0e17]">{platform} · {category}</span>
                    </div>
                    <button onClick={reset}
                      className="px-3 py-1.5 border border-[#e8e5f0] rounded-lg text-xs font-bold text-[#6b6884] hover:border-violet-400 hover:text-violet-600 transition-all active:scale-95">
                      {t.reanalyze}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analysis + Regenerate */}
          <div className="flex flex-col gap-4 w-full">
            <AnalysisTabs data={result} t={t} />

            {/* Regenerate button */}
            <button
              onClick={handleRegenerateImage}
              disabled={regenerating}
              className="w-full py-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-2xl text-sm font-bold hover:from-green-500 hover:to-green-700 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2 shadow-md"
            >
              {regenerating ? (
                <>
                  <span className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
                  {lang === 'de' ? 'Generiert...' : lang === 'en' ? 'Generating...' : 'Генерирую...'}
                </>
              ) : regeneratedImage ? (
                <>
                  🎨 {lang === 'de' ? 'Nochmal regenerieren' : lang === 'en' ? 'Regenerate again' : 'Регенерировать снова'}
                </>
              ) : (
                <>
                  🎨 {lang === 'de' ? 'Bild mit Empfehlungen regenerieren' : lang === 'en' ? 'Regenerate Image with Suggestions' : 'Восстановить изображение с предложениями'}
                </>
              )}
            </button>

            {error && (
              <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 font-medium">
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
