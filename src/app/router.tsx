import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { LoginPage } from '@pages/login';

// Все приватные страницы — code-split через React.lazy. Fallback задан в AppLayout (Suspense).
const CorePage = lazy(async () => {
  const m = await import('@pages/core');
  return { default: m.CorePage };
});
const ServersPage = lazy(async () => {
  const m = await import('@pages/servers');
  return { default: m.ServersPage };
});
const ContainersPage = lazy(async () => {
  const m = await import('@pages/containers');
  return { default: m.ContainersPage };
});
const ClientsPage = lazy(async () => {
  const m = await import('@pages/clients');
  return { default: m.ClientsPage };
});
const NotFoundPage = lazy(async () => {
  const m = await import('@pages/not-found');
  return { default: m.NotFoundPage };
});

export function AppRoutes() {
  return (
    <Routes>
      {/* public */}
      <Route path="/login" element={<LoginPage />} />

      {/* private — guard в AppLayout */}
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/core" replace />} />
        <Route path="/core" element={<CorePage />} />
        <Route path="/servers" element={<ServersPage />} />
        <Route path="/containers" element={<ContainersPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
