import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Hand, Bookmark, Settings } from 'lucide-react';
import clsx from 'clsx';

const TABS = [
  { to: '/home', label: 'Start', icon: Home },
  { to: '/quran', label: 'Quran', icon: BookOpen },
  { to: '/duas', label: 'Duas', icon: Hand },
  { to: '/gespeichert', label: 'Gespeichert', icon: Bookmark },
  { to: '/einstellungen', label: 'Mehr', icon: Settings },
];

export function TabBar() {
  return (
    <nav className="shrink-0 border-t border-dome-100/60 bg-marble-100/85 backdrop-blur-xl px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)] sm:pb-3">
      <ul className="flex items-stretch justify-between">
        {TABS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                clsx(
                  'flex flex-col items-center gap-1 rounded-2xl py-1.5 transition-colors tap-highlight-none',
                  isActive ? 'text-dome-600' : 'text-ink-400',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={22} strokeWidth={isActive ? 2.3 : 1.8} />
                  <span className={clsx('text-[10.5px] leading-none', isActive ? 'font-semibold' : 'font-medium')}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
