import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type ReadingMode = 'fokus' | 'klassisch';

interface ReadingModeApi {
  mode: ReadingMode;
  setMode: (mode: ReadingMode) => void;
}

const ReadingModeCtx = createContext<ReadingModeApi | null>(null);

// Intentionally in-memory only (no localStorage): the chosen mode should be
// remembered while the app is open, but not persisted across app restarts.
export function ReadingModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ReadingMode>('fokus');
  const api = useMemo(() => ({ mode, setMode }), [mode]);
  return <ReadingModeCtx.Provider value={api}>{children}</ReadingModeCtx.Provider>;
}

export function useReadingMode(): ReadingModeApi {
  const ctx = useContext(ReadingModeCtx);
  if (!ctx) throw new Error('useReadingMode must be used within ReadingModeProvider');
  return ctx;
}
