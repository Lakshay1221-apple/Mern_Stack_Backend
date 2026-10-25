import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import '../pageStyles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/v1/product/${id}`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.product) {
          throw new Error(data.message || 'Product not found.');
        }

        setProduct(data.product);
        setReviews(data.product.reviews || []);
        setQuantity(1);
        setSelectedImage(0);
      } catch (requestError) {
        if (requestError.name === 'AbortError') {
          return;
        }

        console.error(
          'Error fetching product details:',
          requestError
        );

        setError(
          requestError.message || 'Unable to load product details.'
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <>
        <PageTitle title="Loading Product | Store" />
        <Navbar />

        <main className="product-details-container">
          <p className="product-loading">
            Loading product details...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <>
        <PageTitle title="Product Not Found | Store" />
        <Navbar />

        <main className="product-details-container">
          <p className="product-not-found">
            {error || 'Product not found.'}
          </p>
        </main>

        <Footer />
      </>
    );
  }

  // Normalize product images.
  const rawImages =
    product.images?.length > 0
      ? product.images
      : product.image || [];

  const images = (Array.isArray(rawImages)
    ? rawImages
    : [rawImages]
  )
    .map((image) =>
      typeof image === 'string' ? image : image?.url
    )
    .filter(Boolean);

  const currentImage = images[selectedImage];

  const stock = Math.max(0, Number(product.stock ?? 0));
  const inStock = stock > 0;

  const price = Number(product.price ?? 0);

  const rating = product.rating ?? product.Ratings;

  const numberOfReviews =
    product.numReviews ?? product.numOfReviews;

  // Quantity controls
  const handleQuantityChange = (value) => {
    setQuantity((currentQuantity) => {
      const nextQuantity = currentQuantity + value;

      return Math.max(1, Math.min(stock, nextQuantity));
    });
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!inStock || quantity > stock) {
      return;
    }

    // Replace this with your existing cart context or Redux action.
    console.log('Adding to cart:', {
      productId: product._id || product.id,
      productName: product.name,
      quantity,
      price,
      total: price * quantity,
    });
  };

  // Submit review
  const handleReviewSubmit = (event) => {
    event.preventDefault();

    const comment = review.trim();

    if (!comment) {
      return;
    }

    const newReview = {
      id: `${Date.now()}`,
      reviewerName: 'You',
      comment,
    };

    setReviews((previousReviews) => [
      ...previousReviews,
      newReview,
    ]);

    setReview('');
  };

  return (
    <>
      <PageTitle
        title={`${product.name || 'Product Details'} | Store`}
      />

      <Navbar />

      <main className="product-details-container">
        <div className="product-detail-container">
          {/* Product image gallery */}
          <section
            className="product-image-container"
            aria-label="Product images"
          >
            {currentImage ? (
              <img
                className="product-detail-image"
                src={currentImage}
                alt={product.name || 'Product image'}
              />
            ) : (
              <div className="product-image-placeholder">
                No image available
              </div>
            )}

            {images.length > 1 && (
              <div className="product-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`thumbnail-button ${
                      selectedImage === index ? 'selected' : ''
                    }`}
                    onClick={() => setSelectedImage(index)}
                    aria-label={`View product image ${index + 1}`}
                    aria-pressed={selectedImage === index}
                  >
                    <img
                      className="thumbnail-image"
                      src={image}
                      alt={`${product.name || 'Product'} ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Product information */}
          <section className="product-info">
            <h1 className="product-title">
              {product.name || 'Untitled Product'}
            </h1>

            {product.category && (
              <p className="product-category">
                Category: {product.category}
              </p>
            )}

            {rating != null && (
              <div className="rating">
                <span className="product-rating-value">
                  {Number(rating).toFixed(1)} ★
                </span>

                <span className="productCardSpan">
                  {numberOfReviews != null
                    ? `${numberOfReviews} reviews`
                    : 'Customer rating'}
                </span>
              </div>
            )}

            <hr className="product-divider" />

            <p className="product-price">
              ₹{price.toLocaleString('en-IN')}
            </p>

            {product.description && (
              <p className="product-description">
                {product.description}
              </p>
            )}

            <p
              className={`stock-status ${
                !inStock ? 'out-of-stock' : ''
              }`}
              aria-live="polite"
            >
              {inStock
                ? `${stock} available in stock`
                : 'Currently out of stock'}
            </p>

            {inStock && (
              <div className="quantity-controls">
                <span className="quantity-label">
                  Quantity:
                </span>

                <button
                  type="button"
                  className="quantity-button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span
                  className="quantity-value"
                  aria-live="polite"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  className="quantity-button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}

            <p className="product-total">
              Total: ₹
              {(price * quantity).toLocaleString('en-IN')}
            </p>

            <button
              type="button"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </section>

          {/* Customer reviews */}
          <section className="reviews-container">
            <h2>Customer Reviews</h2>

            <form
              className="review-form"
              onSubmit={handleReviewSubmit}
            >
              <label htmlFor="review-input">
                Write your review
              </label>

              <textarea
                id="review-input"
                className="review-input"
                placeholder="Share your experience with this product..."
                value={review}
                onChange={(event) =>
                  setReview(event.target.value)
                }
                required
              />

              <button
                type="submit"
                className="submit-review-btn"
              >
                Submit Review
              </button>
            </form>

            <div className="reviews-section">
              {reviews.length > 0 ? (
                reviews.map((item, index) => (
                  <article
                    className="review-item"
                    key={item._id || item.id || index}
                  >
                    <h3 className="reviewer-name">
                      {item.reviewerName ||
                        item.name ||
                        'Customer'}
                    </h3>

                    <p className="review-comment">
                      {item.comment || item.review}
                    </p>
                  </article>
                ))
              ) : (
                <p className="no-reviews">
                  No reviews yet. Be the first to review this
                  product!
                </p>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProductDetails;