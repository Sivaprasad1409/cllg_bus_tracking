import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser, getBuses } from '../../api/endpoints';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [roleFilter, setRoleFilter] = useState('');
  const [form, setForm] = useState({
    username: '', email: '', password: '', first_name: '', last_name: '',
    role: 'student', phone: '', assigned_bus: '', is_active: true,
  });

  useEffect(() => {
    loadData();
  }, [roleFilter]);

  const loadData = async () => {
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      const [usersRes, busesRes] = await Promise.all([
        getUsers(params),
        getBuses()
      ]);
      setUsers(usersRes.data.results || usersRes.data || []);
      setBuses(busesRes.data.results || busesRes.data || []);
    } catch (e) { /* ignore */ }
    setLoading(false);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({
      username: '', email: '', password: '', first_name: '', last_name: '',
      role: 'student', phone: '', assigned_bus: '', is_active: true,
    });
    setModalOpen(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({
      username: user.username,
      email: user.email || '',
      password: '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      role: user.role,
      phone: user.phone || '',
      assigned_bus: user.assigned_bus || '',
      is_active: user.is_active,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form };
      if (!data.password) delete data.password;
      if (!data.assigned_bus) data.assigned_bus = null;

      if (editing) {
        await updateUser(editing.id, data);
      } else {
        await createUser(data);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(JSON.stringify(err.response?.data || 'Error'));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      loadData();
    } catch (e) { /* ignore */ }
  };

  const handleChange = (field) => (e) => {
    const val = field === 'is_active' ? e.target.checked : e.target.value;
    setForm({ ...form, [field]: val });
  };

  if (loading) {
    return <div className="skeleton skeleton--card" style={{ height: '400px' }} />;
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Manage Users</h2>
          <p className="section-subtitle">{users.length} users registered</p>
        </div>
        <div className="flex gap-12">
          <select
            className="glass-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>
          <button className="glass-btn glass-btn--primary" onClick={openAdd} id="add-user-btn">
            + Add User
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Email</th>
                <th>Assigned Bus</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.first_name} {u.last_name}</td>
                  <td>{u.username}</td>
                  <td>
                    <span style={{
                      textTransform: 'capitalize',
                      fontWeight: 500,
                      color: u.role === 'admin' ? 'var(--status-stopped)' : 'var(--accent)',
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{u.email || '--'}</td>
                  <td style={{ fontWeight: 500, color: 'var(--accent)' }}>
                    {u.assigned_bus_number || '--'}
                  </td>
                  <td>
                    <span className={`status-badge ${u.is_active ? 'status-badge--running' : 'status-badge--stopped'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="data-table__actions">
                      <button className="glass-btn glass-btn--secondary glass-btn--sm" onClick={() => openEdit(u)}>
                        Edit
                      </button>
                      {u.role !== 'admin' && (
                        <button className="glass-btn glass-btn--danger glass-btn--sm" onClick={() => handleDelete(u.id)}>
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center" style={{ padding: '40px' }}>
                    No users found.
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
              <h2 className="modal-title">{editing ? 'Edit User' : 'Add New User'}</h2>
              <button type="button" className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input className="glass-input" value={form.first_name} onChange={handleChange('first_name')} />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input className="glass-input" value={form.last_name} onChange={handleChange('last_name')} />
              </div>
            </div>

            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input className="glass-input" value={form.username} onChange={handleChange('username')} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="glass-input" type="email" value={form.email} onChange={handleChange('email')} />
              </div>
            </div>

            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label className="form-label">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                <input
                  className="glass-input" type="password"
                  value={form.password} onChange={handleChange('password')}
                  required={!editing}
                  minLength={6}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="glass-input" value={form.phone} onChange={handleChange('phone')} />
              </div>
            </div>

            <div className="form-row" style={{ marginTop: '16px' }}>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="glass-select" value={form.role} onChange={handleChange('role')}>
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned Bus</label>
                <select className="glass-select" value={form.assigned_bus} onChange={handleChange('assigned_bus')}>
                  <option value="">No bus assigned</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>{b.bus_number} — {b.route_name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '16px' }}>
              <label className="flex items-center gap-8" style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleChange('is_active')}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                />
                <span className="form-label" style={{ margin: 0 }}>Active account</span>
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" className="glass-btn glass-btn--secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="glass-btn glass-btn--primary">
                {editing ? 'Update User' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
