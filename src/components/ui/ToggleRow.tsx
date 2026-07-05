import type { ReactNode } from 'react';
import clsx from 'clsx';

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        'tap-highlight-none relative h-7 w-12 shrink-0 rounded-full transition-colors',
        checked ? 'bg-dome-500' : 'bg-sand-300',
      )}
    >
      <span
        className={clsx(
          'absolute top-0.5 h-6 w-6 rounded-full bg-marble-50 shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

export function ToggleRow({
  icon,
  title,
  subtitle,
  checked,
  onChange,
  last,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <div className={clsx('flex items-center gap-3 py-3.5', !last && 'border-b border-sand-200/80')}>
      {icon && <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dome-50 text-dome-600">{icon}</div>}
      <div className="min-w-0 flex-1">
        <p className="text-[14.5px] font-medium text-ink-900">{title}</p>
        {subtitle && <p className="text-[12.5px] text-ink-400">{subtitle}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
