import { Outlet, useLocation } from 'react-router-dom';
import { TabBar } from './TabBar';

const HIDE_TABBAR_PATTERNS = [/^\/quran\/[^/]+$/];

export function MainLayout() {
  const location = useLocation();
  const hideTabBar = HIDE_TABBAR_PATTERNS.some((re) => re.test(location.pathname));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex min-h-0 flex-1 flex-col">
        <Outlet />
      </div>
      {!hideTabBar && <TabBar />}
    </div>
  );
}
