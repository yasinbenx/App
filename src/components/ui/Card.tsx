import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface CardBaseProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className, ...rest }: CardBaseProps & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-[22px] border border-gold-300/25 bg-marble-100 shadow-[var(--shadow-card)]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardButton({
  children,
  className,
  ...rest
}: CardBaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={clsx(
        'tap-highlight-none w-full rounded-[22px] border border-gold-300/25 bg-marble-100 text-left shadow-[var(--shadow-card)] transition-transform active:scale-[0.98]',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
