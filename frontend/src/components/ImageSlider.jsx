import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import '../componentStyles/ImageSlider.css';

const DEFAULT_SLIDES = [
  {
    id: 1,
    image: '/images/banner-1.jpg',
    alt: 'Fashion & Clothing - Discover trending seasonal apparel collections',
    title: 'New Season Fashion',
    subtitle: 'Explore the latest styles, exclusive arrivals, and wardrobe essentials.',
    category: 'Fashion & Apparel',
    buttonText: 'Shop Fashion',
    link: '/products',
  },
  {
    id: 2,
    image: '/images/banner-2.jpg',
    alt: 'Electronics & Gadgets - High performance gadgets, smart gear, and audio',
    title: 'Next-Gen Electronics',
    subtitle: 'Elevate your digital experience with state-of-the-art tech and accessories.',
    category: 'Tech & Gadgets',
    buttonText: 'Explore Tech',
    link: '/products',
  },
  {
    id: 3,
    image: '/images/banner-3.jpg',
    alt: 'Home & Lifestyle - Modern interior decor, cozy living, and furniture',
    title: 'Modern Living & Home',
    subtitle: 'Refresh your sanctuary with curated contemporary furniture and decor.',
    category: 'Home & Living',
    buttonText: 'Browse Home',
    link: '/products',
  },
  {
    id: 4,
    image: '/images/banner-4.jpg',
    alt: 'Special Offers & Seasonal Sale - Huge savings and limited-time holiday discounts',
    title: 'Seasonal Super Sale',
    subtitle: 'Unbeatable deals with up to 50% off select products. Limited time only!',
    category: 'Special Offers',
    buttonText: 'Grab Deals',
    link: '/products',
  },
];

// Fallback SVG data URI in case an external or missing image fails to load
const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="600" viewBox="0 0 1600 600"><rect width="100%" height="100%" fill="%232E2E3C"/><circle cx="800" cy="240" r="60" fill="%236C5B7B"/><rect x="700" y="340" width="200" height="24" rx="12" fill="%23F8B5B1"/><text x="50%" y="420" fill="%23EAE7E0" font-family="system-ui, sans-serif" font-size="28" font-weight="600" text-anchor="middle">Featured Collection</text></svg>';

const ImageSlider = ({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 4000,
  autoPlay = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const sliderRef = useRef(null);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Autoplay management
  useEffect(() => {
    if (!autoPlay || isPaused || totalSlides <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, isPaused, autoPlayInterval, nextSlide, totalSlides]);

  // Keyboard navigation when user is focused inside slider
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (diff > swipeThreshold) {
      nextSlide();
    } else if (diff < -swipeThreshold) {
      prevSlide();
    }
  };

  const handleImageError = (index) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <section
      ref={sliderRef}
      className="image-slider-container"
      aria-label="Homepage Promotions"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
    >
      {/* Slides Track */}
      <div
        className="slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const imgSrc = imageErrors[index] ? FALLBACK_IMAGE : slide.image;

          return (
            <div
              key={slide.id || index}
              className={`slider-item ${index === currentIndex ? 'active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${totalSlides}: ${slide.title || 'Slide'}`}
              aria-hidden={index !== currentIndex}
            >
              <div className="slider-image-wrapper">
                <img
                  src={imgSrc}
                  alt={slide.alt || slide.title || `Promotion banner ${index + 1}`}
                  className="slider-image"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  onError={() => handleImageError(index)}
                />
                <div className="slider-overlay" />
              </div>

              <div className="slider-content">
                {slide.category && (
                  <span className="slider-badge">{slide.category}</span>
                )}
                {slide.title && <h2 className="slider-title">{slide.title}</h2>}
                {slide.subtitle && (
                  <p className="slider-subtitle">{slide.subtitle}</p>
                )}
                {slide.buttonText && slide.link && (
                  <Link to={slide.link} className="slider-cta-btn">
                    {slide.buttonText}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {totalSlides > 1 && (
        <>
          <button
            type="button"
            className="slider-arrow slider-arrow-prev"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft fontSize="medium" />
          </button>
          <button
            type="button"
            className="slider-arrow slider-arrow-next"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight fontSize="medium" />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {totalSlides > 1 && (
        <div className="slider-dots" role="tablist" aria-label="Slide dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ImageSlider;
