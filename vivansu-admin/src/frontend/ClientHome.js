// src/frontend/ClientHome.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import Header from '../components/Header.js';
import Footer from './Footer';
import './ClientHome.css';

const ClientHome = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const categoryResponse = await getCategories();
        const categoryData = Array.isArray(categoryResponse)
          ? categoryResponse
          : categoryResponse.data || [];
        console.log("Danh mục:", categoryData);
        setCategories(categoryData);

        const productResponse = await getProducts();
        const productData = Array.isArray(productResponse)
          ? productResponse
          : productResponse.data || [];
        console.log("Sản phẩm:", productData);
        setProducts(productData);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
        setError(err.message || 'Không thể tải dữ liệu.');
        setLoading(false);
        setProducts([]);
      }
    };

    fetchData();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryChange = (categoryId) => {
    if (categoryId === 'all') {
      navigate('/');
    } else {
      navigate(`/category/${categoryId}`);
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="client-home">
      <Header />
      <div className="category-filter">
        <label htmlFor="category">Chọn danh mục: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => {
            console.log("Danh mục được chọn:", e.target.value);
            setSelectedCategory(e.target.value);
            handleCategoryChange(e.target.value);
          }}
        >
          <option value="all">Tất cả</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <h1>Chào mừng đến với cửa hàng của chúng tôi</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={product.image || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="product-image"
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">{product.price?.toLocaleString('vi-VN')} VNĐ</p>
            </div>
          ))
        ) : (
          <div>Không tìm thấy sản phẩm nào!</div>
        )}
      </div>
      <Footer /> {/* Thêm Footer */}
    </div>
  );
};

export default ClientHome;