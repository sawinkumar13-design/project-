import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Volume2, VolumeX, Check, FileDown } from 'lucide-react';

/**
 * Modern Interactive Theme Accent Color Switcher & Navbar Controls
 * Built with React, Tailwind CSS, Framer Motion, and Web Audio API
 */

export const THEME_PALETTES = {
  cyan: {
    id: 'cyan',
    name: 'Cyan',
    hex: '#06b6d4',
    rgb: '6, 182, 212',
    glow: 'rgba(6, 182, 212, 0.35)',
    hover: '#22d3ee'
  },
  violet: {
    id: 'violet',
    name: 'Violet',
    hex: '#8b5cf6',
    rgb: '139, 92, 246',
    glow: 'rgba(139, 92, 246, 0.35)',
    hover: '#a78bfa'
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    hex: '#10b981',
    rgb: '16, 185, 129',
    glow: 'rgba(16, 185, 129, 0.35)',
    hover: '#34d399'
  },
  amber: {
    id: 'amber',
    name: 'Amber',
    hex: '#f59e0b',
    rgb: '245, 158, 11',
    glow: 'rgba(245, 158, 11, 0.35)',
    hover: '#fbbf24'
  }
};

const ThemeContext = createContext({
  accent: 'cyan',
  theme: THEME_PALETTES.cyan,
  setAccent: () => {}
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [accent, setAccentState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio-theme-accent');
      if (saved && THEME_PALETTES[saved]) return saved;
    }
    return 'cyan';
  });

  const setAccent = (colorKey) => {
    if (!THEME_PALETTES[colorKey]) return;
    setAccentState(colorKey);
    const theme = THEME_PALETTES[colorKey];

    // Update CSS Root Variables
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--accent', theme.hex);
      root.style.setProperty('--accent-rgb', theme.rgb);
      root.style.setProperty('--accent-glow', theme.glow);
      root.style.setProperty('--accent-hover', theme.hover);

      // Also trigger WebGL accent light sync if present
      if (typeof window.updateSmokeAccent === 'function') {
        window.updateSmokeAccent(theme.hex);
      }
    }

    // Persist to localStorage
    try {
      localStorage.setItem('portfolio-theme-accent', colorKey);
    } catch (e) {}
  };

  useEffect(() => {
    setAccent(accent);
  }, []);

  return (
    <ThemeContext.Provider value={{ accent, theme: THEME_PALETTES[accent], setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const ThemeAccentSwitcher = ({ resumeUrl = 'assets/Sawin_Kumar_Resume.pdf' }) => {
  const { accent, theme, setAccent } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const containerRef = useRef(null);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);

  const themeKeys = Object.keys(THEME_PALETTES);

  // Click outside to dismiss
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % themeKeys.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + themeKeys.length) % themeKeys.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setAccent(themeKeys[focusedIndex]);
      setIsOpen(false);
    }
  };

  // Ambient Drone Audio Synthesizer
  const toggleAudio = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        audioCtxRef.current = ctx;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(150, ctx.currentTime);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gainNodeRef.current = gain;

        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime);

        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(55.35, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      if (!isPlaying) {
        gainNodeRef.current.gain.setTargetAtTime(0.018, audioCtxRef.current.currentTime, 0.4);
        setIsPlaying(true);
      } else {
        gainNodeRef.current.gain.setTargetAtTime(0.00001, audioCtxRef.current.currentTime, 0.3);
        setIsPlaying(false);
      }
    } catch (err) {
      console.warn('Audio synthesis not supported:', err);
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-2.5" ref={containerRef} onKeyDown={handleKeyDown}>
      {/* 1. Audio / Mute Toggle Button */}
      <button
        onClick={toggleAudio}
        aria-label={isPlaying ? 'Mute ambient sound' : 'Play ambient cosmic sound'}
        title={isPlaying ? 'Ambient Audio Playing' : 'Mute Ambient Audio'}
        className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
        style={{
          borderColor: isPlaying ? theme.hex : undefined,
          boxShadow: isPlaying ? `0 0 16px ${theme.glow}` : undefined,
          color: isPlaying ? theme.hex : undefined
        }}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4 transition-transform duration-200" />
        ) : (
          <VolumeX className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {/* 2. Theme Switcher Trigger Button & Floating Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="Toggle Theme Accent Selector"
          title="Switch Accent Theme"
          className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700/60 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
          style={{
            borderColor: isOpen ? theme.hex : undefined,
            boxShadow: isOpen ? `0 0 16px ${theme.glow}` : undefined,
            color: isOpen ? theme.hex : undefined
          }}
        >
          <Palette className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
        </button>

        {/* Animated Floating Dropdown Card via Framer Motion */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-full mt-2.5 w-48 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-2 z-50 origin-top-right select-none"
              style={{
                boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 24px ${theme.glow}`
              }}
              role="menu"
            >
              <div className="px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1 flex items-center justify-between">
                <span>Theme Accent</span>
                <span className="font-bold transition-colors duration-300" style={{ color: theme.hex }}>
                  {theme.name}
                </span>
              </div>

              <div className="space-y-0.5">
                {themeKeys.map((key, idx) => {
                  const opt = THEME_PALETTES[key];
                  const isSelected = accent === key;
                  const isFocused = focusedIndex === idx;

                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setAccent(key);
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setFocusedIndex(idx)}
                      role="menuitem"
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-white/[0.08] text-white'
                          : isFocused
                          ? 'bg-white/[0.04] text-slate-200'
                          : 'text-slate-300 hover:bg-white/[0.06]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-sm ring-2 transition-all"
                          style={{
                            backgroundColor: opt.hex,
                            boxShadow: `0 0 8px ${opt.glow}`,
                            borderColor: isSelected ? '#ffffff' : 'transparent'
                          }}
                        />
                        <span>{opt.name}</span>
                      </span>

                      {isSelected && (
                        <Check
                          className="w-3.5 h-3.5 transition-transform duration-200 scale-100"
                          style={{ color: opt.hex }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. CV / Resume Rounded Pill Button */}
      <a
        href={resumeUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        title="Download CV / Resume"
        className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-mono font-medium transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950"
        style={{
          borderColor: theme.hex,
          color: theme.hex,
          backgroundColor: `rgba(${theme.rgb}, 0.08)`,
          boxShadow: `0 0 16px rgba(${theme.rgb}, 0.16)`
        }}
      >
        <FileDown className="w-3.5 h-3.5" />
        <span>CV / Resume</span>
      </a>
    </div>
  );
};

export default ThemeAccentSwitcher;
