import { useState, useEffect } from 'react';
import { getBuses, createBus, updateBus, deleteBus } from '../../api/endpoints';

export default function BusManager() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    bus_number: '', route_name: '', driver_name: '', driver_phone: '',
    status: 'stopped', departure_time: '', arrival_time: '', capacity: 50,
    route_description: '',
  });

  useEffect(() => { loadBuses(); }, []);

  const loadBuses = async () => {
    try {
      const res = await getBuses();
      setBuses(res.data.results || res.data || []);
    } catch (e) { /* ignore */ }
    setLoading(false);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      bus_number: '', route_name: '', driver_name: '', driver_phone: '',
      status: 'stopped', departure_time: '', arrival_time: '', capacity: 50,
      route_description: '',
    });
    setModalOpen(true);
  };

  const openEdit = (bus) => {
    setEditing(bus);
    setForm({
      bus_number: bus.bus_number,
      route_name: bus.route_name,
      driver_name: bus.driver_name || '',
      driver_phone: bus.driver_phone || '',
      status: bus.status,
      departure_time: bus.departure_time || '',
      arrival_time: bus.arrival_time || '',
      capacity: bus.capacity,
      route_description: bus.route_description || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateBus(editing.id, form);
      } else {
        await createBus(form);
      }
      setModalOpen(false);
      loadBuses();
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Error'));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this bus?')) return;
    try {
      await deleteBus(id);
      loadBuses();
    } catch (e) { /* ignore */ }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  if (loading) {
    return <div className="skeleton skeleton--card" style={{ height: '400px' }} />;
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Manage Buses</h2>
          <p className="section-subtitle">{buses.length} buses registered</p>
        </div>
        <button className="glass-btn glass-btn--primary" onClick={openAdd} id="add-bus-btn">
          + Add Bus
        </button>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Bus #</th>
                <th>Route</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Departure</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id}>
                  <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{bus.bus_number}</td>
                  <td>{bus.route_name}</td>
                  <td>{bus.driver_name || '--'}</td>
                  <td>
                    <span className={`status-badge status-badge--${bus.status}`}>{bus.status}</span>
                  </td>
                  <td>{bus.departure_time || '--'}</td>
                  <td>{bus.capacity}</td>
                  <td>
                    <div className="data-table__actions">
                      <button className="glass-btn glass-btn--secondary glass-btn--sm" onClick={() => openEdit(bus)}>
                        Edit
                      </button>
                      <button className="glass-btn glass-btn--danger glass-btn--sm" onClick={() => handleDelete(bus.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {buses.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center" style={{ padding: '40px' }}>
                    No buses found. Click "Add Bus" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <form
            className="modal-content glass-card glass-card--heavy"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
          >
            <div className="modal-header">
              <h2 className="modal-title">{editing ? 'Edit Bus' : 'Add New Bus'}</h2>
              <button type="button" className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bus Number *</label>
                <input className="glass-input" value={form.bus_number} onChange={handleChange('bus_number')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Route Name *</label>
                <input className="glass-input" value={form.route_name} onChange={handleChange('route_name')} required />
              </div>
            </div>

            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label className="form-label">Driver Name</label>
                <input className="glass-input" value={form.driver_name} onChange={handleChange('driver_name')} />
              </div>
              <div className="form-group">
                <label className="form-label">Driver Phone</label>
                <input className="glass-input" value={form.driver_phone} onChange={handleChange('driver_phone')} />
              </div>
            </div>

            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="glass-select" value={form.status} onChange={handleChange('status')}>
                  <option value="stopped">Stopped</option>
                  <option value="running">Running</option>
                  <option value="delayed">Delayed</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Capacity</label>
                <input className="glass-input" type="number" value={form.capacity} onChange={handleChange('capacity')} />
              </div>
            </div>

            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label className="form-label">Departure Time</label>
                <input className="glass-input" type="time" value={form.departure_time} onChange={handleChange('departure_time')} />
              </div>
              <div className="form-group">
                <label className="form-label">Arrival Time</label>
                <input className="glass-input" type="time" value={form.arrival_time} onChange={handleChange('arrival_time')} />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="form-label">Route Description</label>
              <textarea className="glass-input" rows="3" value={form.route_description} onChange={handleChange('route_description')} />
            </div>

            <div className="modal-actions">
              <button type="button" className="glass-btn glass-btn--secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="glass-btn glass-btn--primary">
                {editing ? 'Update Bus' : 'Create Bus'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
