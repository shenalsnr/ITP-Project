const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ProductRouter = require("../backend/route/Product_Routes/ProductRoutes");
const PaymentRouter = require("./route/PaymentRoute/PaymentRoute")
const router = require("./route/SupportRoute/SupportRoute");
const morgan = require("morgan");
const path = require("path");

require("dotenv").config();

const customerRoutes = require("./route/customerRoute"); 

const app = express();

// ==================== MIDDLEWARES ====================
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(morgan("dev"));
app.use(express.json()); 

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/customer", customerRoutes);  
app.use("/api/products",ProductRouter);

// ✅ 1) Allow ALL your dev frontends (5173 shop, 5174 admin, 5175 alt)
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ||
  "http://localhost:5173,http://localhost:5174,http://localhost:5175")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);



app.use(express.json());
app.use(morgan("dev"));

// Product Routes
const productRoutes = require("./route/Product_Routes/ProductRoutes");
app.use("/api/products", productRoutes);

// SellerInfo Routes
const sellerRoutes = require("./route/Seller_Info_Routes/SellerInfoRoutes");
app.use("/api/sellers", sellerRoutes);

// Payment Routes
// const paymentRouter = require("./src/Modules/Payment/Routes/PaymentRoute");
// app.use("/api/payments", paymentRouter);


//Support Routes
app.use("/supports", router);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ ok: true, time: new Date().toISOString() });
});

/* ---------- Routes ---------- */

app.use("/api/payments", PaymentRouter);

// 404 handler
app.use((req, _res, next) => {
  const err = new Error(`Not Found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
});



// Error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Server error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

// Connect to MongoDB and start server
mongoose.connect("mongodb+srv://Payment:1jhbgGMcW90YleAh@cluster0.bdfgnzh.mongodb.net/celoSpice?retryWrites=true&w=majority")
  .then(() => console.log("Connected to MongoDB"))
  .then(() => {
    app.listen(5000, () => console.log("Server running at http://localhost:5000"));
  })
  .catch(err => console.error("MongoDB connection error:", err));
