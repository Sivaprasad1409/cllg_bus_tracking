import { useState, useEffect } from 'react';
import { getNotifications, createNotification, getBuses } from '../../api/endpoints';

function timeAgo(dateStr) {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function AnnouncementPanel() {
  const [notifications, setNotifications] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    title: '', message: '', type: 'general', bus: '',
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [nRes, bRes] = await Promise.all([getNotifications(), getBuses()]);
      setNotifications(nRes.data.results || nRes.data || []);
      setBuses(bRes.data.results || bRes.data || []);
    } catch (e) { /* ignore */ }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const data = { ...form };
      if (!data.bus) data.bus = null;
      await createNotification(data);
      setForm({ title: '', message: '', type: 'general', bus: '' });
      loadData();
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Error'));
    }
    setSending(false);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Announcements</h2>
          <p className="section-subtitle">Send notifications to students and faculty</p>
        </div>
      </div>

      {/* Send Form */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px' }}>
          📢 New Announcement
        </h3>
        <form className="announcement-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className="glass-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Announcement title"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="glass-select"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="general">General</option>
                <option value="delay">Delay</option>
                <option value="route_change">Route Change</option>
                <option value="timing">Timing Update</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Related Bus (optional)</label>
            <select
              className="glass-select"
              value={form.bus}
              onChange={(e) => setForm({ ...form, bus: e.target.value })}
            >
              <option value="">All users (no specific bus)</option>
              {buses.map((b) => (
                <option key={b.id} value={b.id}>{b.bus_number} — {b.route_name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea
              className="glass-input"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Type your announcement message..."
              required
              rows="4"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="glass-btn glass-btn--primary"
              disabled={sending}
            >
              {sending ? 'Sending...' : '📤 Send Announcement'}
            </button>
          </div>
        </form>
      </div>

      {/* History */}
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px' }}>
        Recent Announcements
      </h3>
      {loading ? (
        <div className="skeleton skeleton--card" style={{ height: '200px' }} />
      ) : notifications.length === 0 ? (
        <div className="empty-state glass-card">
          <div className="empty-state__icon">📭</div>
          <div className="empty-state__title">No announcements yet</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((n) => (
            <div key={n.id} className="glass-card" style={{ padding: '16px 20px' }}>
              <div className="flex items-center justify-between mb-16" style={{ marginBottom: '8px' }}>
                <div className="flex items-center gap-8">
                  <span className={`notif-type-badge notif-type-badge--${n.type}`}>
                    {n.type?.replace('_', ' ')}
                  </span>
                  {n.bus_number && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
                      Bus {n.bus_number}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  {timeAgo(n.created_at)}
                </span>
              </div>
              <div style={{ fontWeight: 500, marginBottom: '4px' }}>{n.title}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {n.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
