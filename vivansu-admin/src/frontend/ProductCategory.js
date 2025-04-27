// src/frontend/ProductCategory.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import Header from '../components/Header.js';
import './ProductCategory.css';

const ProductCategory = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts(id);
        const productData = Array.isArray(response) ? response : response.data || [];
        console.log("Sản phẩm trong danh mục:", productData);
        setProducts(productData);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi lấy sản phẩm danh mục:", err);
        setError(err.message || 'Không thể tải sản phẩm.');
        setLoading(false);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-category">
      <Header />
      <Link to="/" className="back-link">Quay lại trang chủ</Link>
      <h1>Sản phẩm trong danh mục</h1>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => window.location.href = `/product/${product.id}`}
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
          <div>Không tìm thấy sản phẩm nào trong danh mục này!</div>
        )}
      </div>
    </div>
  );
};

export default ProductCategory;