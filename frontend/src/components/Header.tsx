import { Link, NavLink } from 'react-router-dom';

import { BrandMark } from './BrandMark';

export function Header() {
  return (
    <header className="app-header">
      <div className="brand-block">
        <p className="brand-kicker">Personal workspace</p>
        <Link className="brand-link" to="/">
          <BrandMark />
          <span className="brand-text">NoteFlow</span>
        </Link>
        <p className="header-copy">
          Capture ideas, keep context close, and move through your notes with a fast full-stack
          workflow.
        </p>
      </div>
      <nav className="header-nav" aria-label="Primary navigation">
        <NavLink className="nav-link" to="/">
          Dashboard
        </NavLink>
        <NavLink className="button button-primary" to="/notes/new">
          New note
        </NavLink>
      </nav>
    </header>
  );
}
