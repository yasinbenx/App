import { useNavigate } from 'react-router-dom';
import { BookOpen, BookMarked, Hand, BellRing, ChevronRight } from 'lucide-react';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { CardButton } from '../components/ui/Card';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ReminderCard } from '../components/reminder/ReminderCard';
import { useAppState } from '../state/AppStateContext';
import { getSurahById } from '../data/surahs';
import { FEATURED_REMINDER } from '../data/reminders';

export function Home() {
  const navigate = useNavigate();
  const { lastRead } = useAppState();
  const lastSurah = lastRead ? getSurahById(lastRead.surahId) : undefined;

  const quickAccess = [
    {
      icon: BookOpen,
      title: 'Qur’an lesen',
      subtitle: 'Alle 114 Suren',
      onClick: () => navigate('/quran'),
    },
    {
      icon: BookMarked,
      title: 'Letzte Stelle',
      subtitle: lastSurah ? `${lastSurah.nameGerman} · Vers ${lastRead?.ayahNumber}` : 'Noch nichts gelesen',
      onClick: () => (lastSurah ? navigate(`/quran/${lastSurah.id}`) : navigate('/quran')),
    },
    {
      icon: Hand,
      title: 'Duas',
      subtitle: 'Bittgebete entdecken',
      onClick: () => navigate('/duas'),
    },
    {
      icon: BellRing,
      title: 'Tages-Reminder',
      subtitle: 'Verse & Hadithe',
      onClick: () => navigate('/reminder'),
    },
  ];

  return (
    <ScreenScroll className="px-5 pb-10 pt-4">
      <div className="mb-7 flex items-center justify-between">
        <h1 className="font-display text-[22px] font-semibold tracking-tight text-ink-900">Start</h1>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-dome-500 font-display text-[16px] font-semibold text-marble-50 shadow-[0_8px_20px_-10px_rgba(63,92,68,0.6)]">
          A
        </div>
      </div>

      <SectionHeader title="Schnellzugriff" className="mb-3" />
      <div className="mb-7 grid grid-cols-2 gap-3">
        {quickAccess.map((item) => (
          <CardButton key={item.title} onClick={item.onClick} className="flex flex-col gap-3 px-4 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-dome-50 text-dome-600">
              <item.icon size={17} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[13.5px] font-semibold text-ink-900">{item.title}</p>
              <p className="truncate text-[11.5px] text-ink-400">{item.subtitle}</p>
            </div>
          </CardButton>
        ))}
      </div>

      <SectionHeader
        title="Erinnerung des Tages"
        action={
          <button
            type="button"
            onClick={() => navigate('/reminder')}
            className="tap-highlight-none flex items-center gap-0.5 text-[12.5px] font-medium text-dome-600"
          >
            Alle <ChevronRight size={14} strokeWidth={2.2} />
          </button>
        }
      />
      <ReminderCard reminder={FEATURED_REMINDER} featured />
    </ScreenScroll>
  );
}
