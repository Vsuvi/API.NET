import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';
import './AdminCategories.css';

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false); // State để điều khiển hiển thị form
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Không thể tải danh mục');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateCategory(formData.id, { id: formData.id, name: formData.name });
      } else {
        await createCategory({ name: formData.name });
      }
      resetForm();
      fetchCategories();
      setShowForm(false); // Ẩn form sau khi submit
    } catch (err) {
      setError('Lỗi khi lưu danh mục');
    }
  };

  const handleEdit = (category) => {
    setFormData({
      id: category.id,
      name: category.name,
    });
    setIsEditing(true);
    setShowForm(true); // Hiển thị form khi chỉnh sửa
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await deleteCategory(id);
        fetchCategories();
      } catch (err) {
        setError('Lỗi khi xóa danh mục');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
    });
    setIsEditing(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      resetForm(); // Reset form khi ẩn
    }
  };

  return (
    <div className="admin-categories">
      <h2>Quản lý danh mục</h2>

      {/* Nút hiển thị/ẩn form */}
      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? 'Ẩn Form' : 'Thêm danh mục'}
      </button>

      {/* Form thêm/sửa danh mục */}
      {showForm && (
        <div className="form-card">
          <h3>{isEditing ? 'Sửa danh mục' : 'Thêm danh mục'}</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Tên danh mục:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">{isEditing ? 'Cập nhật' : 'Thêm'}</button>
              <button type="button" onClick={toggleForm}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      {/* Bảng danh mục */}
      <div className="table-card">
        <h3>Danh sách danh mục</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>
                  <button onClick={() => handleEdit(category)} className="edit-button">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="delete-button">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategories;