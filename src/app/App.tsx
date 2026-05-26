import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from '@pages/home';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
