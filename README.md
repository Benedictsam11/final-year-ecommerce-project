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
final-year-ecommerce-project/
├─ backend/ # Express API, MongoDB, Nodemailer, PayPal server logic
├─ frontend/ # React app (shop UI)
└─ admin/ # (Optional) separate admin UI if used



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

