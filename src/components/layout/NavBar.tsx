import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import clsx from 'clsx';

interface NavBarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  transparent?: boolean;
}

export function NavBar({ title, showBack, onBack, right, transparent }: NavBarProps) {
  const navigate = useNavigate();

  return (
    <header
      className={clsx(
        'z-30 flex h-12 shrink-0 items-center justify-between gap-2 px-3',
        !transparent && 'bg-sand-100/90 backdrop-blur-xl',
      )}
    >
      <div className="flex w-20 items-center">
        {showBack && (
          <button
            type="button"
            onClick={() => (onBack ? onBack() : navigate(-1))}
            className="tap-highlight-none -ml-1 flex items-center gap-0.5 rounded-full py-1.5 pl-1 pr-2.5 text-dome-600 active:bg-dome-50"
            aria-label="Zurück"
          >
            <ChevronLeft size={22} strokeWidth={2.2} />
          </button>
        )}
      </div>
      {title && (
        <h1 className="flex-1 truncate text-center text-[15px] font-semibold text-ink-900">{title}</h1>
      )}
      <div className="flex w-20 items-center justify-end">{right}</div>
    </header>
  );
}
