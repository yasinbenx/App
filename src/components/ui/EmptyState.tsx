import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-dome-50 text-dome-500">{icon}</div>
      <p className="font-display text-[17px] font-semibold text-ink-900">{title}</p>
      <p className="text-[13.5px] leading-relaxed text-ink-400">{description}</p>
    </div>
  );
}
