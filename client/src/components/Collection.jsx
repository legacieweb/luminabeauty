import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import WishlistButton from './WishlistButton';

const Collection = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products');
        // Filter by category (case-insensitive)
        const filtered = res.data.filter(p => 
          p.category.toLowerCase() === category.toLowerCase()
        );
        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div className="collection-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5%' }}>
        <header className="page-header">
          <span>Essential Rituals</span>
          <h1>{category}</h1>
          <p>
            Discover our curated selection of high-performance {category} essentials, meticulously crafted for the discerning individual.
          </p>
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>Loading Collection...</div>
        ) : (
          <div className="product-grid">
            {products.length > 0 ? products.map(product => (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} />
                    {product.stock <= 0 && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(217, 83, 79, 0.9)',
                        color: 'white',
                        padding: '4px 8px',
                        fontSize: '0.7rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        borderRadius: '2px',
                        letterSpacing: '1px'
                      }}>
                        Out of Stock
                      </div>
                    )}
                    <WishlistButton product={product} />
                  </div>
                  <div className="product-info">
                    <p className="product-category">{product.category}</p>
                    <h3>{product.name}</h3>
                    <p className="price">${product.price}</p>
                  </div>
                </Link>
              </div>
            )) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: '#888' }}>
                No products found in this collection.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
