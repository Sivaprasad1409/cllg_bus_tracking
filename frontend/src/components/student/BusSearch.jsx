import { useState } from 'react';
import { searchBuses, getBus } from '../../api/endpoints';
import useWebSocket from '../../hooks/useWebSocket';
import TrackingMap from '../map/TrackingMap';

export default function BusSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [searching, setSearching] = useState(false);
  const { locations, connected } = useWebSocket();

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length < 1) {
      setResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await searchBuses(val);
      setResults(res.data);
    } catch (e) {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelect = async (busId) => {
    try {
      const res = await getBus(busId);
      setSelectedBus(res.data);
    } catch (e) { /* ignore */ }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Search Bus</h2>
          <p className="section-subtitle">Find any bus by its number</p>
        </div>
      </div>

      {/* Search Input */}
      <div style={{ marginBottom: '24px', maxWidth: '480px' }}>
        <input
          className="glass-input glass-input--search"
          type="text"
          placeholder="Enter bus number (e.g. CB-101)"
          value={query}
          onChange={handleSearch}
          id="bus-search-input"
        />
      </div>

      {/* Search Results */}
      {results.length > 0 && !selectedBus && (
        <div className="glass-card" style={{ marginBottom: '24px', overflow: 'hidden' }}>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Bus Number</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Driver</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((bus) => (
                  <tr key={bus.id}>
                    <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{bus.bus_number}</td>
                    <td>{bus.route_name}</td>
                    <td>
                      <span className={`status-badge status-badge--${bus.status}`}>
                        {bus.status}
                      </span>
                    </td>
                    <td>{bus.driver_name || 'N/A'}</td>
                    <td>
                      <button
                        className="glass-btn glass-btn--primary glass-btn--sm"
                        onClick={() => handleSelect(bus.id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No results */}
      {query && results.length === 0 && !searching && (
        <div className="empty-state glass-card">
          <div className="empty-state__icon">🔍</div>
          <div className="empty-state__title">No buses found</div>
          <div className="empty-state__text">Try a different search term</div>
        </div>
      )}

      {/* Selected Bus Detail */}
      {selectedBus && (
        <div>
          <button
            className="glass-btn glass-btn--secondary mb-16"
            onClick={() => setSelectedBus(null)}
          >
            ← Back to results
          </button>

          <div className="dashboard-grid">
            <div className="bus-card glass-card">
              <div className="bus-card__header">
                <span className="bus-card__number">{selectedBus.bus_number}</span>
                <span className={`status-badge status-badge--${selectedBus.status}`}>
                  {selectedBus.status}
                </span>
              </div>
              <div className="bus-card__route">{selectedBus.route_name}</div>
              <div className="bus-card__details">
                <div className="bus-card__detail">
                  <span className="bus-card__detail-label">Driver</span>
                  <span className="bus-card__detail-value">{selectedBus.driver_name || 'N/A'}</span>
                </div>
                <div className="bus-card__detail">
                  <span className="bus-card__detail-label">Phone</span>
                  <span className="bus-card__detail-value">{selectedBus.driver_phone || 'N/A'}</span>
                </div>
                <div className="bus-card__detail">
                  <span className="bus-card__detail-label">Departure</span>
                  <span className="bus-card__detail-value">{selectedBus.departure_time || 'N/A'}</span>
                </div>
                <div className="bus-card__detail">
                  <span className="bus-card__detail-label">Arrival</span>
                  <span className="bus-card__detail-value">{selectedBus.arrival_time || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stops */}
          {selectedBus.stops?.length > 0 && (
            <div style={{ margin: '24px 0' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
                Route Stops
              </h3>
              <div className="glass-card" style={{ overflow: 'hidden' }}>
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr><th>#</th><th>Stop</th><th>ETA</th></tr>
                    </thead>
                    <tbody>
                      {selectedBus.stops.map((s, i) => (
                        <tr key={s.id}>
                          <td>{i + 1}</td>
                          <td>{s.stop_name}</td>
                          <td>{s.estimated_time || '--'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Map */}
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px' }}>
            Live Location
          </h3>
          <TrackingMap
            locations={locations}
            buses={[selectedBus]}
            height="350px"
            selectedBusId={selectedBus.id?.toString()}
          />
        </div>
      )}
    </div>
  );
}
