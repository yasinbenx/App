import { useNavigate } from 'react-router-dom';
import { Globe, Palette, BellRing, Type, Info, ShieldCheck, FileText } from 'lucide-react';
import { ScreenScroll } from '../components/layout/ScreenScroll';
import { Card } from '../components/ui/Card';
import { ListRow } from '../components/ui/ListRow';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { useAppState } from '../state/AppStateContext';
import type { ReadingFontSize } from '../state/AppStateContext';

export function Settings() {
  const navigate = useNavigate();
  const { readingPrefs, updateReadingPrefs } = useAppState();

  return (
    <ScreenScroll className="px-5 pb-10 pt-4">
      <h1 className="font-display mb-5 text-[30px] font-semibold tracking-tight text-ink-900">Einstellungen</h1>

      <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-wide text-ink-400">Allgemein</p>
      <Card className="mb-6 px-4">
        <ListRow icon={<Globe size={16} strokeWidth={2} />} title="Sprache" value="Deutsch" />
        <ListRow icon={<Palette size={16} strokeWidth={2} />} title="Erscheinungsbild" value="Hell" last />
      </Card>

      <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-wide text-ink-400">Lesen</p>
      <Card className="mb-6 px-4 py-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dome-50 text-dome-600">
            <Type size={16} strokeWidth={2} />
          </div>
          <span className="text-[14.5px] font-medium text-ink-900">Standard-Schriftgröße</span>
        </div>
        <SegmentedControl<ReadingFontSize>
          value={readingPrefs.fontSize}
          onChange={(fontSize) => updateReadingPrefs({ fontSize })}
          options={[
            { value: 'klein', label: 'Klein' },
            { value: 'mittel', label: 'Mittel' },
            { value: 'gross', label: 'Groß' },
          ]}
        />
      </Card>

      <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-wide text-ink-400">Benachrichtigungen</p>
      <Card className="mb-6 px-4">
        <ListRow
          icon={<BellRing size={16} strokeWidth={2} />}
          title="Reminder-Einstellungen"
          onClick={() => navigate('/reminder/einstellungen')}
          last
        />
      </Card>

      <p className="mb-2 text-[12.5px] font-semibold uppercase tracking-wide text-ink-400">Über die App</p>
      <Card className="px-4">
        <ListRow icon={<Info size={16} strokeWidth={2} />} title="Version" value="1.0.0 (MVP)" />
        <ListRow icon={<FileText size={16} strokeWidth={2} />} title="Impressum" onClick={() => {}} />
        <ListRow icon={<ShieldCheck size={16} strokeWidth={2} />} title="Datenschutz" onClick={() => {}} last />
      </Card>
    </ScreenScroll>
  );
}
