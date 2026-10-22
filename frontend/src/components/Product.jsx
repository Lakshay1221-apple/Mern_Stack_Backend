
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rating, IconButton, Tooltip } from '@mui/material';
import { Favorite, FavoriteBorder, ShoppingCart } from '@mui/icons-material';

import '../componentStyles/Product.css';

const Product = ({ product, onAddToCart }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const {
    _id,
    id,
    title,
    name,
    description,
    price,
    image,
    rating,
    Ratings,
    numReviews,
    numOfReviews,
    countInStock,
    stock,
  } = product;

  const productId = _id || id;
  const productName = title || name || 'Unnamed Product';
  const productImage =
    (Array.isArray(image) ? image[0]?.url : image) ||
    'https://placehold.co/300x200?text=Product';
  const productRating = rating ?? Ratings;
  const reviewsCount = numReviews ?? numOfReviews;
  const productStock = countInStock ?? stock;

  const handleAddToCart = () => {
    if (productStock === 0) return;

    if (onAddToCart) {
      onAddToCart(product);
      setAdded(true);

      setTimeout(() => {
        setAdded(false);
      }, 1500);
    }
  };

  const handleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <div className="product-card">

      {/* Product Image */}
      <div className="product-image-container">
        <Link
          to={`/product/${productId}`}
          className="product_id"
          aria-label={`View ${productName}`}
        >
          <img
            src={productImage}
            alt={productName}
            className="product-image-card"
            loading="lazy"
          />
        </Link>

        {/* Wishlist Button */}
        <Tooltip title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}>
          <IconButton
            onClick={handleFavorite}
            aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            className="favorite-button"
          >
            {isFavorite ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </Tooltip>
      </div>

      {/* Product Details */}
      <div className="product-details">

        <Link
          to={`/product/${productId}`}
          className="product_id"
        >
          <h3 className="product-title">
            {productName}
          </h3>
        </Link>

        <p className="product-description">
          {description
            ? description.length > 90
              ? `${description.slice(0, 90)}...`
              : description
            : 'Discover this amazing product.'}
        </p>

        {/* Rating */}
        <div className="rating_container">
          <Rating
            value={Number(productRating) || 0}
            precision={0.5}
            readOnly
            size="small"
          />

          <span>
            ({reviewsCount ?? 0})
          </span>
        </div>

        {/* Price */}
        <p className="home-price">
          ₹{Number(price || 0).toLocaleString('en-IN')}
        </p>

        {/* Add to Cart */}
        <button
          type="button"
          className="add-to-cart"
          onClick={handleAddToCart}
          disabled={productStock === 0}
        >
          <ShoppingCart fontSize="small" />

          {productStock === 0
            ? 'Out of Stock'
            : added
              ? 'Added to Cart ✓'
              : 'Add to Cart'}
        </button>

      </div>
    </div>
  );
};

export default Product;
