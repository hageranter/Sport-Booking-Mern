import api from './api';

const notificationService = {
    fetchNotifications: (params) => api.get('/notifications', { params }),
    getNotification: (id) => api.get(`/notifications/${id}`),
    createNotification: (data) => api.post('/notifications', data),
    updateNotification: (id, data) => api.put(`/notifications/${id}`, data),
    markAsRead: (id) => api.patch(`/notifications/${id}/read`),
    deleteNotification: (id) => api.delete(`/notifications/${id}`)
};

export default notificationService;
