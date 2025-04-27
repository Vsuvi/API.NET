import React, { useState, useEffect } from 'react';
import { getUsers, register, updateUser, deleteUser } from '../services/userService';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    email: '',
    fullName: '',
    role: 'User',
    password: '', // Thêm password để tạo người dùng mới
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false); // State để điều khiển hiển thị form
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Không thể tải người dùng');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateUser(formData.id, {
          id: formData.id,
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role,
        });
      } else {
        await register({
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          role: formData.role,
          password: formData.password,
        });
      }
      resetForm();
      fetchUsers();
      setShowForm(false); // Ẩn form sau khi submit
    } catch (err) {
      setError(err.response?.data || (isEditing ? 'Lỗi khi cập nhật người dùng' : 'Lỗi khi thêm người dùng'));
    }
  };

  const handleEdit = (user) => {
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      password: '', // Không cần password khi sửa
    });
    setIsEditing(true);
    setShowForm(true); // Hiển thị form khi chỉnh sửa
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (err) {
        setError('Lỗi khi xóa người dùng');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      username: '',
      email: '',
      fullName: '',
      role: 'User',
      password: '',
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
    <div className="admin-users">
      <h2>Quản lý người dùng</h2>

      {/* Nút hiển thị/ẩn form */}
      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? 'Ẩn Form' : 'Thêm người dùng'}
      </button>

      {/* Form thêm/sửa người dùng */}
      {showForm && (
        <div className="form-card">
          <h3>{isEditing ? 'Sửa người dùng' : 'Thêm người dùng'}</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label>Tên đăng nhập:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Họ tên:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Vai trò:</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            {!isEditing && (
              <div>
                <label>Mật khẩu:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="form-actions">
              <button type="submit">{isEditing ? 'Cập nhật' : 'Thêm'}</button>
              <button type="button" onClick={toggleForm}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      {/* Bảng người dùng */}
      <div className="table-card">
        <h3>Danh sách người dùng</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Vai trò</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.fullName}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleEdit(user)} className="edit-button">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="delete-button">
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

export default AdminUsers;