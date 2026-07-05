export type RevelationPlace = 'Mekka' | 'Medina';

export interface Ayah {
  number: number;
  arabic: string;
  translationDe: string;
  transliteration: string;
}

export interface Surah {
  id: number;
  nameArabic: string;
  nameTransliteration: string;
  nameGerman: string;
  revelationPlace: RevelationPlace;
  ayahCount: number;
  ayahs?: Ayah[];
}

export interface DuaCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface Dua {
  id: string;
  categoryId: string;
  title: string;
  arabic: string;
  transliteration: string;
  translationDe: string;
  source?: string;
}

export type ReminderType = 'vers' | 'hadith' | 'dua';
export type ReminderSlot = 'Morgen' | 'Nachmittag' | 'Abend';

export interface Reminder {
  id: string;
  type: ReminderType;
  slot: ReminderSlot;
  title: string;
  arabic?: string;
  transliteration?: string;
  textDe: string;
  source: string;
}
