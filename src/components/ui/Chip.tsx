import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  children: ReactNode;
}

export function Chip({ active, children, className, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      className={clsx(
        'tap-highlight-none whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors active:scale-95',
        active ? 'bg-dome-500 text-marble-50' : 'bg-marble-100 text-ink-700 border border-gold-300/25',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
