import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Language } from '../utils/i18n';

// Arabic Voice Priorities according to WCAG Arabic specifications
const ARABIC_VOICE_PRIORITIES = ['ar-EG', 'ar-SA', 'ar-AE', 'ar'];
const ENGLISH_VOICE_PRIORITIES = ['en-US', 'en-GB', 'en'];

export interface AccessibilitySettings {
  screenReader: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  fontScale: number;
  enhancedFocus: boolean;
  closedCaptions: boolean;
  signLanguageGuide: boolean;
  keyboardNavMode: boolean;
  cognitiveSupport: boolean;
}

export type BooleanOrUpdater = boolean | ((prev: boolean) => boolean);

export interface AccessibilityContextType {
  settings: AccessibilitySettings;
  // Direct boolean accessors
  screenReaderMode: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  fontScale: number;
  enhancedFocus: boolean;
  closedCaptions: boolean;
  signLanguageGuide: boolean;
  keyboardNavMode: boolean;
  cognitiveSupport: boolean;
  isAccessibilityActive: boolean;

  // Real-time live caption text currently being spoken
  currentCaption: string;

  // Setters supporting both direct booleans and functional updates (prev => !prev)
  setScreenReaderMode: (value: BooleanOrUpdater) => void;
  setHighContrast: (value: BooleanOrUpdater) => void;
  setReduceMotion: (value: BooleanOrUpdater) => void;
  setEnhancedFocus: (value: BooleanOrUpdater) => void;
  setClosedCaptions: (value: BooleanOrUpdater) => void;
  setSignLanguageGuide: (value: BooleanOrUpdater) => void;
  setKeyboardNavMode: (value: BooleanOrUpdater) => void;
  setCognitiveSupport: (value: BooleanOrUpdater) => void;

  // Toggle helpers
  toggleScreenReader: () => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  toggleEnhancedFocus: () => void;
  toggleClosedCaptions: () => void;
  toggleSignLanguageGuide: () => void;
  toggleKeyboardNavMode: () => void;
  toggleCognitiveSupport: () => void;
  toggleAccessibilityMode: () => void;

  // Font controls
  increaseFont: () => void;
  decreaseFont: () => void;
  setMaxFont: () => void;
  resetFont: () => void;

  // Audio Speech & Screen Reader Functions
  speak: (text: string, lang?: Language) => void;
  speakText: (text: string, lang?: Language) => void;
  announce: (text: string, priorityOrLang?: boolean | Language, maybeLang?: Language) => void;
  announcePageTitle: (lang: Language) => void;
  playAudioChime: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const DEFAULT_SETTINGS: AccessibilitySettings = {
  screenReader: false, // Default OFF so settings do not run on their own
  highContrast: false,
  reduceMotion: false,
  fontScale: 1,
  enhancedFocus: false,
  closedCaptions: false, // Default OFF
  signLanguageGuide: false,
  keyboardNavMode: false,
  cognitiveSupport: false,
};

export const AccessibilityProvider: React.FC<{
  children: React.ReactNode;
  language?: Language;
}> = ({ children, language: propLanguage = 'ar' }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem('sleepee_accessibility_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          screenReader: typeof parsed.screenReader === 'boolean' ? parsed.screenReader : false,
          highContrast: typeof parsed.highContrast === 'boolean' ? parsed.highContrast : false,
          reduceMotion: typeof parsed.reduceMotion === 'boolean' ? parsed.reduceMotion : false,
          fontScale: typeof parsed.fontScale === 'number' ? parsed.fontScale : 1,
          closedCaptions: typeof parsed.closedCaptions === 'boolean' ? parsed.closedCaptions : false,
        };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [currentCaption, setCurrentCaption] = useState<string>('');
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const lastSpokenTextRef = useRef<string>('');
  const lastSpokenTimeRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const captionTimerRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  // Retain active utterances to prevent Chrome garbage collector from killing speech prematurely
  const activeUtterancesRef = useRef<SpeechSynthesisUtterance[]>([]);

  // Pleasant auditory feedback chime using Web Audio API (Instant, Universal, 100% Reliable)
  const playAudioChime = useCallback(() => {
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // Ignore
    }
  }, []);

