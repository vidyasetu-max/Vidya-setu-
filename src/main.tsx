import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const App = lazy(() => import('./App.tsx'));
const AdminRootApp = lazy(() =>
  import('./AdminRootApp.tsx').then((m) => ({ default: m.AdminRootApp }))
);
const PartnerRootApp = lazy(() =>
  import('./PartnerRootApp.tsx').then((m) => ({ default: m.PartnerRootApp }))
);

const isStandaloneAdminRoute =
  window.location.pathname === '/admin' ||
  window.location.pathname === '/admin.html' ||
  window.location.search.includes('admin=1') ||
  window.location.hash === '#admin';

const isStandalonePartnerRoute =
  window.location.pathname === '/partner' ||
  window.location.pathname === '/partner.html' ||
  window.location.search.includes('partner=1') ||
  window.location.hash === '#partner';

const RootFallback = () => (
  <div
    className={`min-h-screen flex flex-col items-center justify-center gap-3 ${
      isStandaloneAdminRoute || isStandalonePartnerRoute
        ? 'bg-slate-950 text-white'
        : 'bg-white text-slate-900'
    }`}
  >
    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center animate-pulse">
      VS
    </div>
    <p className="text-xs font-semibold opacity-75">
      {isStandaloneAdminRoute
        ? 'Starting Vidya Setu Admin...'
        : isStandalonePartnerRoute
        ? 'Starting Vidya Setu Partner Studio...'
        : 'Loading Vidya Setu...'}
    </p>
  </div>
);

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<RootFallback />}>
    {isStandaloneAdminRoute ? (
      <AdminRootApp />
    ) : isStandalonePartnerRoute ? (
      <PartnerRootApp />
    ) : (
      <App />
    )}
  </Suspense>
);
