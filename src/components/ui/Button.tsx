import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  icon?: ReactNode;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'tap-highlight-none inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all active:scale-[0.97]',
        size === 'lg' ? 'h-[52px] px-6 text-[15.5px]' : 'h-11 px-5 text-[14px]',
        variant === 'primary' && 'bg-dome-500 text-marble-50 shadow-[0_8px_20px_-8px_rgba(63,92,68,0.55)] hover:bg-dome-600',
        variant === 'secondary' && 'bg-dome-50 text-dome-600 border border-dome-100',
        variant === 'ghost' && 'text-dome-600',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
