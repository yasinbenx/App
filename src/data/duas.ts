import type { Dua, DuaCategory } from './types';

export const DUA_CATEGORIES: DuaCategory[] = [
  { id: 'morgen-abend', title: 'Morgen & Abend', subtitle: 'Bittgebete zum Tagesbeginn und -ende', icon: 'sunrise' },
  { id: 'alltag', title: 'Alltag', subtitle: 'Für kleine Momente zwischendurch', icon: 'footprints' },
  { id: 'schutz', title: 'Schutz & Sorgen', subtitle: 'Bei Angst, Kummer und Unsicherheit', icon: 'shield' },
  { id: 'essen', title: 'Essen & Trinken', subtitle: 'Vor und nach dem Essen', icon: 'utensils' },
  { id: 'reisen', title: 'Reisen', subtitle: 'Für unterwegs und neue Wege', icon: 'compass' },
  { id: 'familie', title: 'Familie', subtitle: 'Für Eltern, Kinder und Angehörige', icon: 'heart-handshake' },
];

export const DUAS: Dua[] = [
  {
    id: 'sayyid-al-istighfar',
    categoryId: 'morgen-abend',
    title: 'Sayyid al-Istighfar',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَىٰ عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ',
    transliteration: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala ahdika wa wa'dika ma stata'tu",
    translationDe: 'O Allah, Du bist mein Herr, es gibt keinen Gott außer Dir. Du hast mich erschaffen und ich bin Dein Diener, und ich halte an Deinem Bund und Versprechen fest, so gut ich kann.',
    source: 'Sahih al-Bukhari (gekürzt)',
  },
  {
    id: 'morgen-dhikr',
    categoryId: 'morgen-abend',
    title: 'Morgengedenken',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Asbahna wa asbaha l-mulku lillah, wa l-hamdu lillah',
    translationDe: 'Wir haben den Morgen erreicht, und die Herrschaft gehört Allah; alles Lob gebührt Allah.',
    source: 'Sahih Muslim (gekürzt)',
  },
  {
    id: 'abend-dhikr',
    categoryId: 'morgen-abend',
    title: 'Abendgedenken',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Amsaina wa amsa l-mulku lillah, wa l-hamdu lillah',
    translationDe: 'Wir haben den Abend erreicht, und die Herrschaft gehört Allah; alles Lob gebührt Allah.',
    source: 'Sahih Muslim (gekürzt)',
  },
  {
    id: 'haus-betreten',
    categoryId: 'alltag',
    title: 'Beim Betreten des Hauses',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَىٰ رَبِّنَا تَوَكَّلْنَا',
    transliteration: "Bismillahi walajna, wa bismillahi kharajna, wa 'ala rabbina tawakkalna",
    translationDe: 'Im Namen Allahs treten wir ein, im Namen Allahs gehen wir hinaus, und auf unseren Herrn vertrauen wir.',
    source: 'Sunan Abi Dawud',
  },
  {
    id: 'haus-verlassen',
    categoryId: 'alltag',
    title: 'Beim Verlassen des Hauses',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: "Bismillahi tawakkaltu 'ala llahi wa la haula wa la quwwata illa billah",
    translationDe: 'Im Namen Allahs, ich verlasse mich auf Allah; es gibt keine Macht und keine Kraft außer bei Allah.',
    source: 'Sunan at-Tirmidhi',
  },
  {
    id: 'wissen-mehren',
    categoryId: 'alltag',
    title: 'Um mehr Wissen bitten',
    arabic: 'رَبِّ زِدْنِي عِلْمًا',
    transliteration: 'Rabbi zidni ilma',
    translationDe: 'Mein Herr, mehre mein Wissen.',
    source: 'Sure Ta-Ha, 20:114',
  },
  {
    id: 'hasbunallah',
    categoryId: 'schutz',
    title: 'Hasbunallah',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    transliteration: "Hasbunallahu wa ni'ma l-wakil",
    translationDe: 'Allah genügt uns, und Er ist der beste Sachwalter.',
    source: 'Sure Al-Imran, 3:173',
  },
  {
    id: 'dua-yunus',
    categoryId: 'schutz',
    title: 'Dua des Propheten Yunus',
    arabic: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu mina z-zalimin',
    translationDe: 'Es gibt keinen Gott außer Dir, gepriesen bist Du. Wahrlich, ich gehörte zu den Ungerechten.',
    source: 'Sure Al-Anbiya, 21:87',
  },
  {
    id: 'schlafengehen',
    categoryId: 'schutz',
    title: 'Beim Schlafengehen',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    transliteration: 'Bismika Allahumma amutu wa ahya',
    translationDe: 'In Deinem Namen, o Allah, sterbe ich und lebe ich.',
    source: 'Sahih al-Bukhari',
  },
  {
    id: 'vor-dem-essen',
    categoryId: 'essen',
    title: 'Vor dem Essen',
    arabic: 'بِسْمِ اللَّهِ',
    transliteration: 'Bismillah',
    translationDe: 'Im Namen Allahs.',
    source: 'Sahih al-Bukhari',
  },
  {
    id: 'basmala-vergessen',
    categoryId: 'essen',
    title: 'Bei vergessener Basmala',
    arabic: 'بِسْمِ اللَّهِ فِي أَوَّلِهِ وَآخِرِهِ',
    transliteration: 'Bismillahi fi awwalihi wa akhirih',
    translationDe: 'Im Namen Allahs, am Anfang und am Ende.',
    source: 'Sunan Abi Dawud',
  },
  {
    id: 'nach-dem-essen',
    categoryId: 'essen',
    title: 'Nach dem Essen',
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَٰذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ',
    transliteration: "Al-hamdu lillahi lladhi at'amani hadha wa razaqanihi min ghairi haulin minni wa la quwwa",
    translationDe: 'Alles Lob gebührt Allah, der mich dies hat essen lassen und es mir gewährt hat, ohne meine Macht oder Kraft.',
    source: 'Sunan at-Tirmidhi',
  },
  {
    id: 'reisedua',
    categoryId: 'reisen',
    title: 'Beim Antritt einer Reise',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
    transliteration: "Subhana lladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila rabbina lamunqalibun",
    translationDe: 'Gepriesen ist Der, der uns dies dienstbar gemacht hat, während wir es aus eigener Kraft nicht hätten bewältigen können. Und wahrlich, zu unserem Herrn werden wir zurückkehren.',
    source: 'Sure Az-Zukhruf, 43:13-14',
  },
  {
    id: 'neuer-ort',
    categoryId: 'reisen',
    title: 'An einem neuen Ort',
    arabic: 'اللَّهُمَّ بَارِكْ لَنَا فِيمَا رَزَقْتَنَا',
    transliteration: 'Allahumma barik lana fima razaqtana',
    translationDe: 'O Allah, segne uns in dem, was Du uns gewährt hast.',
    source: 'Sunan Ibn Majah',
  },
  {
    id: 'fuer-eltern',
    categoryId: 'familie',
    title: 'Für die Eltern',
    arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbi rhamhuma kama rabbayani saghira',
    translationDe: 'Mein Herr, erbarme Dich ihrer beider, so wie sie mich als Kind aufgezogen haben.',
    source: 'Sure Al-Isra, 17:24',
  },
  {
    id: 'fuer-nachkommen',
    categoryId: 'familie',
    title: 'Für Ehepartner und Nachkommen',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna li-l-muttaqina imama",
    translationDe: 'Unser Herr, schenke uns an unseren Ehepartnern und Nachkommen Freude der Augen, und mache uns zu Vorbildern für die Gottesfürchtigen.',
    source: 'Sure Al-Furqan, 25:74',
  },
];

export function getDuasByCategory(categoryId: string): Dua[] {
  return DUAS.filter((d) => d.categoryId === categoryId);
}

export function getDuaById(id: string): Dua | undefined {
  return DUAS.find((d) => d.id === id);
}

export function getCategoryById(id: string): DuaCategory | undefined {
  return DUA_CATEGORIES.find((c) => c.id === id);
}
