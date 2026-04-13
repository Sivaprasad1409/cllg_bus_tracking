import { useState, useEffect } from 'react';
import { getMyBus, getBus } from '../../api/endpoints';
import useWebSocket from '../../hooks/useWebSocket';
import TrackingMap from '../map/TrackingMap';
import useAuthStore from '../../store/authStore';

export default function StudentDashboard({ showMapOnly }) {
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { locations, connected } = useWebSocket();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    loadBus();
  }, []);

  const loadBus = async () => {
    try {
      setLoading(true);
      const res = await getMyBus();
      setBus(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || 'No bus assigned to your account.');
    } finally {
      setLoading(false);
    }
  };

  const calculateETA = () => {
    if (!bus?.arrival_time) return null;
    const now = new Date();
    const [h, m] = bus.arrival_time.split(':');
    const arrival = new Date();
    arrival.setHours(parseInt(h), parseInt(m), 0);
    const diff = arrival - now;
    if (diff <= 0) return 'Arrived';
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  };

  if (loading) {
    return (
      <div className="dashboard-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton skeleton--card" style={{ height: '180px' }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state glass-card" style={{ padding: '64px' }}>
        <div className="empty-state__icon">🚌</div>
        <div className="empty-state__title">{error}</div>
        <div className="empty-state__text">
          Please contact the admin to get a bus assigned to your account.
        </div>
      </div>
    );
  }

  if (showMapOnly) {
    return (
      <div>
        <div className="section-header">
          <div>
            <h2 className="section-title">Live Tracking</h2>
            <p className="section-subtitle">
              {connected ? '🟢 Connected' : '🔴 Reconnecting...'}
            </p>
          </div>
        </div>
        <TrackingMap
          locations={locations}
          buses={bus ? [bus] : []}
          height="calc(100vh - 180px)"
          selectedBusId={bus?.id?.toString()}
        />
      </div>
    );
  }

  const eta = calculateETA();
  const busLoc = locations[bus?.id?.toString()];

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">
            Welcome, {user?.first_name || user?.username} 👋
          </h2>
          <p className="section-subtitle">
            Here's your bus status for today
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="dashboard-grid">
        {/* Bus Info Card */}
        <div className="bus-card glass-card glass-card--hover">
          <div className="bus-card__header">
            <span className="bus-card__number">{bus.bus_number}</span>
            <span className={`status-badge status-badge--${bus.status}`}>
              {bus.status}
            </span>
          </div>
          <div className="bus-card__route">{bus.route_name}</div>
          <div className="bus-card__details">
            <div className="bus-card__detail">
              <span className="bus-card__detail-label">Driver</span>
              <span className="bus-card__detail-value">{bus.driver_name || 'N/A'}</span>
            </div>
            <div className="bus-card__detail">
              <span className="bus-card__detail-label">Contact</span>
              <span className="bus-card__detail-value">{bus.driver_phone || 'N/A'}</span>
            </div>
            <div className="bus-card__detail">
              <span className="bus-card__detail-label">Departure</span>
              <span className="bus-card__detail-value">{bus.departure_time || 'N/A'}</span>
            </div>
            <div className="bus-card__detail">
              <span className="bus-card__detail-label">Capacity</span>
              <span className="bus-card__detail-value">{bus.capacity} seats</span>
            </div>
          </div>
        </div>

        {/* ETA Card */}
        <div className="eta-display glass-card glass-card--hover">
          <div className="eta-display__label">Estimated Arrival</div>
          <div className="eta-display__time">
            {eta || '--'}
            {eta && eta !== 'Arrived' && <span className="eta-display__unit">left</span>}
          </div>
          <div className="eta-display__note">
            Scheduled: {bus.arrival_time || 'N/A'}
          </div>
        </div>

        {/* Connection Status */}
        <div className="stat-card glass-card glass-card--hover">
          <div className={`stat-card__icon ${connected ? 'stat-card__icon--green' : 'stat-card__icon--red'}`}>
            {connected ? '📡' : '⚠️'}
          </div>
          <div className="stat-card__info">
            <div className="stat-card__value" style={{ fontSize: '1.25rem' }}>
              {connected ? 'Live' : 'Offline'}
            </div>
            <div className="stat-card__label">
              {connected ? 'Real-time tracking active' : 'Attempting to reconnect...'}
            </div>
          </div>
        </div>
      </div>

      {/* Stops */}
      {bus.stops && bus.stops.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px' }}>
            Route Stops
          </h3>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Stop Name</th>
                    <th>Estimated Time</th>
                  </tr>
                </thead>
                <tbody>
                  {bus.stops.map((stop, i) => (
                    <tr key={stop.id}>
                      <td>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{stop.stop_name}</td>
                      <td>{stop.estimated_time || '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '16px' }}>
        Live Location {connected && <span style={{ color: 'var(--status-running)', fontSize: '0.75rem' }}>● Live</span>}
      </h3>
      <TrackingMap
        locations={locations}
        buses={[bus]}
        height="400px"
        selectedBusId={bus?.id?.toString()}
      />
    </div>
  );
}
