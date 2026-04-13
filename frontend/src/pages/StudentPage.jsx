import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import TopBar from '../components/common/TopBar';
import StudentDashboard from '../components/student/StudentDashboard';
import BusSearch from '../components/student/BusSearch';

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/dashboard/search', icon: '🔍', label: 'Search Bus' },
  { path: '/dashboard/tracking', icon: '📍', label: 'Live Tracking' },
];

export default function StudentPage() {
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
          title="Student Dashboard"
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="app-content page-enter">
          <Routes>
            <Route index element={<StudentDashboard />} />
            <Route path="search" element={<BusSearch />} />
            <Route path="tracking" element={<StudentDashboard showMapOnly />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
