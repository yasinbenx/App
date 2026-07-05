import type { ReactNode } from 'react';

export function SectionHeader({
  title,
  action,
  className,
}: {
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-3 flex items-end justify-between ${className ?? ''}`}>
      <h2 className="font-display text-[19px] font-semibold tracking-tight text-ink-900">{title}</h2>
      {action}
    </div>
  );
}
