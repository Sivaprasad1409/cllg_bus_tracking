import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

export default function Sidebar({ items, open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleNav = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'var(--overlay)',
            zIndex: 99, display: 'none',
          }}
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}
      <aside className={`app-sidebar ${open ? 'app-sidebar--open' : ''}`}>
        <div className="app-sidebar__logo">
          <div className="app-sidebar__logo-icon">🚌</div>
          <div>
            <div className="app-sidebar__logo-text">CampusRide</div>
            <div className="app-sidebar__logo-sub">Bus Tracking</div>
          </div>
        </div>

        <nav className="app-sidebar__nav">
          <div className="app-sidebar__section-title">Navigation</div>
          {items.map((item) => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'nav-item--active' : ''}`}
              onClick={() => handleNav(item.path)}
            >
              <span className="nav-item__icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="app-sidebar__footer">
          <div style={{ padding: '8px 12px', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>
              {user?.first_name} {user?.last_name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
              {user?.role}
            </div>
          </div>
          <button className="nav-item" onClick={handleLogout}>
            <span className="nav-item__icon">🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
}
