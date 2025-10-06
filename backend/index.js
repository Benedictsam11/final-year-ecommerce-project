// ✅ Import necessary modules and environment variables
require('dotenv').config(); // Load environment variables from .env file
const express = require("express"); // Express framework to handle routes and middleware
const mongoose = require("mongoose"); // MongoDB ODM to interact with database
const jwt = require("jsonwebtoken"); // For creating and verifying JWT tokens
const multer = require("multer"); // To handle file uploads (e.g. product images)
const path = require("path"); // Node.js path module for file and folder paths
const cors = require("cors"); // To allow cross-origin requests
const nodemailer = require("nodemailer"); // To send emails (like order confirmations)


const app = express();  // Initialize Express app
const port = 4000;    // Define the port where server will run

// Middleware to parse JSON and handle CORS
app.use(express.json());
app.use(cors());

// ✅ Set up email transporter (using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bamiseben949@gmail.com',   // Sender email
    pass: 'hfje fraj sgik aqqm'       // App password (never share this publicly!)
  }
});

// ✅ Function to send order email to admin
const sendOrderEmail = (order) => {
  const itemsHtml = Object.entries(order.cartItems)
    .map(([key, quantity]) => {
      const [productId, size] = key.split('_'); // Extract product ID and size from item key
      return `<li>Product ID: ${productId}, Size: ${size}, Quantity: ${quantity}</li>`;
    }).join("");


// ✅ Function to send order confirmation email to admin
  const mailOptions = {
    from: 'bamiseben949@gmail.com',
    to: 'bamiseben949@gmail.com',
    subject: '🛒 New Order Received!',
    html: `
      <h2>New Order Placed</h2>
      <p><strong>User ID:</strong> ${order.userId}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>Delivery Info:</strong></p>
      <ul>
        <li>Name: ${order.deliveryInfo.fullName}</li>
        <li>Address: ${order.deliveryInfo.address}, ${order.deliveryInfo.city}, ${order.deliveryInfo.postalCode}, ${order.deliveryInfo.country}</li>
      </ul>
      <p><strong>Cart Items:</strong></p>
      <ul>${itemsHtml}</ul>
    `
  };

  // Send the email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) console.error("❌ Error sending order email:", err);
    else console.log("📧 Order email sent:", info.response);
  });
};

//  Connect to MongoDB
mongoose.connect("mongodb+srv://bamiseben949:Bamise2004.@cluster0.5h1odfo.mongodb.net/e-commerce");

// Simple route for server status
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

