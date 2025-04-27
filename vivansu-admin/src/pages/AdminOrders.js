import React, { useState, useEffect } from 'react';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/orderService';
import './AdminOrders.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    userId: '',
    productId: '',
    quantity: '',
    status: 'Pending',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError('Không thể tải đơn hàng');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateOrder(formData.id, {
          id: formData.id,
          status: formData.status,
        });
      } else {
        await createOrder({
          userId: parseInt(formData.userId),
          orderDetails: [
            {
              productId: parseInt(formData.productId),
              quantity: parseInt(formData.quantity),
            },
          ],
        });
      }
      resetForm();
      fetchOrders();
      setShowForm(false);
    } catch (err) {
      if (err.response?.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'string') {
          setError(errorData);
        } else if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).flat().join(', ');
          setError(errorMessages || errorData.title || 'Lỗi không xác định');
        } else {
          setError(errorData || 'Lỗi không xác định');
        }
      } else {
        setError(isEditing ? 'Lỗi khi cập nhật đơn hàng' : 'Lỗi khi thêm đơn hàng');
      }
    }
  };

  const handleEdit = (order) => {
    setFormData({
      id: order.id,
      userId: order.userId,
      productId: '',
      quantity: '',
      status: order.status,
    });
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      try {
        await deleteOrder(id);
        fetchOrders();
      } catch (err) {
        setError('Lỗi khi xóa đơn hàng');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      userId: '',
      productId: '',
      quantity: '',
      status: 'Pending',
    });
    setIsEditing(false);
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    if (showForm) {
      resetForm();
    }
  };

  return (
    <div className="admin-orders">
      <h2>Quản lý đơn hàng</h2>

      {/* Nút hiển thị/ẩn form */}
      <button className="toggle-form-button" onClick={toggleForm}>
        {showForm ? 'Ẩn Form' : 'Thêm đơn hàng'}
      </button>

      {/* Form thêm/sửa đơn hàng */}
      {showForm && (
        <div className="form-card">
          <h3>{isEditing ? 'Sửa đơn hàng' : 'Thêm đơn hàng'}</h3>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            {!isEditing && (
              <>
                <div>
                  <label>ID Người dùng:</label>
                  <input
                    type="number"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>ID Sản phẩm:</label>
                  <input
                    type="number"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Số lượng:</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>
              </>
            )}
            <div>
              <label>Trạng thái:</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit">{isEditing ? 'Cập nhật' : 'Thêm'}</button>
              <button type="button" onClick={toggleForm}>Hủy</button>
            </div>
          </form>
        </div>
      )}

      {/* Bảng đơn hàng */}
      <div className="table-card">
        <h3>Danh sách đơn hàng</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Người dùng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {order.user?.username} ({order.userId})
                </td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>{order.totalAmount}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => handleEdit(order)} className="edit-button">
                    Sửa
                  </button>
                  <button onClick={() => handleDelete(order.id)} className="delete-button">
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

export default AdminOrders;