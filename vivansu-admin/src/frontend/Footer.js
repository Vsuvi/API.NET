// src/frontend/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Cột 1: Giới thiệu */}
        <div className="footer-column">
          <h3>Cửa Hàng</h3>
          <p>
            Chào mừng bạn đến với Cửa Hàng! Chúng tôi cung cấp các sản phẩm chất lượng cao với giá cả hợp lý. Hãy khám phá ngay!
          </p>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div className="footer-column">
          <h3>Liên Kết Nhanh</h3>
          <ul>
            <li>
              <Link to="/">Trang Chủ</Link>
            </li>
            <li>
              <Link to="/products">Sản Phẩm</Link>
            </li>
            <li>
              <Link to="/cart">Giỏ Hàng</Link>
            </li>
            <li>
              <Link to="/login">Đăng Nhập</Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div className="footer-column">
          <h3>Liên Hệ</h3>
          <p>Email: support@cuahang.com</p>
          <p>Điện thoại: (+84) 123 456 789</p>
          <p>Địa chỉ: 123 Đường ABC, TP. Hồ Chí Minh</p>
        </div>

        {/* Cột 4: Theo dõi */}
        <div className="footer-column">
          <h3>Theo Dõi Chúng Tôi</h3>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>

      {/* Bản quyền */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Cửa Hàng. Tất cả quyền được bảo lưu.</p>
      </div>
    </footer>
  );
};

export default Footer;