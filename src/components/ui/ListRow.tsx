import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export function ListRow({
  icon,
  title,
  value,
  onClick,
  last,
}: {
  icon?: ReactNode;
  title: string;
  value?: string;
  onClick?: () => void;
  last?: boolean;
}) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={clsx(
        'tap-highlight-none flex w-full items-center gap-3 py-3.5 text-left',
        !last && 'border-b border-sand-200/80',
        onClick && 'active:opacity-60',
      )}
    >
      {icon && <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-dome-50 text-dome-600">{icon}</div>}
      <span className="min-w-0 flex-1 truncate text-[14.5px] font-medium text-ink-900">{title}</span>
      {value && <span className="shrink-0 truncate text-[13.5px] text-ink-400">{value}</span>}
      {onClick && <ChevronRight size={16} strokeWidth={2.2} className="text-ink-300" />}
    </Comp>
  );
}
