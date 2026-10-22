
import { useEffect, useState } from 'react';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ImageSlider from '../components/ImageSlider';
import Product from '../components/Product';

import '../pageStyles/Home.css';
import PageTitle from '../components/PageTitle';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getProduct } from '../features/products/productSlice';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/v1/products');
        const contentType = response.headers.get('content-type') || '';

        if (!response.ok) {
          throw new Error(
            `Product request failed (${response.status} ${response.statusText})`,
          );
        }

        if (!contentType.includes('application/json')) {
          throw new Error(
            `Product request returned an unexpected content type: ${contentType || 'unknown'}`,
          );
        }

        const data = await response.json();
        const fetchedProducts = Array.isArray(data) ? data : data?.products;

        if (!Array.isArray(fetchedProducts)) {
          throw new Error('Product response did not contain a products array');
        }

        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Unable to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    // Connect this handler to your existing cart state/API.
    console.log('Adding product to cart:', product);
  }

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProduct()); 
  }, [dispatch]);

  return (
    <>
    <PageTitle title="Home - E-commerce Store" />
      <Navbar />

      <ImageSlider />

      <main className="home-container">
        <h2 className="home-heading">Trending Now</h2>

        {loading && <p>Loading products...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p>No products available right now.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <section className="product-grid">
            {products.map((product) => (
              <Product
                key={product._id || product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Home;
