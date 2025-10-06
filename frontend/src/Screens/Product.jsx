import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopStore } from '../Store/ShopStore'; // Global state/context
import Wayfinder from '../Modules/Wayfinder/Wayfinder'; // Breadcrumb navigation
import ProductCard from '../Modules/ProductCard/ProductCard'; // Product image, price, actions
import ProductSpecs from '../Modules/ProductSpecs/ProductSpecs'; // Spec + review tabs
import SimilarProducts from '../Modules/SimilarProducts/SimilarProducts'; // Related products
import './CSS/Product.css';

const Product = () => {
  // Get global product data from context
  const { data_products } = useContext(ShopStore);

  // Get the product ID from the URL route (e.g. /product/:productId)
  const { productId } = useParams();

  // Find the specific product by ID (ensures both are strings for safety)
  const product = data_products.find((e) => String(e.id) === String(productId));

  // Scroll to top when component loads or productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Show loading message if product data hasn't loaded yet
  if (data_products.length === 0) {
    return <div>Loading product details...</div>;
  }

  // Show fallback if product is not found (invalid or deleted)
  if (!product) {
    return <div>Sorry, this product is unavailable.</div>;
  }

  return (
    <div className="product-page">
      {/* Breadcrumb-like navigation showing category > product name */}
      <Wayfinder product={product} />

      {/* Main product card: image, title, price, cart/wishlist buttons */}
      <ProductCard product={product} />

      {/* Tabbed specs section: description, delivery info, reviews */}
      <ProductSpecs product={product} />

      {/* Section to show 4 similar products based on category */}
      <SimilarProducts category={product.category} excludeId={product.id} />
    </div>
  );
};

export default Product;
