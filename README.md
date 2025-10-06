# 🛍️ Full-Stack MERN E-Commerce (Final Year Project)

A modern e-commerce platform built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
Features include authentication, cart & wishlist, promo codes, checkout (PayPal/COD), orders, and an admin dashboard with email notifications.

> **Repo:** https://github.com/Benedictsam11/final-year-ecommerce-project

---

## ✨ Key Features

### Shopper
- Register / Login / Logout / Password reset (JWT)
- Browse by category, search, sort & filter
- Cart and Wishlist with persistence
- Promo code support (e.g. `SPRING20`)
- Checkout with **PayPal** or **Cash on Delivery**
- Order history & status

### Admin
- Secure admin login
- Product CRUD + image uploads
- View/manage orders, update status
- **Email notifications** via Nodemailer

---

## 🧱 Monorepo Structure


---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Context API, (CSS/Tailwind)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (access/refresh pattern or single-token)
- **Payments:** PayPal SDK
- **Email:** Nodemailer
- **Hosting (suggested):** Vercel (frontend), Render (backend), MongoDB Atlas (DB)

---

## ⚙️ Getting Started (Local)

### 1) Clone
```bash
git clone https://github.com/Benedictsam11/final-year-ecommerce-project.git
cd final-year-ecommerce-project
cd backend && npm install
cd ../frontend && npm install
# (if you have a separate admin app)
cd ../admin && npm install
PORT=5000
MONGODB_URI=<your_mongodb_atlas_connection_string>
JWT_SECRET=<your_jwt_secret>
PAYPAL_CLIENT_ID=<your_paypal_client_id>
ADMIN_EMAIL=<admin_login_email_if_applicable>
ADMIN_PASSWORD=<admin_login_password_if_applicable>
SMTP_HOST=<if using SMTP>
SMTP_PORT=<if using SMTP>
SMTP_USER=<if using SMTP>
SMTP_PASS=<if using SMTP>
cd backend
npm run dev   # or: node index.js / nodemon
cd frontend
npm start

