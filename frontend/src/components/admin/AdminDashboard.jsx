import { useState, useEffect } from 'react';
import { getAnalytics } from '../../api/endpoints';
import useAuthStore from '../../store/authStore';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await getAnalytics();
      setAnalytics(res.data);
    } catch (e) { /* ignore */ }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="dashboard-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton skeleton--card" style={{ height: '120px' }} />
        ))}
      </div>
    );
  }

  const stats = [
    { label: 'Total Users', value: analytics?.total_users || 0, icon: '👥', cls: 'blue' },
    { label: 'Students', value: analytics?.total_students || 0, icon: '🎓', cls: 'purple' },
    { label: 'Faculty', value: analytics?.total_faculty || 0, icon: '👨‍🏫', cls: 'green' },
    { label: 'Active Buses', value: analytics?.total_buses || 0, icon: '🚌', cls: 'blue' },
    { label: 'Running Now', value: analytics?.running_buses || 0, icon: '🟢', cls: 'green' },
    { label: 'Delayed', value: analytics?.delayed_buses || 0, icon: '⚠️', cls: 'orange' },
    { label: 'Stopped', value: analytics?.stopped_buses || 0, icon: '🔴', cls: 'red' },
    { label: 'Notifications Sent', value: analytics?.total_notifications || 0, icon: '🔔', cls: 'purple' },
    { label: 'Assigned Users', value: analytics?.users_with_bus || 0, icon: '✅', cls: 'green' },
    { label: 'Unassigned Users', value: analytics?.users_without_bus || 0, icon: '❌', cls: 'red' },
  ];

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">
            Welcome back, {user?.first_name || 'Admin'} 👋
          </h2>
          <p className="section-subtitle">
            System overview and analytics
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card glass-card glass-card--hover">
            <div className={`stat-card__icon stat-card__icon--${stat.cls}`}>
              {stat.icon}
            </div>
            <div className="stat-card__info">
              <div className="stat-card__value">{stat.value}</div>
              <div className="stat-card__label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
