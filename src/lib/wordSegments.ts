export interface WordSegment {
  index: number;
  text: string;
  /** Start/end offsets in ms within the ayah audio file. Null until a timing dataset is integrated. */
  startMs: number | null;
  endMs: number | null;
}

/**
 * Splits an ayah's Arabic text into tappable word segments. Timing is left
 * null because EveryAyah only ships whole-ayah files, not per-word timing.
 * Swapping in a per-word timing dataset later only means filling in
 * startMs/endMs here — callers (word-tap handlers, highlighting) don't change.
 */
export function getWordSegments(arabicText: string): WordSegment[] {
  return arabicText
    .split(/\s+/)
    .filter(Boolean)
    .map((text, index) => ({ index, text, startMs: null, endMs: null }));
}

export function hasWordTiming(segments: WordSegment[]): boolean {
  return segments.length > 0 && segments.every((s) => s.startMs !== null && s.endMs !== null);
}
