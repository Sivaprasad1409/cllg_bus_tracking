import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import TopBar from '../components/common/TopBar';
import AdminDashboard from '../components/admin/AdminDashboard';
import BusManager from '../components/admin/BusManager';
import UserManager from '../components/admin/UserManager';
import AnnouncementPanel from '../components/admin/AnnouncementPanel';
import TrackingControl from '../components/admin/TrackingControl';

const navItems = [
  { path: '/admin', icon: '📊', label: 'Overview' },
  { path: '/admin/buses', icon: '🚌', label: 'Manage Buses' },
  { path: '/admin/users', icon: '👥', label: 'Manage Users' },
  { path: '/admin/announcements', icon: '📢', label: 'Announcements' },
  { path: '/admin/tracking', icon: '📍', label: 'Live Tracking' },
];

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        items={navItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="app-main">
        <TopBar
          title="Admin Dashboard"
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="app-content page-enter">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="buses" element={<BusManager />} />
            <Route path="users" element={<UserManager />} />
            <Route path="announcements" element={<AnnouncementPanel />} />
            <Route path="tracking" element={<TrackingControl />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
