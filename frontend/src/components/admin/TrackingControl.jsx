import { useState, useEffect } from 'react';
import { getBuses } from '../../api/endpoints';
import useWebSocket from '../../hooks/useWebSocket';
import TrackingMap from '../map/TrackingMap';

export default function TrackingControl() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const { locations, connected } = useWebSocket();

  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const res = await getBuses();
      setBuses(res.data.results || res.data || []);
    } catch (e) { /* ignore */ }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Live Tracking Control</h2>
          <p className="section-subtitle">
            {connected ? '🟢 Real-time connected' : '🔴 Reconnecting...'} · {Object.keys(locations).length} buses tracked
          </p>
        </div>
      </div>

      {/* Bus selector */}
      <div className="flex gap-12 mb-24" style={{ flexWrap: 'wrap' }}>
        <button
          className={`glass-btn ${!selectedBus ? 'glass-btn--primary' : 'glass-btn--secondary'}`}
          onClick={() => setSelectedBus(null)}
        >
          All Buses
        </button>
        {buses.map((bus) => (
          <button
            key={bus.id}
            className={`glass-btn ${selectedBus === bus.id ? 'glass-btn--primary' : 'glass-btn--secondary'}`}
            onClick={() => setSelectedBus(bus.id)}
          >
            {bus.bus_number}
            <span className={`status-badge status-badge--${bus.status}`} style={{ marginLeft: '4px', padding: '2px 6px', fontSize: '0.625rem' }}>
              {bus.status}
            </span>
          </button>
        ))}
      </div>

      {/* Map */}
      <TrackingMap
        locations={selectedBus
          ? Object.fromEntries(
              Object.entries(locations).filter(([k]) => k === selectedBus.toString())
            )
          : locations
        }
        buses={buses}
        height="calc(100vh - 260px)"
        selectedBusId={selectedBus?.toString()}
      />

      {/* Live data */}
      {Object.keys(locations).length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
            Live Positions
          </h3>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Bus</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Latitude</th>
                    <th>Longitude</th>
                    <th>Bearing</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(locations).map((loc) => (
                    <tr key={loc.bus_id}>
                      <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{loc.bus_number}</td>
                      <td>{loc.route_name}</td>
                      <td>
                        <span className={`status-badge status-badge--${loc.status}`}>{loc.status}</span>
                      </td>
                      <td>{loc.latitude}</td>
                      <td>{loc.longitude}</td>
                      <td>{loc.bearing}°</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
