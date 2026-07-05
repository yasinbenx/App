import type { Ayah, Surah } from './types';
import { SURAH_META } from './surahMeta';

const DEMO_AYAHS: Record<number, Ayah[]> = {
  1: [
    { number: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', transliteration: 'Bismillahi r-rahmani r-rahim', translationDe: 'Im Namen Allahs, des Allerbarmers, des Barmherzigen.' },
    { number: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', transliteration: 'Al-hamdu lillahi rabbi l-alamin', translationDe: 'Alles Lob gebührt Allah, dem Herrn der Welten,' },
    { number: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', transliteration: 'Ar-rahmani r-rahim', translationDe: 'dem Allerbarmer, dem Barmherzigen,' },
    { number: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', transliteration: 'Maliki yaumi d-din', translationDe: 'dem Herrscher am Tag des Gerichts.' },
    { number: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', transliteration: "Iyyaka na'budu wa iyyaka nasta'in", translationDe: 'Dir allein dienen wir, und Dich allein bitten wir um Hilfe.' },
    { number: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', transliteration: 'Ihdina s-sirata l-mustaqim', translationDe: 'Leite uns den geraden Weg,' },
    { number: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', transliteration: "Sirata lladhina an'amta 'alaihim ghairi l-maghdubi 'alaihim wa la d-dallin", translationDe: 'den Weg derer, denen Du Gnade erwiesen hast, nicht derer, die dem Zorn verfallen sind, und nicht der Irregehenden.' },
  ],
  2: [
    { number: 1, arabic: 'الم', transliteration: 'Alif-Lam-Mim', translationDe: 'Alif-Lam-Mim.' },
    { number: 2, arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِلْمُتَّقِينَ', transliteration: 'Dhalika l-kitabu la raiba fih, hudan li-l-muttaqin', translationDe: 'Dies ist das Buch, an dem kein Zweifel ist, eine Rechtleitung für die Gottesfürchtigen,' },
    { number: 3, arabic: 'الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنْفِقُونَ', transliteration: "Alladhina yu'minuna bi-l-ghaibi wa yuqimuna s-salata wa mimma razaqnahum yunfiqun", translationDe: 'die an das Verborgene glauben, das Gebet verrichten und von dem spenden, was Wir ihnen gegeben haben,' },
    { number: 4, arabic: 'وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنْزِلَ إِلَيْكَ وَمَا أُنْزِلَ مِنْ قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ', transliteration: "Wa lladhina yu'minuna bima unzila ilaika wa ma unzila min qablika wa bi-l-akhirati hum yuqinun", translationDe: 'und die an das glauben, was zu dir herabgesandt wurde und was vor dir herabgesandt wurde, und die fest von dem Jenseits überzeugt sind.' },
    { number: 5, arabic: 'أُولَٰئِكَ عَلَىٰ هُدًى مِنْ رَبِّهِمْ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ', transliteration: "Ula'ika 'ala hudan min rabbihim wa ula'ika humu l-muflihun", translationDe: 'Diese folgen einer Rechtleitung von ihrem Herrn, und diese sind die Erfolgreichen.' },
  ],
  36: [
    { number: 1, arabic: 'يس', transliteration: 'Ya-Sin', translationDe: 'Ya-Sin.' },
    { number: 2, arabic: 'وَالْقُرْآنِ الْحَكِيمِ', transliteration: "Wa l-qur'ani l-hakim", translationDe: 'Beim weisen Qur’an!' },
    { number: 3, arabic: 'إِنَّكَ لَمِنَ الْمُرْسَلِينَ', transliteration: 'Innaka lamina l-mursalin', translationDe: 'Du bist wahrlich einer der Gesandten' },
    { number: 4, arabic: 'عَلَىٰ صِرَاطٍ مُسْتَقِيمٍ', transliteration: "'Ala siratin mustaqim", translationDe: 'auf einem geraden Weg,' },
    { number: 5, arabic: 'تَنْزِيلَ الْعَزِيزِ الرَّحِيمِ', transliteration: "Tanzila l-'azizi r-rahim", translationDe: 'eine Offenbarung des Allmächtigen, des Barmherzigen,' },
  ],
  55: [
    { number: 1, arabic: 'الرَّحْمَٰنُ', transliteration: 'Ar-Rahman', translationDe: 'Der Allerbarmer' },
    { number: 2, arabic: 'عَلَّمَ الْقُرْآنَ', transliteration: "'Allama l-qur'an", translationDe: 'lehrte den Qur’an,' },
    { number: 3, arabic: 'خَلَقَ الْإِنْسَانَ', transliteration: 'Khalaqa l-insan', translationDe: 'erschuf den Menschen,' },
    { number: 4, arabic: 'عَلَّمَهُ الْبَيَانَ', transliteration: 'Allamahu l-bayan', translationDe: 'lehrte ihn die klare Darlegung.' },
  ],
  67: [
    { number: 1, arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', transliteration: "Tabaraka lladhi bi-yadihi l-mulku wa huwa 'ala kulli shai'in qadir", translationDe: 'Segensreich ist Er, in dessen Hand die Herrschaft ist, und Er hat Macht über alle Dinge,' },
    { number: 2, arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا وَهُوَ الْعَزِيزُ الْغَفُورُ', transliteration: "Alladhi khalaqa l-mauta wa l-hayata li-yabluwakum ayyukum ahsanu 'amala, wa huwa l-'azizu l-ghafur", translationDe: 'der den Tod und das Leben erschaffen hat, um euch zu prüfen, wer von euch die besten Taten vollbringt; und Er ist der Allmächtige, der Allvergebende,' },
    { number: 3, arabic: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا مَا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِنْ تَفَاوُتٍ', transliteration: "Alladhi khalaqa sab'a samawatin tibaqa, ma tara fi khalqi r-rahmani min tafawut", translationDe: 'der sieben Himmel übereinander erschaffen hat. Du siehst in der Schöpfung des Allerbarmers keinen Mangel.' },
    { number: 4, arabic: 'فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِنْ فُطُورٍ', transliteration: "Farji'i l-basara hal tara min futur", translationDe: 'So wende den Blick zurück: Siehst du irgendeinen Riss?' },
    { number: 5, arabic: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنْقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ', transliteration: "Thumma rji'i l-basara karratayni yanqalib ilaika l-basaru khasi'an wa huwa hasir", translationDe: 'Dann wende den Blick abermals und abermals zurück: Der Blick kehrt zu dir zurück, ermattet und geschwächt.' },
  ],
  103: [
    { number: 1, arabic: 'وَالْعَصْرِ', transliteration: "Wa l-'asr", translationDe: 'Bei der Zeit!' },
    { number: 2, arabic: 'إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ', transliteration: 'Inna l-insana lafi khusr', translationDe: 'Wahrlich, der Mensch ist im Verlust,' },
    { number: 3, arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', transliteration: "Illa lladhina amanu wa 'amilu s-salihati wa tawasau bi-l-haqqi wa tawasau bi-s-sabr", translationDe: 'außer denjenigen, die glauben und rechtschaffen handeln und einander zur Wahrheit und zur Geduld ermahnen.' },
  ],
  106: [
    { number: 1, arabic: 'لِإِيلَافِ قُرَيْشٍ', transliteration: 'Li-ilafi Quraisch', translationDe: 'Zur Gewöhnung der Quraisch,' },
    { number: 2, arabic: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ', transliteration: 'Ilafihim rihlata sch-schita’i wa s-saif', translationDe: 'ihrer Gewöhnung an die Reise im Winter und im Sommer,' },
    { number: 3, arabic: 'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ', transliteration: "Fal-ya'budu rabba hadha l-bait", translationDe: 'so sollen sie dem Herrn dieses Hauses dienen,' },
    { number: 4, arabic: 'الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ وَآمَنَهُمْ مِنْ خَوْفٍ', transliteration: "Alladhi at'amahum min ju'in wa amanahum min khauf", translationDe: 'der sie vor Hunger gespeist und vor Furcht sicher gemacht hat.' },
  ],
  108: [
    { number: 1, arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', transliteration: "Inna a'tainaka l-kawthar", translationDe: 'Wahrlich, Wir haben dir die Fülle gegeben.' },
    { number: 2, arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', transliteration: 'Fa-salli li-rabbika wa-nhar', translationDe: 'So verrichte das Gebet für deinen Herrn und opfere.' },
    { number: 3, arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', transliteration: "Inna shani'aka huwa l-abtar", translationDe: 'Wahrlich, dein Verhasser ist der Abgeschnittene.' },
  ],
  110: [
    { number: 1, arabic: 'إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ', transliteration: "Idha ja'a nasru llahi wa l-fath", translationDe: 'Wenn Allahs Hilfe und der Sieg kommen,' },
    { number: 2, arabic: 'وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا', transliteration: 'Wa ra’aita n-nasa yadkhuluna fi dini llahi afwaja', translationDe: 'und du die Menschen scharenweise in Allahs Religion eintreten siehst,' },
    { number: 3, arabic: 'فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا', transliteration: "Fa-sabbih bi-hamdi rabbika wa-staghfirh, innahu kana tawwaba", translationDe: 'dann preise deinen Herrn und bitte Ihn um Vergebung; Er ist stets bereit, sich in Gnade zuzuwenden.' },
  ],
  112: [
    { number: 1, arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', transliteration: 'Qul huwa llahu ahad', translationDe: 'Sag: Er ist Allah, ein Einziger,' },
    { number: 2, arabic: 'اللَّهُ الصَّمَدُ', transliteration: 'Allahu s-samad', translationDe: 'Allah, der Absolute, von dem alles abhängt.' },
    { number: 3, arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', transliteration: 'Lam yalid wa lam yulad', translationDe: 'Er hat nicht gezeugt und ist nicht gezeugt worden,' },
    { number: 4, arabic: 'وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ', transliteration: 'Wa lam yakun lahu kufuwan ahad', translationDe: 'und keiner ist Ihm ebenbürtig.' },
  ],
  113: [
    { number: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', transliteration: "Qul a'udhu bi-rabbi l-falaq", translationDe: 'Sag: Ich suche Zuflucht beim Herrn der Morgendämmerung,' },
    { number: 2, arabic: 'مِنْ شَرِّ مَا خَلَقَ', transliteration: 'Min sharri ma khalaq', translationDe: 'vor dem Übel dessen, was Er erschaffen hat,' },
    { number: 3, arabic: 'وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ', transliteration: 'Wa min sharri ghasiqin idha waqab', translationDe: 'und vor dem Übel der Dunkelheit, wenn sie sich ausbreitet,' },
    { number: 4, arabic: 'وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', transliteration: "Wa min sharri n-naffathati fi l-'uqad", translationDe: 'und vor dem Übel derer, die in die Knoten blasen,' },
    { number: 5, arabic: 'وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ', transliteration: 'Wa min sharri hasidin idha hasad', translationDe: 'und vor dem Übel des Neiders, wenn er neidet.' },
  ],
  114: [
    { number: 1, arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', transliteration: "Qul a'udhu bi-rabbi n-nas", translationDe: 'Sag: Ich suche Zuflucht beim Herrn der Menschen,' },
    { number: 2, arabic: 'مَلِكِ النَّاسِ', transliteration: 'Maliki n-nas', translationDe: 'dem König der Menschen,' },
    { number: 3, arabic: 'إِلَٰهِ النَّاسِ', transliteration: 'Ilahi n-nas', translationDe: 'dem Gott der Menschen,' },
    { number: 4, arabic: 'مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', transliteration: 'Min sharri l-waswasi l-khannas', translationDe: 'vor dem Übel des Einflüsterers, der sich zurückzieht,' },
    { number: 5, arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', transliteration: 'Alladhi yuwaswisu fi suduri n-nas', translationDe: 'der in die Brust der Menschen einflüstert,' },
    { number: 6, arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', transliteration: 'Mina l-jinnati wa n-nas', translationDe: 'von den Djinn und den Menschen.' },
  ],
};

export const SURAHS: Surah[] = SURAH_META.map(
  ([id, nameArabic, nameTransliteration, nameGerman, revelationPlace, ayahCount]) => ({
    id,
    nameArabic,
    nameTransliteration,
    nameGerman,
    revelationPlace,
    ayahCount,
    ayahs: DEMO_AYAHS[id],
  }),
);

export function getSurahById(id: number): Surah | undefined {
  return SURAHS.find((s) => s.id === id);
}
