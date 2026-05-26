import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/components/layout/RootLayout';
import { HomePage } from '@/pages/HomePage';
import { PrivacyPage } from '@/pages/PrivacyPage';
import { ThanksPage } from '@/pages/ThanksPage';

export function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/thanks" element={<ThanksPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
