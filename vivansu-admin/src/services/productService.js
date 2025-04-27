
import api from './api';

export const getProducts = async (categoryId = null) => {
  const url = categoryId ? `/Product/by-category/${categoryId}` : '/Product';
  console.log("Gọi API sản phẩm:", url);
  try {
    const response = await api.get(url);
    if (response.status !== 200) {
      throw new Error(`Lỗi API: Status ${response.status}`);
    }
    const data = Array.isArray(response.data) ? response.data : [];
    console.log("Phản hồi sản phẩm:", data);
    return data;
  } catch (err) {
    console.error("Lỗi API sản phẩm:", {
      message: err.message,
      response: err.response ? {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers
      } : null
    });
    throw err;
  }
};

export const getProductById = async (id) => {
  const url = `/Product/${id}`;
  console.log("Gọi API chi tiết sản phẩm:", url);
  try {
    const response = await api.get(url);
    if (response.status !== 200) {
      throw new Error(`Lỗi API: Status ${response.status}`);
    }
    const data = response.data || {};
    console.log("Phản hồi chi tiết sản phẩm:", data);
    return data;
  } catch (err) {
    console.error("Lỗi API chi tiết sản phẩm:", {
      message: err.message,
      response: err.response ? {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers
      } : null
    });
    throw err;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await api.post('/Product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("Tạo sản phẩm thành công:", response.data);
    return response.data;
  } catch (err) {
    console.error("Lỗi khi tạo sản phẩm:", {
      message: err.message,
      response: err.response ? {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers
      } : null
    });
    throw err;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await api.put(`/Product/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("Cập nhật sản phẩm thành công:", response.data);
    return response.data;
  } catch (err) {
    console.error("Lỗi khi cập nhật sản phẩm:", {
      message: err.message,
      response: err.response ? {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers
      } : null
    });
    throw err;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/Product/${id}`);
    console.log("Xóa sản phẩm thành công:", response.data);
    return response.data;
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm:", {
      message: err.message,
      response: err.response ? {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers
      } : null
    });
    throw err;
  }
};