//  Configure image upload using multer
const storage = multer.diskStorage({
  destination: './upload/photos',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

//  Serve static files (uploaded images)
app.use('/photos', express.static('upload/photos'));

//  API endpoint to upload a photo
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/photos/${req.file.filename}`
  });
});

//  Define Product schema and model
const Product = mongoose.model("Product", {
  id: Number,
  name: String,
  image: String,
  category: String,
  new_price: Number,
  old_price: Number,
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});

// ✅ Endpoint to add a new product
app.post('/addproduct', async (req, res) => {
  const products = await Product.find({});
  const id = products.length ? products.slice(-1)[0].id + 1 : 1;

  const product = new Product({ id, ...req.body });
  await product.save();
  res.json({ success: true, name: req.body.name });
});

// Delete product by ID 
app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  res.json({ success: true, name: req.body.name });
});

// ✅ Endpoint to fetch all products (optionally by category)
app.get('/allproducts', async (req, res) => {
  const query = req.query.type ? { category: req.query.type } : {};
  const products = await Product.find(query);
  res.json(products);
});

// ✅ Define User schema and model
const Users = mongoose.model("Users", {
  name: String,
  email: { type: String, unique: true },
  password: String,
  cartData: Object,
  wishlistData: { type: [Object], default: [] },
  date: { type: Date, default: Date.now }
});

// ✅ Middleware to authenticate user via JWT
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token'); // Read token from header
  if (!token) return res.status(401).json({ errors: "Please authenticate using valid token" });

  try {
    const data = jwt.verify(token, 'secret_ecom'); // Verify token
    req.user = data.user;  // Add user data to request
    next();  // Proceed to next middleware
  } catch {
    return res.status(401).json({ errors: "Invalid token" });
  }
};

// Add to wishlist
app.post('/addtowishlist', async (req, res) => {
  const { userEmail, itemId, size } = req.body;
  if (!userEmail) return res.status(400).json({ success: false, message: "Email required" });

// Find or Create User
  let user = await Users.findOne({ email: userEmail }) || new Users({ name: "Guest", email: userEmail, password: "guest", cartData: {}, wishlistData: [] });
  // Avoid adding duplicate items
  if (user.wishlistData.find(item => item.id == itemId && item.size === size)) {
    return res.json({ success: false, message: "Already in wishlist" });
  }

  user.wishlistData.push({ id: itemId, size });
  await user.save();
  res.json({ success: true, message: "Item added to wishlist" });
});

// Remove from wishlist
app.post('/removefromwishlist', async (req, res) => {
  const { userEmail, itemId, size } = req.body;
  let user = await Users.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  user.wishlistData = user.wishlistData.filter(item => !(item.id == itemId && item.size === size));
  await user.save();
  res.json({ success: true, message: "Item removed" });
});

// Get wishlist items 
app.post('/getwishlist', async (req, res) => {
  const { userEmail } = req.body;
  let user = await Users.findOne({ email: userEmail });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const wishlistItems = user.wishlistData;
  const products = await Product.find({ id: { $in: wishlistItems.map(i => i.id) } });
  const enriched = wishlistItems.map(item => {
    const p = products.find(prod => prod.id === item.id);
    return p ? { ...p.toObject(), size: item.size } : { ...item, deleted: true };
  });
  res.json(enriched);
});

// Check if password is strong 
const isStrongPassword = (pw) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pw);

// Regsiter new User
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({ success: false, error: "Weak password" });
  }

  if (await Users.findOne({ email })) {
    return res.status(400).json({ success: false, error: "Email exists" });
  }

  const cart = {};
const user = new Users({
  name: username,
  email,
  password,
  cartData: {}, 
  wishlistData: []
});
  await user.save();

  const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
  res.json({ success: true, token });
});


// User login
app.post('/login', async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  if (!user || user.password !== req.body.password) {
    return res.json({ success: false, errors: "Wrong password" });
  }
  const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
  res.json({ success: true, token });
});

app.post('/sync-cart', fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    const newCart = req.body.cartData || {};

    //  Replace the cart instead of merging
    user.cartData = newCart;

    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Error in /sync-cart:", err);
    res.status(500).json({ success: false });
  }
});







// Sync guest cart and wishlist after login
app.post('/sync-guest-data', fetchUser, async (req, res) => {
  const { guestCart, guestWishlist } = req.body;

  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // to Ensure cartData is initialized
    if (!user.cartData) user.cartData = {};

    // Merge guestCart
    if (guestCart && typeof guestCart === 'object') {
      for (const key in guestCart) {
        if (guestCart.hasOwnProperty(key)) {
          user.cartData[key] = (user.cartData[key] || 0) + guestCart[key];
        }
      }
    }

    // Merge guestWishlist (avoid duplicates)
    if (Array.isArray(guestWishlist)) {
      guestWishlist.forEach(item => {
        if (!item || !item.id || !item.size) return; // skip malformed
        const exists = user.wishlistData.some(w => w.id === item.id && w.size === item.size);
        if (!exists) {
          user.wishlistData.push({ id: item.id, size: item.size });
        }
      });
    }

    await user.save();
    res.json({ success: true, message: "Guest data synced" });
  } catch (err) {
    console.error("❌ sync-guest-data error:", err);
    res.status(500).json({ success: false, message: "Server error during guest data sync" });
  }
});




// Send password reset email
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });

  if (!user) return res.status(404).json({ success: false, message: "Email not found" });

  const resetToken = jwt.sign({ id: user._id }, 'secret_reset', { expiresIn: '10m' });
const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const mailOptions = {
    from: 'bamiseben949@gmail.com',
    to: email,
    subject: '🔐 Password Reset Link',
    html: `<h3>Reset Your Password</h3>
           <p>Click the link below to reset your password:</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>This link will expire in 10 minutes.</p>`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) return res.status(500).json({ success: false, message: "Email failed to send" });
    res.json({ success: true, message: "Reset link sent to email" });
  });
});

// Reset password using token
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, 'secret_reset');
    const user = await Users.findById(decoded.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ success: false, message: "Weak password" });
    }

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
});



// Endpoints for latest products
app.get('/latestinmen', async (req, res) => {
  const items = await Product.find({ category: "men" }).sort({ date: -1 }).limit(4);
  res.json(items);
});
app.get('/latestinwomen', async (req, res) => {
  const items = await Product.find({ category: "women" }).sort({ date: -1 }).limit(4);
  res.json(items);
});
app.get('/latestinkid', async (req, res) => {
  const items = await Product.find({ category: "kid" }).sort({ date: -1 }).limit(4);
  res.json(items);
});

// Cart: add item
app.post('/addtocart', fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const itemKey = req.body.itemId;
    if (!itemKey) return res.status(400).json({ success: false, message: "itemId is required" });

    if (!user.cartData) user.cartData = {}; // 🛠️ Ensure cartData is defined

    user.cartData[itemKey] = (user.cartData[itemKey] || 0) + 1;
    await user.save();

    res.json({ success: true, message: "Added" });
  } catch (err) {
    console.error("Error in /addtocart:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Cart: remove item
app.post('/removefromcart', fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const itemKey = req.body.itemId;
    if (!itemKey || !user.cartData) return res.json({ success: false, message: "No cart data" });

    if (user.cartData[itemKey] > 0) {
      user.cartData[itemKey] -= 1;
      if (user.cartData[itemKey] === 0) delete user.cartData[itemKey];
    }

    await user.save();
    res.json({ success: true, message: "Removed" });
  } catch (err) {
    console.error("Error in /removefromcart:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Cart: get items
app.post('/getcart', fetchUser, async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (!user.cartData) {
      // fallback to empty cart
      return res.json({});
    }

    return res.json(user.cartData);
  } catch (err) {
    console.error("Error in /getcart:", err);
    return res.status(500).json({ error: "Server error" });
  }
});


// ✅ Order model
const Orders = mongoose.model("Orders", {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  deliveryInfo: { type: Object, required: true },
  paymentMethod: { type: String, required: true },
  cartItems: { type: Object, required: true },
  date: { type: Date, default: Date.now }
});

// Place order
app.post('/placeorder', fetchUser, async (req, res) => {
  const { deliveryInfo, paymentMethod, cartItems } = req.body;
  try {
// Filter out items with quantity <= 0
const filteredCartItems = Object.fromEntries(
  Object.entries(cartItems).filter(([key, quantity]) => quantity > 0)
);

// Prevent empty cart order
if (Object.keys(filteredCartItems).length === 0) {
  return res.status(400).json({ success: false, message: "Cart is empty" });
}

const order = new Orders({
  userId: req.user.id,
  deliveryInfo,
  paymentMethod,
  cartItems: filteredCartItems
});

await order.save();
sendOrderEmail({ ...order.toObject(), cartItems: filteredCartItems }); // Send filtered items to email
    res.json({ success: true, message: "Order saved" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to save order" });
  }
});

// Order history for user
app.get('/orderhistory', fetchUser, async (req, res) => {
  const orders = await Orders.find({ userId: req.user.id }).sort({ date: -1 });
  res.json({ success: true, orders });
});

// Admin: Get all users
app.get('/admin/users', async (req, res) => {
  const users = await Users.find().select('-password');
  res.json(users);
});

// Admin: Get all orders
app.get('/admin/orders', async (req, res) => {
  const orders = await Orders.find().sort({ date: -1 });
  res.json(orders);
});

// ✅ Start the server
app.listen(port, err => {
  if (err) console.error("Server error:", err);
  else console.log("Server Running on Port " + port);
});
