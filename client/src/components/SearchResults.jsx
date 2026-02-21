import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import WishlistButton from './WishlistButton';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/products');
        const filtered = res.data.filter(p => 
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filtered);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query]);

  return (
    <div className="search-results-page" style={{ paddingTop: '10rem', paddingBottom: '5rem' }}>
      <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5%' }}>
        <header className="page-header">
          <span>Search Results</span>
          <h1>
            {query ? `Results for "${query}"` : 'Search Products'}
          </h1>
          {query && (
            <p>
              Found {products.length} {products.length === 1 ? 'product' : 'products'} matching your search
            </p>
          )}
        </header>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>Searching...</div>
        ) : query && products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#888' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No products found</h2>
            <p>Try searching for something else</p>
          </div>
        ) : !query ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#888' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Search for products</h2>
            <p>Use the search bar in the navigation to find products</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <div key={product._id} className="product-card">
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="product-image-container">
                    <img src={product.image} alt={product.name} />
                    <WishlistButton product={product} />
                  </div>
                  <div className="product-info">
                    <p className="product-category">{product.category}</p>
                    <h3>{product.name}</h3>
                    <p className="price">${product.price}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;