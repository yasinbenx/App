import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  active?: boolean;
}

export function IconButton({ children, active, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'tap-highlight-none flex h-10 w-10 items-center justify-center rounded-full transition-colors active:scale-95',
        active ? 'bg-dome-500 text-marble-50' : 'bg-marble-100 text-ink-700 border border-gold-300/25',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
