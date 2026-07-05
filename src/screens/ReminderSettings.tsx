import { useState } from 'react';
import { Sunrise, CloudSun, MoonStar, BookOpen, Quote, HandHeart } from 'lucide-react';
import { NavBar } from '../components/layout/NavBar';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { Card } from '../components/ui/Card';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { ToggleRow } from '../components/ui/ToggleRow';
import { useAppState } from '../state/AppStateContext';

type Frequency = 'taeglich' | 'mehrmals' | 'aus';

export function ReminderSettings() {
  const { reminderSettings, updateReminderSettings } = useAppState();
  const [frequency, setFrequency] = useState<Frequency>('taeglich');

  return (
    <div className="flex h-full flex-col">
      <NavBar showBack title="Reminder-Einstellungen" />
      <ScreenScroll className="px-5 pb-10 pt-2">
        <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-wide text-ink-400">Häufigkeit</p>
        <div className="mb-6">
          <SegmentedControl<Frequency>
            value={frequency}
            onChange={setFrequency}
            options={[
              { value: 'taeglich', label: 'Täglich' },
              { value: 'mehrmals', label: 'Mehrmals' },
              { value: 'aus', label: 'Aus' },
            ]}
          />
        </div>

        <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-wide text-ink-400">Tageszeiten</p>
        <Card className="mb-6 px-4">
          <ToggleRow
            icon={<Sunrise size={16} strokeWidth={2} />}
            title="Morgen"
            subtitle="ca. 6:00 – 9:00 Uhr"
            checked={reminderSettings.morgen}
            onChange={(v) => updateReminderSettings({ morgen: v })}
          />
          <ToggleRow
            icon={<CloudSun size={16} strokeWidth={2} />}
            title="Nachmittag"
            subtitle="ca. 13:00 – 16:00 Uhr"
            checked={reminderSettings.nachmittag}
            onChange={(v) => updateReminderSettings({ nachmittag: v })}
          />
          <ToggleRow
            icon={<MoonStar size={16} strokeWidth={2} />}
            title="Abend"
            subtitle="ca. 19:00 – 22:00 Uhr"
            checked={reminderSettings.abend}
            onChange={(v) => updateReminderSettings({ abend: v })}
            last
          />
        </Card>

        <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-wide text-ink-400">Inhaltstypen</p>
        <Card className="px-4">
          <ToggleRow
            icon={<BookOpen size={16} strokeWidth={2} />}
            title="Verse"
            subtitle="Auszüge aus dem Qur’an"
            checked={reminderSettings.typVers}
            onChange={(v) => updateReminderSettings({ typVers: v })}
          />
          <ToggleRow
            icon={<Quote size={16} strokeWidth={2} />}
            title="Hadithe"
            subtitle="Überlieferungen des Propheten"
            checked={reminderSettings.typHadith}
            onChange={(v) => updateReminderSettings({ typHadith: v })}
          />
          <ToggleRow
            icon={<HandHeart size={16} strokeWidth={2} />}
            title="Duas"
            subtitle="Kurze Bittgebete"
            checked={reminderSettings.typDua}
            onChange={(v) => updateReminderSettings({ typDua: v })}
            last
          />
        </Card>
      </ScreenScroll>
    </div>
  );
}
