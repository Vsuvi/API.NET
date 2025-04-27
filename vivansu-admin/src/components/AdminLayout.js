import React, { useContext } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaTachometerAlt, FaBox, FaList, FaUsers, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import './AdminLayout.css';

function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Adminator</h3>
        </div>
        <ul className="sidebar-menu">
          <li>
            <Link to="/admin/dashboard">
              <FaTachometerAlt className="menu-icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/products">
              <FaBox className="menu-icon" /> Products
            </Link>
          </li>
          <li>
            <Link to="/admin/categories">
              <FaList className="menu-icon" /> Categories
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <FaUsers className="menu-icon" /> Users
            </Link>
          </li>
          <li>
            <Link to="/admin/orders">
              <FaShoppingCart className="menu-icon" /> Orders
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt className="menu-icon" /> Logout
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h2>Adminator</h2>
          </div>
          <div className="header-right">
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
            </div>
            <div className="user-info">
              <span>{user?.username || 'Admin'}</span>
              <img src="https://via.placeholder.com/40" alt="User Avatar" className="user-avatar" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;