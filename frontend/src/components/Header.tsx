import { Link, NavLink } from 'react-router-dom';

import { BrandMark } from './BrandMark';

export function Header() {
  return (
    <header className="app-header">
      <div className="brand-block">
        <p className="brand-kicker">Portfolio build</p>
        <Link className="brand-link" to="/">
          <BrandMark />
          <span className="brand-text">NoteFlow</span>
        </Link>
        <p className="header-copy">
          Um CRUD de notas com cara de produto: React + TypeScript no cliente, Go + PostgreSQL na
          API.
        </p>
      </div>
      <nav className="header-nav" aria-label="Primary navigation">
        <NavLink className="nav-link" to="/">
          Dashboard
        </NavLink>
        <NavLink className="button button-primary" to="/notes/new">
          Nova nota
        </NavLink>
      </nav>
    </header>
  );
}
