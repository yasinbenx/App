import clsx from 'clsx';

interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ options, value, onChange }: SegmentedControlProps<T>) {
  return (
    <div className="flex rounded-full bg-sand-200/70 p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={clsx(
            'tap-highlight-none flex-1 rounded-full px-3 py-2 text-[13px] font-semibold transition-all',
            value === opt.value ? 'bg-marble-100 text-dome-600 shadow-[var(--shadow-card)]' : 'text-ink-500',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
