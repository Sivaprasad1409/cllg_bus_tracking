import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { login } from '../api/endpoints';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  // If already logged in, redirect
  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login({ username, password });
      setAuth(res.data.user, res.data.access, res.data.refresh);

      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card glass-card glass-card--heavy" onSubmit={handleSubmit}>
        <div className="login-card__logo">🚌</div>
        <h1 className="login-card__title">CampusRide</h1>
        <p className="login-card__subtitle">College Bus Tracking System</p>

        {error && <div className="login-card__error">{error}</div>}

        <div className="form-group">
          <label className="form-label" htmlFor="login-username">Username</label>
          <input
            id="login-username"
            className="glass-input"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            className="glass-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          id="login-submit"
          className="glass-btn glass-btn--primary login-card__submit"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '20px' }}>
          Demo: admin / admin123 · student1 / student123
        </p>
      </form>
    </div>
  );
}
