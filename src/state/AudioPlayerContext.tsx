import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { loadJSON, saveJSON } from '../lib/storage';
import { DEFAULT_RECITER_ID, RECITERS, getAyahAudioUrl, getReciterById } from '../data/reciters';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

interface AyahKey {
  surahId: number;
  ayahNumber: number;
}

interface AudioPrefs {
  reciterId: string;
  rate: PlaybackRate;
}

const PREFS_KEY = 'nur.audio.prefs.v1';
const DEFAULT_PREFS: AudioPrefs = { reciterId: DEFAULT_RECITER_ID, rate: 1 };
const POOL_LIMIT = 6;

interface AudioPlayerApi {
  reciterId: string;
  rate: PlaybackRate;
  current: AyahKey | null;
  status: PlaybackStatus;
  currentTime: number;
  duration: number;
  reciters: typeof RECITERS;
  setReciter: (id: string) => void;
  cycleRate: () => void;
  play: (surahId: number, ayahNumber: number) => void;
  pause: () => void;
  toggle: (surahId: number, ayahNumber: number) => void;
  preload: (surahId: number, ayahNumber: number) => void;
  statusFor: (surahId: number, ayahNumber: number) => PlaybackStatus;
}

const AudioPlayerCtx = createContext<AudioPlayerApi | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<AudioPrefs>(() => loadJSON(PREFS_KEY, DEFAULT_PREFS));
  const [current, setCurrent] = useState<AyahKey | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const poolRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const activeUrlRef = useRef<string | null>(null);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;

  useEffect(() => {
    saveJSON(PREFS_KEY, prefs);
  }, [prefs]);

  useEffect(
    () => () => {
      poolRef.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      poolRef.current.clear();
    },
    [],
  );

  const evictIfNeeded = useCallback(() => {
    const pool = poolRef.current;
    if (pool.size <= POOL_LIMIT) return;
    for (const [url, audio] of pool) {
      if (pool.size <= POOL_LIMIT) break;
      if (url === activeUrlRef.current) continue;
      audio.pause();
      audio.src = '';
      pool.delete(url);
    }
  }, []);

  const urlFor = useCallback(
    (surahId: number, ayahNumber: number) => getAyahAudioUrl(getReciterById(prefsRef.current.reciterId), surahId, ayahNumber),
    [],
  );

  const ensureAudio = useCallback(
    (url: string) => {
      let audio = poolRef.current.get(url);
      if (!audio) {
        audio = new Audio();
        audio.preload = 'auto';
        audio.src = url;
        poolRef.current.set(url, audio);
        evictIfNeeded();
      }
      return audio;
    },
    [evictIfNeeded],
  );

  const preload = useCallback(
    (surahId: number, ayahNumber: number) => {
      ensureAudio(urlFor(surahId, ayahNumber));
    },
    [ensureAudio, urlFor],
  );

  const pause = useCallback(() => {
    const url = activeUrlRef.current;
    if (url) {
      const audio = poolRef.current.get(url);
      audio?.pause();
    }
    setStatus((s) => (s === 'playing' || s === 'loading' ? 'paused' : s));
  }, []);

  const play = useCallback(
    (surahId: number, ayahNumber: number) => {
      const url = urlFor(surahId, ayahNumber);

      if (activeUrlRef.current && activeUrlRef.current !== url) {
        poolRef.current.get(activeUrlRef.current)?.pause();
      }

      const audio = ensureAudio(url);
      activeUrlRef.current = url;
      audio.playbackRate = prefsRef.current.rate;
      setCurrent({ surahId, ayahNumber });
      setCurrentTime(audio.currentTime || 0);
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);

      const isReady = audio.readyState >= 3;
      setStatus(isReady ? 'playing' : 'loading');

      audio.onwaiting = () => setStatus('loading');
      audio.onplaying = () => setStatus('playing');
      audio.onpause = () => {
        if (activeUrlRef.current === url) setStatus((s) => (s === 'error' ? s : 'paused'));
      };
      audio.ontimeupdate = () => {
        if (activeUrlRef.current === url) setCurrentTime(audio.currentTime);
      };
      audio.ondurationchange = () => {
        if (activeUrlRef.current === url && Number.isFinite(audio.duration)) setDuration(audio.duration);
      };
      audio.onended = () => {
        if (activeUrlRef.current === url) {
          audio.currentTime = 0;
          setStatus('paused');
          setCurrentTime(0);
        }
      };
      audio.onerror = () => {
        if (activeUrlRef.current === url) setStatus('error');
      };

      audio.play().catch(() => {
        if (activeUrlRef.current === url) setStatus('error');
      });
    },
    [ensureAudio, urlFor],
  );

  const toggle = useCallback(
    (surahId: number, ayahNumber: number) => {
      const isCurrent = current?.surahId === surahId && current?.ayahNumber === ayahNumber;
      if (isCurrent && status === 'playing') {
        pause();
      } else {
        play(surahId, ayahNumber);
      }
    },
    [current, status, pause, play],
  );

  const setReciter = useCallback(
    (id: string) => {
      if (activeUrlRef.current) {
        poolRef.current.get(activeUrlRef.current)?.pause();
      }
      activeUrlRef.current = null;
      setCurrent(null);
      setStatus('idle');
      setCurrentTime(0);
      setDuration(0);
      setPrefs((p) => ({ ...p, reciterId: id }));
    },
    [],
  );

  const cycleRate = useCallback(() => {
    setPrefs((p) => {
      const idx = PLAYBACK_RATES.indexOf(p.rate);
      const next = PLAYBACK_RATES[(idx + 1) % PLAYBACK_RATES.length];
      const url = activeUrlRef.current;
      if (url) {
        const audio = poolRef.current.get(url);
        if (audio) audio.playbackRate = next;
      }
      return { ...p, rate: next };
    });
  }, []);

  const statusFor = useCallback(
    (surahId: number, ayahNumber: number): PlaybackStatus =>
      current?.surahId === surahId && current?.ayahNumber === ayahNumber ? status : 'idle',
    [current, status],
  );

  const api = useMemo<AudioPlayerApi>(
    () => ({
      reciterId: prefs.reciterId,
      rate: prefs.rate,
      current,
      status,
      currentTime,
      duration,
      reciters: RECITERS,
      setReciter,
      cycleRate,
      play,
      pause,
      toggle,
      preload,
      statusFor,
    }),
    [prefs, current, status, currentTime, duration, setReciter, cycleRate, play, pause, toggle, preload, statusFor],
  );

  return <AudioPlayerCtx.Provider value={api}>{children}</AudioPlayerCtx.Provider>;
}

export function useAudioPlayer(): AudioPlayerApi {
  const ctx = useContext(AudioPlayerCtx);
  if (!ctx) throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  return ctx;
}