  // Initialize and cache SpeechSynthesis voices
  const loadVoices = useCallback(() => {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      const available = window.speechSynthesis.getVoices();
      if (available && available.length > 0) {
        voicesRef.current = available;
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    const unlockAudio = () => {
      try {
        loadVoices();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          audioContextRef.current.resume().catch(() => {});
        }
      } catch {
        // Ignore
      }
    };

    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('mousemove', unlockAudio, { passive: true, once: true });
    window.addEventListener('pointerdown', unlockAudio, { passive: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('mousemove', unlockAudio);
      window.removeEventListener('pointerdown', unlockAudio);
    };
  }, [loadVoices]);

  // Sync settings with DOM classList, root styles and localStorage
  useEffect(() => {
    try {
      const root = document.documentElement;
      root.classList.toggle('high-contrast', !!settings.highContrast);
      root.classList.toggle('reduce-motion', !!settings.reduceMotion);
      root.classList.toggle('screen-reader', !!settings.screenReader);
      root.classList.toggle('enhanced-focus', !!settings.enhancedFocus);
      root.classList.toggle('closed-captions', !!settings.closedCaptions);
      root.classList.toggle('sign-language', !!settings.signLanguageGuide);
      root.classList.toggle('keyboard-nav', !!settings.keyboardNavMode);
      root.classList.toggle('cognitive-support', !!settings.cognitiveSupport);
      root.style.setProperty('--font-scale', `${settings.fontScale}`);

      localStorage.setItem('sleepee_accessibility_settings', JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Master Stop Audio Controller (Guarantees single active speech engine)
  const stopAllAudio = useCallback(() => {
    // Cancel any pending fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore
      }
    }
    if (audioPlayerRef.current) {
      try {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
        audioPlayerRef.current = null;
      } catch {
        // Ignore
      }
    }
    // Clear captions
    setCurrentCaption('');
  }, []);

  // Kill speech immediately when screen reader is toggled off
  useEffect(() => {
    if (!settings.screenReader) {
      stopAllAudio();
    }
  }, [settings.screenReader, stopAllAudio]);

  // High-reliability Browser Audio Speech Engine (Zero Server AI Dependency)
  const playAudioSpeech = useCallback(async (text: string, isArabic: boolean) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    // Stop any previously playing audio speech
    stopAllAudio();

    const lang = isArabic ? 'ar' : 'en';

    // Direct Browser HTML5 Audio stream (Fast & $0 Cost)
    try {
      const encoded = encodeURIComponent(cleanText.slice(0, 300));
      const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=tw-ob`;
      const audio = new Audio(directUrl);
      audio.playbackRate = 0.98;
      audioPlayerRef.current = audio;
      await audio.play();
    } catch (err) {
      console.warn('Audio playback error:', err);
    } finally {
      abortControllerRef.current = null;
    }
  }, [stopAllAudio]);

  // Robust Universal Arabic & English TTS Engine
  const speak = useCallback((text: string, forcedLang?: Language, isForced: boolean = false) => {
    if (typeof window === 'undefined') return;
    if (!text || !text.trim()) return;

    // Check setting unless it is a forced priority announcement
    if (!settings.screenReader && !isForced) return;

    const cleanText = text.trim();
    const now = Date.now();

    // Strict deduplication guard (prevents dual engine triggers or stuttering within 400ms)
    if (cleanText === lastSpokenTextRef.current && now - lastSpokenTimeRef.current < 400) {
      return;
    }
    if (now - lastSpokenTimeRef.current < 180) {
      return; // Ignore rapid fire within 180ms
    }

    // Always stop previous speech before starting new speech
    stopAllAudio();

    lastSpokenTextRef.current = cleanText;
    lastSpokenTimeRef.current = now;

    // Display closed captions
    setCurrentCaption(cleanText);
    clearTimeout(captionTimerRef.current);
    captionTimerRef.current = setTimeout(() => {
      setCurrentCaption('');
    }, 4500);

    const isArabic = forcedLang
      ? forcedLang === 'ar'
      : (propLanguage === 'ar' || document.documentElement.lang === 'ar' || /[\u0600-\u06FF]/.test(cleanText));

    if ('speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const voices = voicesRef.current.length > 0 ? voicesRef.current : window.speechSynthesis.getVoices();
        let arabicVoice: SpeechSynthesisVoice | null = null;

        if (isArabic) {
          for (const pri of ARABIC_VOICE_PRIORITIES) {
            const found = voices.find(v => v.lang && v.lang.replace('_', '-').toLowerCase().startsWith(pri.toLowerCase()));
            if (found) {
              arabicVoice = found;
              break;
            }
          }
          if (!arabicVoice) {
            arabicVoice = voices.find(v =>
              (v.lang && v.lang.toLowerCase().includes('ar')) ||
              (v.name && v.name.toLowerCase().includes('arabic')) ||
              (v.name && v.name.toLowerCase().includes('عربي'))
            ) || null;
          }
        } else {
          let englishVoice: SpeechSynthesisVoice | null = null;
          for (const pri of ENGLISH_VOICE_PRIORITIES) {
            const found = voices.find(v => v.lang && v.lang.replace('_', '-').toLowerCase().startsWith(pri.toLowerCase()));
            if (found) {
              englishVoice = found;
              break;
            }
          }
          if (englishVoice) {
            const utterance = new SpeechSynthesisUtterance(cleanText);
            utterance.voice = englishVoice;
            utterance.lang = englishVoice.lang || 'en-US';
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
            return;
          }
        }

        // If native browser Arabic voice exists, use SpeechSynthesis EXCLUSIVELY
        if (isArabic && arabicVoice) {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.voice = arabicVoice;
          utterance.lang = arabicVoice.lang || 'ar-SA';
          utterance.rate = 0.92;
          utterance.pitch = 1.0;

          activeUtterancesRef.current.push(utterance);
          utterance.onend = () => {
            const idx = activeUtterancesRef.current.indexOf(utterance);
            if (idx > -1) activeUtterancesRef.current.splice(idx, 1);
          };
          utterance.onerror = () => {
            const idx = activeUtterancesRef.current.indexOf(utterance);
            if (idx > -1) activeUtterancesRef.current.splice(idx, 1);
            playAudioSpeech(cleanText, isArabic);
          };

          window.speechSynthesis.speak(utterance);
          return;
        }
      } catch (e) {
        console.warn('Speech synthesis error:', e);
      }
    }

    // Fallback: Use High-Reliability Audio Speech Engine if WebSpeech lacks Arabic voice or failed
    playAudioSpeech(cleanText, isArabic);
  }, [playAudioChime, propLanguage, playAudioSpeech, stopAllAudio]);

  // announce() handles announce(text, lang) and announce(text, isPriority, lang)
  const announce = useCallback((text: string, priorityOrLang?: boolean | Language, maybeLang?: Language) => {
    let lang: Language = propLanguage;
    let isPriority = false;

    if (typeof priorityOrLang === 'boolean') {
      isPriority = priorityOrLang;
      if (maybeLang === 'ar' || maybeLang === 'en') {
        lang = maybeLang;
      } else {
        lang = /[\u0600-\u06FF]/.test(text) ? 'ar' : propLanguage;
      }
    } else if (typeof priorityOrLang === 'string') {
      lang = priorityOrLang;
    } else {
      lang = /[\u0600-\u06FF]/.test(text) ? 'ar' : propLanguage;
    }

    if (settings.screenReader || isPriority) {
      speak(text, lang, isPriority);
    }
  }, [settings.screenReader, speak, propLanguage]);

  const speakText = useCallback((text: string, lang?: Language) => {
    speak(text, lang, true); // direct speakText is usually user-triggered or priority
  }, [speak]);

  const announcePageTitle = useCallback((lang: Language) => {
    if (!settings.screenReader) return;
    const title = lang === 'ar' ? 'منصة التحقق من الضمان سليبي' : 'Sleepee Warranty Verification Platform';
    speak(title, lang, false);
  }, [speak, settings.screenReader]);

  // Robust setters that accept both booleans and functional updates (prev => !prev)
  const setScreenReaderMode = useCallback((valOrFn: BooleanOrUpdater) => {
    setSettings(p => {
      const nextVal = typeof valOrFn === 'function' ? valOrFn(p.screenReader) : valOrFn;
      return { ...p, screenReader: nextVal };
    });
  }, []);

  const setHighContrast = useCallback((valOrFn: BooleanOrUpdater) => {
    setSettings(p => {
      const nextVal = typeof valOrFn === 'function' ? valOrFn(p.highContrast) : valOrFn;
      return { ...p, highContrast: nextVal };
    });
  }, []);

  const setReduceMotion = useCallback((valOrFn: BooleanOrUpdater) => {
    setSettings(p => {
      const nextVal = typeof valOrFn === 'function' ? valOrFn(p.reduceMotion) : valOrFn;
      return { ...p, reduceMotion: nextVal };
    });
  }, []);

  const setEnhancedFocus = useCallback((valOrFn: BooleanOrUpdater) => {
    setSettings(p => {
      const nextVal = typeof valOrFn === 'function' ? valOrFn(p.enhancedFocus) : valOrFn;
      return { ...p, enhancedFocus: nextVal };
    });
  }, []);

  const setClosedCaptions = useCallback((valOrFn: BooleanOrUpdater) => {
    setSettings(p => {
      const nextVal = typeof valOrFn === 'function' ? valOrFn(p.closedCaptions) : valOrFn;
      return { ...p, closedCaptions: nextVal };
    });
  }, []);

  const setSignLanguageGuide = useCallback((valOrFn: BooleanOrUpdater) => {
    setSettings(p => {
      const nextVal = typeof valOrFn === 'function' ? valOrFn(p.signLanguageGuide) : valOrFn;
      return { ...p, signLanguageGuide: nextVal };
    });
  }, []);

  const setKeyboardNavMode = useCallback((valOrFn: BooleanOrUpdater) => {
    setSettings(p => {
      const nextVal = typeof valOrFn === 'function' ? valOrFn(p.keyboardNavMode) : valOrFn;
      return { ...p, keyboardNavMode: nextVal };
    });
  }, []);

  const setCognitiveSupport = useCallback((valOrFn: BooleanOrUpdater) => {
    setSettings(p => {
      const nextVal = typeof valOrFn === 'function' ? valOrFn(p.cognitiveSupport) : valOrFn;
      return { ...p, cognitiveSupport: nextVal };
    });
  }, []);

  // Direct Toggle Helpers
  const toggleScreenReader = useCallback(() => {
    setSettings(p => ({ ...p, screenReader: !p.screenReader }));
  }, []);

  const toggleHighContrast = useCallback(() => {
    setSettings(p => ({ ...p, highContrast: !p.highContrast }));
  }, []);

  const toggleReduceMotion = useCallback(() => {
    setSettings(p => ({ ...p, reduceMotion: !p.reduceMotion }));
  }, []);

  const toggleEnhancedFocus = useCallback(() => {
    setSettings(p => ({ ...p, enhancedFocus: !p.enhancedFocus }));
  }, []);

  const toggleClosedCaptions = useCallback(() => {
    setSettings(p => ({ ...p, closedCaptions: !p.closedCaptions }));
  }, []);

  const toggleSignLanguageGuide = useCallback(() => {
    setSettings(p => ({ ...p, signLanguageGuide: !p.signLanguageGuide }));
  }, []);

  const toggleKeyboardNavMode = useCallback(() => {
    setSettings(p => ({ ...p, keyboardNavMode: !p.keyboardNavMode }));
  }, []);

  const toggleCognitiveSupport = useCallback(() => {
    setSettings(p => ({ ...p, cognitiveSupport: !p.cognitiveSupport }));
  }, []);

  // Font adjustments
  const increaseFont = useCallback(() => {
    setSettings(p => ({ ...p, fontScale: Math.min(Math.round((p.fontScale + 0.1) * 10) / 10, 1.2) }));
  }, []);

  const decreaseFont = useCallback(() => {
    setSettings(p => ({ ...p, fontScale: Math.max(Math.round((p.fontScale - 0.1) * 10) / 10, 0.8) }));
  }, []);

  const setMaxFont = useCallback(() => {
    setSettings(p => ({ ...p, fontScale: 1.2 }));
  }, []);

  const resetFont = useCallback(() => {
    setSettings(p => ({ ...p, fontScale: 1 }));
  }, []);

  // Determine if any accessibility feature is currently active
  const isAccessibilityActive =
    settings.screenReader ||
    settings.highContrast ||
    settings.reduceMotion ||
    settings.enhancedFocus ||
    settings.closedCaptions ||
    settings.signLanguageGuide ||
    settings.keyboardNavMode ||
    settings.cognitiveSupport ||
    settings.fontScale !== 1;

  // Toggle master accessibility mode
  const toggleAccessibilityMode = useCallback(() => {
    if (isAccessibilityActive) {
      setSettings(DEFAULT_SETTINGS);
      speak('تمت إعادة ضبط جميع إعدادات إمكانية الوصول إلى الوضع الافتراضي', 'ar');
    } else {
      setSettings({
        screenReader: true,
        highContrast: true,
        reduceMotion: true,
        fontScale: 1.1,
        enhancedFocus: true,
        closedCaptions: true,
        signLanguageGuide: true,
        keyboardNavMode: true,
        cognitiveSupport: true,
      });
      speak('تم تفعيل وضع التيسير الرقمي الشامل وإمكانية الوصول', 'ar');
    }
  }, [isAccessibilityActive, speak]);

  // =========================================================================
  // UNIVERSAL ARABIC SCREEN NARRATOR (HOVER, FOCUS & CLICK LISTENER)
  // Supports: "عند الوقوف أو الضغط أو المرور" across all pages in Arabic!
  // =========================================================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let hoverTimer: any = null;
    let lastTarget: HTMLElement | null = null;

    const extractNarration = (el: HTMLElement): string | null => {
      // 1. Explicit accessibility override
      if (el.dataset.narrate) return el.dataset.narrate;
      const customNarrate = el.getAttribute('data-narrate');
      if (customNarrate) return customNarrate;

      const tagName = el.tagName.toLowerCase();

      // 2. Form Inputs
      if (tagName === 'input') {
        const inp = el as HTMLInputElement;
        const placeholder = inp.placeholder || '';
        const label = inp.getAttribute('aria-label') || placeholder || '';
        if (inp.type === 'date') return `حقل اختيار التاريخ: ${label}`;
        if (inp.type === 'tel') return `حقل إدخال رقم الهاتف: ${label}`;
        if (inp.type === 'checkbox') {
          return `خيار تبديل: ${label} - الحالة: ${inp.checked ? 'مفعل' : 'غير مفعل'}`;
        }
        if (inp.type === 'radio') {
          return `زر اختيار: ${label} - الحالة: ${inp.checked ? 'محدد' : 'غير محدد'}`;
        }
        return `حقل إدخال: ${label}`;
      }

      if (tagName === 'textarea') {
        const txt = el as HTMLTextAreaElement;
        const label = txt.getAttribute('aria-label') || txt.placeholder || 'ملاحظات وتفاصيل إضافية';
        return `حقل إدخال نصي: ${label}`;
      }

      if (tagName === 'select') {
        const sel = el as HTMLSelectElement;
        const label = sel.getAttribute('aria-label') || 'المحافظة أو المنطقة';
        const selectedText = sel.options[sel.selectedIndex]?.text || '';
        return `قائمة اختيار: ${label}${selectedText ? ` - الخيار المحدد: ${selectedText}` : ''}`;
      }

      // 3. Tabs
      if (el.getAttribute('role') === 'tab') {
        const text = el.getAttribute('aria-label') || el.innerText || '';
        const isSelected = el.getAttribute('aria-selected') === 'true';
        return `تبويب: ${text.trim()} ${isSelected ? '(محدد حالياً)' : ''}`;
      }

      // 4. Buttons
      if (tagName === 'button' || el.getAttribute('role') === 'button') {
        const text = el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || '';
        const clean = text.trim().replace(/\s+/g, ' ');
        if (!clean) return 'زر اضغط للتفعيل';
        if (clean.startsWith('زر')) return clean;
        return `زر: ${clean}`;
      }

      // 5. Links
      if (tagName === 'a' || el.getAttribute('role') === 'link') {
        const text = el.getAttribute('aria-label') || el.getAttribute('title') || el.innerText || '';
        const clean = text.trim().replace(/\s+/g, ' ');
        if (!clean) return 'رابط';
        if (clean.startsWith('رابط')) return clean;
        return `رابط: ${clean}`;
      }

      // 6. Headings (H1 to H6)
      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        const text = el.innerText?.trim();
        if (text && text.length < 120) return `عنوان: ${text}`;
      }

      // 7. Labels
      if (tagName === 'label') {
        const text = el.innerText?.trim();
        if (text && text.length < 80) return `تسمية: ${text}`;
      }

      // 8. Badges, Alerts, Status
      if (el.getAttribute('role') === 'alert' || el.getAttribute('role') === 'status') {
        const text = el.innerText?.trim();
        if (text) return `تنبيه وحالة: ${text}`;
      }

      // 9. List Items
      if (tagName === 'li') {
        const text = el.innerText?.trim();
        if (text && text.length < 120) return `عنصر: ${text}`;
      }

      // 10. Direct ARIA attributes
      const ariaLabel = el.getAttribute('aria-label');
      if (ariaLabel && ariaLabel.trim()) return ariaLabel.trim();

      const title = el.getAttribute('title');
      if (title && title.trim()) return title.trim();

      // 11. Paragraphs, Spans, Divs, Table cells & Leaf Text Elements
      if (['p', 'span', 'div', 'td', 'th', 'b', 'strong', 'dt', 'dd', 'figcaption'].includes(tagName)) {
        if (el.children.length <= 2) {
          const rawText = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
          if (rawText && rawText.length >= 2 && rawText.length < 300) {
            return rawText;
          }
        }
      }

      return null;
    };

    const findNarrationTarget = (rawEl: HTMLElement | null): HTMLElement | null => {
      if (!rawEl) return null;

      // 1. Prioritize interactive parent containers, headings, and labels
      const primary = rawEl.closest(
        'button, a, input, select, textarea, [role="tab"], [role="button"], [role="alert"], [role="status"], [data-narrate], [aria-label], h1, h2, h3, h4, h5, h6, label, li'
      ) as HTMLElement;

      if (primary) return primary;

      // 2. Fall back to standalone text elements
      return rawEl.closest(
        'p, span, div, td, th, strong, b, dt, dd, figcaption'
      ) as HTMLElement;
    };

    // 1. Mouse Hover narration ("عن المرور والوقوف")
    const handleMouseOver = (e: MouseEvent) => {
      if (!settings.screenReader) return;

      const rawTarget = e.target as HTMLElement;
      if (!rawTarget) return;

      const target = findNarrationTarget(rawTarget);

      if (!target || target === lastTarget) return;

      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        lastTarget = target;
        const text = extractNarration(target);
        if (text) {
          speak(text);
        }
      }, 200);
    };

    // 2. Keyboard Tab navigation narration ("عن التركيز والتنقل بلوحة المفاتيح")
    const handleFocusIn = (e: FocusEvent) => {
      if (!settings.screenReader) return;

      const target = (e.target as HTMLElement).closest(
        'button, a, input, select, textarea, [role="tab"], [role="button"], [data-narrate], [aria-label]'
      ) as HTMLElement;

      if (!target || target === lastTarget) return;
      lastTarget = target;

      const text = extractNarration(target);
      if (text) {
        speak(text);
      }
    };

    // 3. Click narration ("عن الضغط")
    const handleClick = (e: MouseEvent) => {
      if (!settings.screenReader) return;

      const target = (e.target as HTMLElement).closest(
        'button, a, [role="tab"], [role="button"], input, select'
      ) as HTMLElement;

      if (!target) return;

      const text = extractNarration(target);
      if (text) {
        let actionText = text;
        if (text.startsWith('زر:')) {
          actionText = `تم الضغط على ${text.replace('زر:', '').trim()}`;
        } else if (text.startsWith('رابط:')) {
          actionText = `تم فتح ${text.replace('رابط:', '').trim()}`;
        } else if (text.startsWith('تبويب:')) {
          actionText = `تم اختيار ${text.replace('تبويب:', '').trim()}`;
        }
        speak(actionText);
      }
    };

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('focusin', handleFocusIn, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      clearTimeout(hoverTimer);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('click', handleClick);
    };
  }, [settings.screenReader, speak]);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        screenReaderMode: settings.screenReader,
        highContrast: settings.highContrast,
        reduceMotion: settings.reduceMotion,
        fontScale: settings.fontScale,
        enhancedFocus: settings.enhancedFocus,
        closedCaptions: settings.closedCaptions,
        signLanguageGuide: settings.signLanguageGuide,
        keyboardNavMode: settings.keyboardNavMode,
        cognitiveSupport: settings.cognitiveSupport,
        isAccessibilityActive,
        currentCaption,

        setScreenReaderMode,
        setHighContrast,
        setReduceMotion,
        setEnhancedFocus,
        setClosedCaptions,
        setSignLanguageGuide,
        setKeyboardNavMode,
        setCognitiveSupport,

        toggleScreenReader,
        toggleHighContrast,
        toggleReduceMotion,
        toggleEnhancedFocus,
        toggleClosedCaptions,
        toggleSignLanguageGuide,
        toggleKeyboardNavMode,
        toggleCognitiveSupport,
        toggleAccessibilityMode,

        increaseFont,
        decreaseFont,
        setMaxFont,
        resetFont,

        speak,
        speakText,
        announce,
        announcePageTitle,
        playAudioChime,
      }}
    >
      {children}

      {/* Real-time Closed Captions Overlay at Bottom when Screen Reader or Captions Active */}
      {(settings.closedCaptions || settings.screenReader) && currentCaption && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-xl w-auto px-4 py-2 bg-slate-950/92 text-white border border-emerald-500/70 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none"
        >
          <div className="flex items-center gap-1.5 shrink-0 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300">
              {propLanguage === 'en' ? 'Screen Reader' : 'قارئ الشاشة العربي'}
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold font-sans text-center leading-snug text-white">
            {currentCaption}
          </span>
        </div>
      )}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
