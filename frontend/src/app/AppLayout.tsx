import { Outlet } from 'react-router-dom';

import { Header } from '../components/Header';

export function AppLayout() {
  return (
    <div className="app-shell">
      <div className="app-backdrop" aria-hidden="true">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="grid-glow" />
      </div>
      <div className="app-frame">
        <Header />
        <main className="app-main">
          <Outlet />
        </main>
        <footer className="app-footer">
          <p>React + TypeScript no cliente. Go + PostgreSQL na API.</p>
          <p>Notas simples, busca rápida e fluxo completo de CRUD.</p>
        </footer>
      </div>
    </div>
  );
}
