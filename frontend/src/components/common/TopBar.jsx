import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';

export default function TopBar({ title, onMenuClick }) {
  return (
    <header className="app-topbar">
      <div className="flex items-center gap-12">
        <button className="mobile-menu-btn" onClick={onMenuClick}>☰</button>
        <h1 className="app-topbar__title">{title}</h1>
      </div>
      <div className="app-topbar__actions">
        <NotificationBell />
        <ThemeToggle />
      </div>
    </header>
  );
}
