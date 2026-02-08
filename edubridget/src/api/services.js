import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Authentication APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// User Management APIs
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  export: (params) => api.get('/users/export', { params, responseType: 'blob' }),
};

// Application Management APIs
export const applicationAPI = {
  getAll: (params) => api.get('/applications', { params }),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  updateStatus: (id, status, feedback) => api.patch(`/applications/${id}/status`, { status, feedback }),
  delete: (id) => api.delete(`/applications/${id}`),
  getDocuments: (id) => api.get(`/applications/${id}/documents`),
  downloadDocument: (id, docId) => api.get(`/applications/${id}/documents/${docId}`, { responseType: 'blob' }),
  downloadAll: (id) => api.get(`/applications/${id}/documents/download-all`, { responseType: 'blob' }),
  sendFeedback: (id, feedback) => api.post(`/applications/${id}/feedback`, feedback),
  requestDocuments: (id, documents) => api.post(`/applications/${id}/request-documents`, { documents }),
};

// Visa Case Management APIs
export const visaAPI = {
  getAll: (params) => api.get('/visa-cases', { params }),
  getById: (id) => api.get(`/visa-cases/${id}`),
  create: (data) => api.post('/visa-cases', data),
  update: (id, data) => api.put(`/visa-cases/${id}`, data),
  updateStatus: (id, status) => api.patch(`/visa-cases/${id}/status`, { status }),
  delete: (id) => api.delete(`/visa-cases/${id}`),
  scheduleConsultation: (id, data) => api.post(`/visa-cases/${id}/schedule`, data),
  verifyDocuments: (id, documents) => api.patch(`/visa-cases/${id}/verify-documents`, { documents }),
  getTimeline: (id) => api.get(`/visa-cases/${id}/timeline`),
};

// Content Management APIs
export const contentAPI = {
  // Scholarships
  scholarships: {
    getAll: (params) => api.get('/scholarships', { params }),
    getById: (id) => api.get(`/scholarships/${id}`),
    create: (data) => api.post('/scholarships', data),
    update: (id, data) => api.put(`/scholarships/${id}`, data),
    delete: (id) => api.delete(`/scholarships/${id}`),
  },
  // Universities
  universities: {
    getAll: (params) => api.get('/universities', { params }),
    getById: (id) => api.get(`/universities/${id}`),
    create: (data) => api.post('/universities', data),
    update: (id, data) => api.put(`/universities/${id}`, data),
    delete: (id) => api.delete(`/universities/${id}`),
  },
  // Partners
  partners: {
    getAll: (params) => api.get('/partners', { params }),
    getById: (id) => api.get(`/partners/${id}`),
    create: (data) => api.post('/partners', data),
    update: (id, data) => api.put(`/partners/${id}`, data),
    delete: (id) => api.delete(`/partners/${id}`),
  },
  // News
  news: {
    getAll: (params) => api.get('/news', { params }),
    getById: (id) => api.get(`/news/${id}`),
    create: (data) => api.post('/news', data),
    update: (id, data) => api.put(`/news/${id}`, data),
    delete: (id) => api.delete(`/news/${id}`),
  },
};

// Analytics APIs
export const analyticsAPI = {
  getApplicationStats: (params) => api.get('/analytics/applications', { params }),
  getVisaStats: (params) => api.get('/analytics/visa-cases', { params }),
  getDemographics: (params) => api.get('/analytics/demographics', { params }),
  getRevenue: (params) => api.get('/analytics/revenue', { params }),
  exportReport: (type, params) => api.get(`/analytics/export/${type}`, { params, responseType: 'blob' }),
};

// Communication APIs
export const communicationAPI = {
  sendBulkNotification: (data) => api.post('/communications/bulk', data),
  getTemplates: () => api.get('/communications/templates'),
  sendMessage: (userId, message) => api.post(`/communications/messages`, { userId, message }),
  getMessages: (userId) => api.get(`/communications/messages/${userId}`),
  getNotificationHistory: (params) => api.get('/communications/history', { params }),
};

// File Upload
export const uploadFile = async (file, folder = 'documents') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);
  
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
