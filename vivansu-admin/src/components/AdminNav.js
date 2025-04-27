import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AdminNav() {
  const { logout } = useContext(AuthContext);

  return (
    <nav style={{ marginBottom: '20px' }}>
      <ul style={{ listStyle: 'none', padding: 0, display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <li>
          <Link to="/admin/products">Sản phẩm</Link>
        </li>
        <li>
          <Link to="/admin/categories">Danh mục</Link>
        </li>
        <li>
          <Link to="/admin/users">Người dùng</Link>
        </li>
        <li>
          <Link to="/admin/orders">Đơn hàng</Link>
        </li>
        <li>
          <button onClick={logout} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
            Đăng xuất
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNav;