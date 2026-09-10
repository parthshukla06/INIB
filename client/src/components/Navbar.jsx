import { Moon, Search, Sun, Bell, UserCircle2, LogOut } from 'lucide-react';

export default function Navbar({ searchTerm, onSearchChange, theme, onToggleTheme, user, onLogout }) {
  return (
    <header className="topbar">
      <div className="brand-block">
        <div className="brand-mark">IN</div>
        <div>
          <p className="brand-label">INIB</p>
          <h1>Tasks</h1>
        </div>
      </div>

      <label className="search-shell" htmlFor="global-search">
        <Search size={17} />
        <input
          id="global-search"
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search tasks"
          aria-label="Search tasks"
        />
      </label>

      <div className="topbar-actions">
        <button type="button" className="icon-button" aria-label="Toggle theme" onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button type="button" className="icon-button" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <div className="profile-pill" aria-label="Profile">
          <UserCircle2 size={26} />
          <span>{user?.name?.split(' ')[0] || 'User'}</span>
        </div>

        <button type="button" className="icon-button" aria-label="Logout" onClick={onLogout}>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
