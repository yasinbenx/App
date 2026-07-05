import { Signal, Wifi, BatteryFull } from 'lucide-react';

export function StatusBar() {
  return (
    <div className="hidden sm:flex items-center justify-between px-8 pt-3.5 pb-1 text-[13px] font-semibold text-ink-900 select-none shrink-0">
      <span className="tabular-nums tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <Signal size={14} strokeWidth={2.4} />
        <Wifi size={14} strokeWidth={2.4} />
        <BatteryFull size={18} strokeWidth={2} />
      </div>
    </div>
  );
}
