// ======================================================
// SmartBuy Enterprise Admin Controller
// ======================================================

// Models

const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Transaction = require("../models/Transaction");
const Withdrawal = require("../models/Withdrawal");
const Warehouse = require("../models/Warehouse");
const Inventory = require("../models/Inventory");
const Review = require("../models/Review");
const Supplier = require("../models/Supplier");
const Coupon = require("../models/Coupon");
const Wishlist = require("../models/Wishlist");
const Cart = require("../models/Cart");
const Notification = require("../models/Notification");
const KYC = require("../models/KYC");
// ======================================================
// Dashboard Overview
// ======================================================

exports.dashboardOverview = async (req, res) => {

    try {

        // User Statistics
        const totalUsers = await User.countDocuments();

        const totalCustomers = await User.countDocuments({
            role: "customer"
        });

        const totalSellers = await User.countDocuments({
            role: "seller"
        });

        const totalAdmins = await User.countDocuments({
            role: {
                $in: [
                    "admin",
                    "super-admin"
                ]
            }
        });

        // Product Statistics
        const totalProducts = await Product.countDocuments();

        const totalCategories = await Category.countDocuments();

        const totalBrands = await Brand.countDocuments();

        // Order Statistics
        const totalOrders = await Order.countDocuments();

        // Revenue
        const totalTransactions = await Transaction.countDocuments();

        const totalWithdrawals = await Withdrawal.countDocuments();

        // Inventory
        const totalWarehouses = await Warehouse.countDocuments();

        const totalInventory = await Inventory.countDocuments();

        // Others
        const totalReviews = await Review.countDocuments();

        const totalSuppliers = await Supplier.countDocuments();

        const totalCoupons = await Coupon.countDocuments();

        const totalWishlists = await Wishlist.countDocuments();

        const totalCarts = await Cart.countDocuments();

        const totalNotifications = await Notification.countDocuments();

        const totalKYC = await KYC.countDocuments();

        return res.status(200).json({

            success: true,

            dashboard: {

                users: {

                    totalUsers,

                    totalCustomers,

                    totalSellers,

                    totalAdmins

                },

                products: {

                    totalProducts,

                    totalCategories,

                    totalBrands

                },

                orders: {

                    totalOrders

                },

                finance: {

                    totalTransactions,

                    totalWithdrawals

                },

                inventory: {

                    totalWarehouses,

                    totalInventory

                },

                others: {

                    totalReviews,

                    totalSuppliers,

                    totalCoupons,

                    totalWishlists,

                    totalCarts,

                    totalNotifications,

                    totalKYC

                }

            }

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
