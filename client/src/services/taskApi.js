import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('inib_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data.user;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/api/auth/register', userData);
  return response.data;
};

export const getTasks = async () => {
  const response = await api.get('/api/tasks');
  return response.data.tasks || [];
};

export const createTask = async (taskData) => {
  const response = await api.post('/api/tasks', taskData);
  return response.data.task;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.put(`/api/tasks/${taskId}`, taskData);
  return response.data.task;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(`/api/tasks/${taskId}`);
  return response.data;
};

export const toggleTask = async (taskId) => {
  const response = await api.patch(`/api/tasks/${taskId}/toggle`);
  return response.data.task;
};

export default api;
