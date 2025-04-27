import api from './api';

export const getOrders = async () => {
  const response = await api.get('/Order');
  return response.data;
};

export const createOrder = async (order) => {
  const response = await api.post('/Order', order);
  return response.data;
};

export const updateOrder = async (id, order) => {
  const response = await api.put(`/Order/${id}`, order);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/Order/${id}`);
  return response.data;
};