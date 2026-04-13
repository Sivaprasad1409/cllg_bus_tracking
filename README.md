# 🚌 CampusRide — College Bus Tracking System

A production-ready, modern web application for real-time college bus tracking with an Apple-inspired glassmorphism design system.

## ✨ Features

### Student / Faculty Dashboard
- 🗺️ **Real-time bus tracking** on an interactive map
- 📍 **Live GPS simulation** with animated markers
- 🔍 **Search any bus** by bus number
- ⏱️ **ETA display** with scheduled arrival times
- 🚏 **Route stops** with estimated timings
- 🔔 **Notifications** for delays, route changes, and announcements
- 🌙 **Dark mode** toggle

### Admin Dashboard
- 📊 **System analytics** overview
- 🚌 **Bus management** — Add, edit, delete buses
- 👥 **User management** — CRUD users with bus assignment
- 📢 **Announcements** — Send targeted notifications
- 📍 **Live tracking control** — Monitor all buses in real-time

### Technical Highlights
- 🔑 **JWT authentication** with role-based access control
- 🔄 **WebSocket real-time updates** via Django Channels
- 🗺️ **Leaflet + OpenStreetMap** (free, no API key needed)
- 🎨 **Apple-inspired glassmorphism** design system
- 📱 **Responsive** — works on mobile and desktop
- ⚡ **Vite + React** frontend with Zustand state management

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### 1. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate     # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r backend/requirements.txt

# Run migrations
python backend/manage.py makemigrations accounts buses notifications
python backend/manage.py migrate

# Seed demo data
python backend/seed_data.py

# Start backend server
python backend/manage.py runserver 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Open the App

Visit **http://localhost:5173** in your browser.

---

## 🔑 Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Student | `student1` | `student123` |
| Student | `student2` | `student123` |
| Faculty | `faculty1` | `faculty123` |

---

## 📁 Project Structure

```
cllg_bus_tracking/
├── backend/                    # Django Backend
│   ├── config/                 # Django settings, URLs, ASGI
│   ├── apps/
│   │   ├── accounts/           # User model, auth, RBAC
│   │   ├── buses/              # Bus, stops, routes CRUD
│   │   ├── notifications/      # Notifications management
│   │   └── tracking/           # WebSocket, GPS simulator
│   ├── seed_data.py            # Demo data seeder
│   └── requirements.txt
├── frontend/                   # React + Vite Frontend
│   ├── src/
│   │   ├── api/                # Axios client, API endpoints
│   │   ├── store/              # Zustand auth store
│   │   ├── hooks/              # WebSocket hook
│   │   ├── components/
│   │   │   ├── common/         # Glass UI components
│   │   │   ├── map/            # Leaflet tracking map
│   │   │   ├── student/        # Student dashboard
│   │   │   └── admin/          # Admin dashboard
│   │   └── pages/              # Login, Student, Admin pages
│   └── package.json
└── README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite, Leaflet, Zustand |
| Backend | Django, Django REST Framework, Django Channels |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Auth | JWT (SimpleJWT) |
| Real-time | WebSockets (Channels + Daphne) |
| Maps | Leaflet + OpenStreetMap |
| Design | Custom CSS Glassmorphism |

---

## 🗺️ GPS Simulation

Since real GPS hardware isn't available, the system simulates bus movement:
- Buses move along predefined route points (Hyderabad, India)
- Positions update every 3 seconds via WebSocket
- Buses bounce back and forth along their routes
- The architecture supports real GPS data as a drop-in replacement

---

## 📄 License

MIT License
