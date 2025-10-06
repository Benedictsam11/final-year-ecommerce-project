import React from 'react';
import { Link } from 'react-router-dom'; // Used to link to product detail page
import './Outfit.css';

const Outfit = (props) => {
  // ✅ Calculate the discount percentage from the old and new prices
  const discount = ((props.old_price - props.new_price) / props.old_price) * 100;
  const discountPercentage = Math.round(discount); // Round the discount to a whole number

  return (
    // ✅ Clicking on the product card takes the user to its detail page
    <Link to={`/product/${props.id}`} className="outfit-link"> 
      <div className="outfit">
        {/* ✅ Product image */}
        <img src={props.image} alt="product" />

        {/* ✅ Product name */}
        <p>{props.name}</p>

        {/* ✅ Display pricing and discount */}
        <div className="outfit-prices">
          <div className="outfit-price-new">
            £{props.new_price} 
            <span className="discount">(-{discountPercentage}%)</span> {/* ✅ Show discount as % */}
          </div>
          <div className="outfit-price-old">£{props.old_price}</div> {/* ✅ Old price with strikethrough */}
        </div>
      </div>
    </Link>
  );
}

export default Outfit;
