import api from './api';

export const login = async (loginData) => {
  const response = await api.post('/User/Login', loginData);
  return response.data;
};

export const register = async (registerData) => {
  const response = await api.post('/User/Register', registerData);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/User');
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(`/User/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/User/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/User/${id}`);
  return response.data;
};