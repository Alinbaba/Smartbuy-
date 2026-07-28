const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// ==========================
// Middleware
// ==========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ==========================
// API Routes
// ==========================

app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/shipping", require("./routes/shipping"));
app.use("/api/notification", require("./routes/notification"));
app.use("/api/address", require("./routes/address"));
app.use("/api/wishlist", require("./routes/wishlist"));
app.use("/api/coupons", require("./routes/coupon"));
app.use("/api/inventory", require("./routes/inventory"));
app.use("/api/warehouses",require("./routes/warehouse"));
app.use("/api/suppliers", require("./routes/suppliers"));
app.use("/api/purchase-orders", require("./routes/purchaseOrder"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/brands", require("./routes/brand"));
app.use("/api/users", require("./routes/user"));
app.use("/api/wallets", require("./routes/wallet"));
app.use("/api/transactions", require("./routes/transaction"));
app.use("/api/withdrawals", require("./routes/withdrawal"));
app.use("/api/kyc", require("./routes/kyc"));
app.use("/api/audit-logs", require("./routes/auditLog"));
// ==========================
// Home Route
// ==========================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message: "Welcome to SmartBuy API"

    });

});
// Global ErrorHandler
app.use(errorHandler);
// ==========================
// Start Server
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 SmartBuy Server running on port ${PORT}`);

});
