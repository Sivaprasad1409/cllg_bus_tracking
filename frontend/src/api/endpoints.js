import client from './client';

// ─── Auth ──────────────────────────────────────────
export const login = (data) => client.post('/auth/login/', data);
export const register = (data) => client.post('/auth/register/', data);
export const getProfile = () => client.get('/auth/profile/');

// ─── Buses ─────────────────────────────────────────
export const getBuses = (params) => client.get('/buses/', { params });
export const getBus = (id) => client.get(`/buses/${id}/`);
export const getMyBus = () => client.get('/buses/my_bus/');
export const searchBuses = (q) => client.get('/buses/search/', { params: { q } });
export const createBus = (data) => client.post('/buses/', data);
export const updateBus = (id, data) => client.put(`/buses/${id}/`, data);
export const deleteBus = (id) => client.delete(`/buses/${id}/`);

// ─── Users ─────────────────────────────────────────
export const getUsers = (params) => client.get('/auth/users/', { params });
export const getUser = (id) => client.get(`/auth/users/${id}/`);
export const createUser = (data) => client.post('/auth/users/', data);
export const updateUser = (id, data) => client.put(`/auth/users/${id}/`, data);
export const deleteUser = (id) => client.delete(`/auth/users/${id}/`);

// ─── Notifications ─────────────────────────────────
export const getNotifications = () => client.get('/notifications/');
export const createNotification = (data) => client.post('/notifications/', data);
export const markNotificationRead = (id) => client.post(`/notifications/${id}/read/`);
export const getUnreadCount = () => client.get('/notifications/unread_count/');

// ─── Analytics ─────────────────────────────────────
export const getAnalytics = () => client.get('/auth/analytics/');
