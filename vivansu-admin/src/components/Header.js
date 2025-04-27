// src/frontend/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Vi Văn Sứ</Link>
      </div>
      <nav className="nav">
        <Link to="/" className="nav-button">Trang Chủ</Link>
        <Link to="/products" className="nav-button">Sản Phẩm</Link>
        <Link to="/cart" className="nav-button">Giỏ Hàng</Link>
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout} className="nav-button">Đăng Xuất</button>
            {isAdmin && (
              <Link to="/admin" className="nav-button">Quản Lý</Link>
            )}
          </>
        ) : (
          <Link to="/login" className="nav-button">Đăng Nhập</Link>
        )}
      </nav>
    </header>
  );
};

export default Header;