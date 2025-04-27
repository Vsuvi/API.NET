import api from './api';

export const getCategories = async () => {
  console.log("Gọi API danh mục: /Category"); // Gỡ lỗi
  try {
    const response = await api.get('/Category');
    const data = response.data.categories || response.data || [];
    console.log("Phản hồi danh mục:", data); // Gỡ lỗi
    return data;
  } catch (err) {
    console.error("Lỗi API danh mục:", err.response || err.message); // Gỡ lỗi
    throw err;
  }
};
export const getCategory = async (id) => {
  const response = await api.get(`/Category/${id}`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/Category', categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/Category/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/Category/${id}`);
  return response.data;
};