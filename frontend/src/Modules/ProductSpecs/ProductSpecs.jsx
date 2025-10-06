import React, { useState } from "react";
import "./ProductSpecs.css";

const ProductSpecs = () => {
  const [activeTab, setActiveTab] = useState("spec");
  const [reviews, setReviews] = useState([
    { id: 1, name: "Sarah L.", rating: 5, comment: "Great quality product!" },
    { id: 2, name: "John D.", rating: 4, comment: "Really comfortable and stylish." },
    { id: 3, name: "Emily R.", rating: 5, comment: "Super fast delivery! Loved it." }
  ]);
  const [newReview, setNewReview] = useState({ name: "", rating: "", comment: "" });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReview.name && newReview.rating && newReview.comment) {
      const newId = reviews.length + 1;
      setReviews([...reviews, { id: newId, ...newReview }]);
      setNewReview({ name: "", rating: "", comment: "" });
    }
  };

  return (
    <div className="productspec">
      {/* Navigation Tabs */}
      <div className="productspec-navigator">
        <div
          className={`productspec-nav-box ${activeTab === "spec" ? "active" : ""}`}
          onClick={() => setActiveTab("spec")}
        >
          Spec
        </div>
        <div
          className={`productspec-nav-box ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews ({reviews.length})
        </div>
      </div>

      {/* Tab Content */}
      <div className="productspec-product">
        {activeTab === "spec" ? (
          <>
            <p>
              In today’s digital world, online shopping has transformed the way we buy products. 
              Our e-commerce platform is designed to provide a seamless and hassle-free shopping experience.
            </p>
            <p>
              Whether you're looking for the latest fashion trends, must-have accessories, or essential lifestyle 
              products, our store has something for everyone.
            </p>
          </>
        ) : (
          <div className="reviews-section">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <h4>{review.name} ⭐ {review.rating}/5</h4>
                <p>{review.comment}</p>
              </div>
            ))}

            {/* Review Submission Form */}
            <form className="review-form" onSubmit={handleReviewSubmit}>
              <h3>Leave a Review</h3>
              <input
                type="text"
                placeholder="Your Name"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                required
              />
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                required
              >
                <option value="">Rating</option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Poor</option>
                <option value="1">1 - Terrible</option>
              </select>
              <textarea
                placeholder="Your Review"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
              ></textarea>
              <button type="submit">Submit Review</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSpecs;
