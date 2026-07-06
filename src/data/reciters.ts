export interface Reciter {
  id: string;
  name: string;
  style?: string;
  /** EveryAyah.com directory slug, e.g. everyayah.com/data/<everyAyahFolder>/001001.mp3 */
  everyAyahFolder: string;
}

// Starter set sourced from everyayah.com's public per-ayah recitation archive.
export const RECITERS: Reciter[] = [
  { id: 'alafasy', name: 'Mishary Rashid Al-Afasy', everyAyahFolder: 'Alafasy_128kbps' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', style: 'Murattal', everyAyahFolder: 'Husary_128kbps' },
  { id: 'abdulbasit', name: 'Abdul Basit Abdul Samad', style: 'Murattal', everyAyahFolder: 'Abdul_Basit_Murattal_192kbps' },
  { id: 'ghamdi', name: 'Saad Al-Ghamdi', everyAyahFolder: 'Ghamadi_40kbps' },
  { id: 'shatri', name: 'Abu Bakr Al-Shatri', everyAyahFolder: 'Abu_Bakr_Ash-Shaatree_128kbps' },
];

export const DEFAULT_RECITER_ID = RECITERS[0].id;

export function getReciterById(id: string): Reciter {
  return RECITERS.find((r) => r.id === id) ?? RECITERS[0];
}

export function getAyahAudioUrl(reciter: Reciter, surahId: number, ayahNumber: number): string {
  const surah = String(surahId).padStart(3, '0');
  const ayah = String(ayahNumber).padStart(3, '0');
  return `https://everyayah.com/data/${reciter.everyAyahFolder}/${surah}${ayah}.mp3`;
}
