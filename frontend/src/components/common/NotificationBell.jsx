import { useState, useEffect, useRef } from 'react';
import { getNotifications, getUnreadCount, markNotificationRead } from '../../api/endpoints';

function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const seconds = Math.floor((now - then) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const loadData = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        getNotifications(),
        getUnreadCount()
      ]);
      setNotifications(notifRes.data.results || notifRes.data || []);
      setUnread(countRes.data.unread_count || 0);
    } catch (e) { /* ignore */ }
  };

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch (e) { /* ignore */ }
  };

  return (
    <div className="notif-bell" ref={ref}>
      <button
        className="glass-btn glass-btn--secondary glass-btn--icon"
        onClick={() => setOpen(!open)}
        id="notification-bell"
        aria-label="Notifications"
      >
        🔔
      </button>
      {unread > 0 && <span className="notif-bell__badge">{unread}</span>}

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown__header">
            Notifications {unread > 0 && `(${unread} new)`}
          </div>
          {notifications.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px' }}>
              <div className="empty-state__icon">🔕</div>
              <div className="empty-state__text">No notifications yet</div>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notif-item ${!n.is_read ? 'notif-item--unread' : ''}`}
                onClick={() => handleRead(n.id)}
              >
                <span className={`notif-type-badge notif-type-badge--${n.type}`}>
                  {n.type?.replace('_', ' ')}
                </span>
                <div className="notif-item__title">{n.title}</div>
                <div className="notif-item__message">{n.message}</div>
                <div className="notif-item__time">{timeAgo(n.created_at)}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
