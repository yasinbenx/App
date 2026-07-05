import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loadJSON, saveJSON } from '../lib/storage';

export interface BookmarkedAyah {
  surahId: number;
  ayahNumber: number;
}

export interface LastRead {
  surahId: number;
  ayahNumber: number;
}

export type ReadingFontSize = 'klein' | 'mittel' | 'gross';

export interface ReadingPrefs {
  fontSize: ReadingFontSize;
  showTransliteration: boolean;
  showTranslation: boolean;
}

export interface ReminderSettings {
  morgen: boolean;
  nachmittag: boolean;
  abend: boolean;
  typVers: boolean;
  typHadith: boolean;
  typDua: boolean;
}

interface AppState {
  bookmarkedAyahs: BookmarkedAyah[];
  favoriteDuaIds: string[];
  lastRead: LastRead | null;
  readingPrefs: ReadingPrefs;
  reminderSettings: ReminderSettings;
}

const DEFAULT_STATE: AppState = {
  bookmarkedAyahs: [{ surahId: 36, ayahNumber: 2 }],
  favoriteDuaIds: ['hasbunallah'],
  lastRead: { surahId: 36, ayahNumber: 2 },
  readingPrefs: { fontSize: 'mittel', showTransliteration: true, showTranslation: true },
  reminderSettings: {
    morgen: true,
    nachmittag: true,
    abend: true,
    typVers: true,
    typHadith: true,
    typDua: false,
  },
};

const STORAGE_KEY = 'nur.app.state.v1';

interface AppStateApi extends AppState {
  toggleBookmarkAyah: (surahId: number, ayahNumber: number) => void;
  isAyahBookmarked: (surahId: number, ayahNumber: number) => boolean;
  toggleFavoriteDua: (duaId: string) => void;
  isDuaFavorite: (duaId: string) => boolean;
  setLastRead: (surahId: number, ayahNumber: number) => void;
  updateReadingPrefs: (prefs: Partial<ReadingPrefs>) => void;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
}

const AppStateCtx = createContext<AppStateApi | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadJSON(STORAGE_KEY, DEFAULT_STATE));

  useEffect(() => {
    saveJSON(STORAGE_KEY, state);
  }, [state]);

  const api = useMemo<AppStateApi>(
    () => ({
      ...state,
      toggleBookmarkAyah: (surahId, ayahNumber) =>
        setState((prev) => {
          const exists = prev.bookmarkedAyahs.some((b) => b.surahId === surahId && b.ayahNumber === ayahNumber);
          return {
            ...prev,
            bookmarkedAyahs: exists
              ? prev.bookmarkedAyahs.filter((b) => !(b.surahId === surahId && b.ayahNumber === ayahNumber))
              : [...prev.bookmarkedAyahs, { surahId, ayahNumber }],
          };
        }),
      isAyahBookmarked: (surahId, ayahNumber) =>
        state.bookmarkedAyahs.some((b) => b.surahId === surahId && b.ayahNumber === ayahNumber),
      toggleFavoriteDua: (duaId) =>
        setState((prev) => ({
          ...prev,
          favoriteDuaIds: prev.favoriteDuaIds.includes(duaId)
            ? prev.favoriteDuaIds.filter((id) => id !== duaId)
            : [...prev.favoriteDuaIds, duaId],
        })),
      isDuaFavorite: (duaId) => state.favoriteDuaIds.includes(duaId),
      setLastRead: (surahId, ayahNumber) =>
        setState((prev) => ({ ...prev, lastRead: { surahId, ayahNumber } })),
      updateReadingPrefs: (prefs) =>
        setState((prev) => ({ ...prev, readingPrefs: { ...prev.readingPrefs, ...prefs } })),
      updateReminderSettings: (settings) =>
        setState((prev) => ({ ...prev, reminderSettings: { ...prev.reminderSettings, ...settings } })),
    }),
    [state],
  );

  return <AppStateCtx.Provider value={api}>{children}</AppStateCtx.Provider>;
}

export function useAppState(): AppStateApi {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
