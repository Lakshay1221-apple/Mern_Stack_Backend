
import { useEffect } from 'react';

import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ImageSlider from '../components/ImageSlider';
import Product from '../components/Product';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

import '../pageStyles/Home.css';
import PageTitle from '../components/PageTitle';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { getProduct, removeErrors } from '../features/products/productSlice';

const Home = () => {
  const { products, loading, error } = useSelector((state) => state.product);

  const addToCart = (product) => {
    // Connect this handler to your existing cart state/API.
    console.log('Adding product to cart:', product);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || error, {
        position: 'top-center',
        autoClose: 3000,
        theme: 'colored',
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
{  loading ? (<Loader/>) :(  <>
    <PageTitle title="Home - E-commerce Store" />
      <Navbar />

      <ImageSlider />

      <main className="home-container">
        <h2 className="home-heading">Trending Now</h2>

        {loading && <p>Loading products...</p>}

        {error && <p>{error.message || error}</p>}

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
   ) }</>
  )
}

export default Home;
