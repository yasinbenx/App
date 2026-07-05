import type { ReactNode } from 'react';
import clsx from 'clsx';

export function ScreenScroll({
  children,
  className,
  noPadding,
}: {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <div
      className={clsx(
        'no-scrollbar min-h-0 flex-1 overflow-y-auto',
        !noPadding && 'px-5 pb-8 pt-1',
        className,
      )}
    >
      {children}
    </div>
  );
}
