import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppStateProvider } from './state/AppStateContext';
import { AudioPlayerProvider } from './state/AudioPlayerContext';
import { ReadingModeProvider } from './state/ReadingModeContext';
import { RootShell } from './components/layout/RootShell';
import { MainLayout } from './components/layout/MainLayout';
import { Splash } from './screens/Splash';
import { Onboarding } from './screens/Onboarding';
import { Home } from './screens/Home';
import { Quran } from './screens/Quran';
import { SurahDetail } from './screens/SurahDetail';
import { Duas } from './screens/Duas';
import { DuaCategory } from './screens/DuaCategory';
import { DuaDetail } from './screens/DuaDetail';
import { Reminder } from './screens/Reminder';
import { ReminderSettings } from './screens/ReminderSettings';
import { Saved } from './screens/Saved';
import { Settings } from './screens/Settings';

export default function App() {
  return (
    <AppStateProvider>
      <AudioPlayerProvider>
        <ReadingModeProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<RootShell />}>
                <Route path="/" element={<Splash />} />
                <Route path="/onboarding" element={<Onboarding />} />

                <Route element={<MainLayout />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/quran" element={<Quran />} />
                  <Route path="/quran/:surahId" element={<SurahDetail />} />
                  <Route path="/duas" element={<Duas />} />
                  <Route path="/duas/:categoryId" element={<DuaCategory />} />
                  <Route path="/duas/:categoryId/:duaId" element={<DuaDetail />} />
                  <Route path="/reminder" element={<Reminder />} />
                  <Route path="/reminder/einstellungen" element={<ReminderSettings />} />
                  <Route path="/gespeichert" element={<Saved />} />
                  <Route path="/einstellungen" element={<Settings />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ReadingModeProvider>
      </AudioPlayerProvider>
    </AppStateProvider>
  );
}
