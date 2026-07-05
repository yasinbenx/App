import { Outlet } from 'react-router-dom';
import { StatusBar } from './StatusBar';

export function RootShell() {
  return (
    <div className="phone-backdrop">
      <div className="phone-frame">
        <div className="phone-island" />
        <div className="phone-screen">
          <StatusBar />
          <div className="flex min-h-0 flex-1 flex-col">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
