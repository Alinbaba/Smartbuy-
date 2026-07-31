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

// ======================================================
// Dashboard Statistics
// ======================================================

exports.dashboardStatistics = async (req, res) => {

    try {

        // ==================================================
        // User Statistics
        // ==================================================

        const totalUsers = await User.countDocuments();

        const activeUsers = await User.countDocuments({
            isActive: true
        });

        const inactiveUsers = await User.countDocuments({
            isActive: false
        });

        // ==================================================
        // Product Statistics
        // ==================================================

        const totalProducts = await Product.countDocuments();

        const activeProducts = await Product.countDocuments({
            status: "active"
        });

        const inactiveProducts = await Product.countDocuments({
            status: "inactive"
        });

        // ==================================================
        // Order Statistics
        // ==================================================

        const pendingOrders = await Order.countDocuments({
            orderStatus: "pending"
        });

        const processingOrders = await Order.countDocuments({
            orderStatus: "processing"
        });

        const shippedOrders = await Order.countDocuments({
            orderStatus: "shipped"
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            orderStatus: "cancelled"
        });

        // ==================================================
        // Financial Statistics
        // ==================================================

        const totalPayments = await Payment.countDocuments();

        const totalTransactions = await Transaction.countDocuments();

        const totalWithdrawals = await Withdrawal.countDocuments();

        // ==================================================
        // Return Dashboard Statistics
        // ==================================================

        return res.status(200).json({

            success: true,

            statistics: {

                users: {

                    totalUsers,

                    activeUsers,

                    inactiveUsers

                },

                products: {

                    totalProducts,

                    activeProducts,

                    inactiveProducts

                },

                orders: {

                    pendingOrders,

                    processingOrders,

                    shippedOrders,

                    deliveredOrders,

                    cancelledOrders

                },

                finance: {

                    totalPayments,

                    totalTransactions,

                    totalWithdrawals

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

// ======================================================
// Dashboard Statistics
// ======================================================

exports.dashboardStatistics = async (req, res) => {

    try {

        // ==================================================
        // User Statistics
        // ==================================================

        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const inactiveUsers = await User.countDocuments({ isActive: false });

        // ==================================================
        // Product Statistics
        // ==================================================

        const totalProducts = await Product.countDocuments();

        // ==================================================
        // Category Statistics
        // ==================================================

        const totalCategories = await Category.countDocuments();

        // ==================================================
        // Brand Statistics
        // ==================================================

        const totalBrands = await Brand.countDocuments();

        // ==================================================
        // Order Statistics
        // ==================================================

        const totalOrders = await Order.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: "pending"
        });

        const processingOrders = await Order.countDocuments({
            orderStatus: "processing"
        });

        const shippedOrders = await Order.countDocuments({
            orderStatus: "shipped"
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            orderStatus: "cancelled"
        });

        // ==================================================
        // Finance Statistics
        // ==================================================

        const totalTransactions = await Transaction.countDocuments();

        const totalWithdrawals = await Withdrawal.countDocuments();

        // ==================================================
        // Response
        // ==================================================

        return res.status(200).json({

            success: true,

            statistics: {

                users: {

                    totalUsers,
                    activeUsers,
                    inactiveUsers

                },

                products: {

                    totalProducts,
                    totalCategories,
                    totalBrands

                },

                orders: {

                    totalOrders,
                    pendingOrders,
                    processingOrders,
                    shippedOrders,
                    deliveredOrders,
                    cancelledOrders

                },

                finance: {

                    totalTransactions,
                    totalWithdrawals

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

// ======================================================
// Recent Activities
// ======================================================

exports.getRecentActivities = async (req, res) => {

    try {

        // ==================================================
        // Recent Users
        // ==================================================

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("fullName email role createdAt");

        // ==================================================
        // Recent Orders
        // ==================================================

        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5);

        // ==================================================
        // Recent Products
        // ==================================================

        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("name price createdAt");

        // ==================================================
        // Recent Transactions
        // ==================================================

        const recentTransactions = await Transaction.find()
            .sort({ createdAt: -1 })
            .limit(5);

        // ==================================================
        // Response
        // ==================================================

        return res.status(200).json({

            success: true,

            activities: {

                recentUsers,

                recentOrders,

                recentProducts,

                recentTransactions

            }

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }
};

// ======================================================
// Dashboard Notifications
// ======================================================

exports.getDashboardNotifications = async (req, res) => {

    try {

        // ==================================================
        // Recent Notifications
        // ==================================================

        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .limit(20);

        // ==================================================
        // Unread Notifications
        // ==================================================

        const unreadCount = await Notification.countDocuments({

            isRead: false

        });

        // ==================================================
        // Response
        // ==================================================

        return res.status(200).json({

            success: true,

            unreadCount,

            totalNotifications: notifications.length,

            notifications

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Dashboard Quick Actions
// ======================================================

exports.getQuickActions = async (req, res) => {

    try {

        const quickActions = [

            {
                title: "Add Product",
                icon: "package",
                route: "/admin/products/create"
            },

            {
                title: "Add Category",
                icon: "grid",
                route: "/admin/categories/create"
            },

            {
                title: "View Orders",
                icon: "shopping-cart",
                route: "/admin/orders"
            },

            {
                title: "Manage Users",
                icon: "users",
                route: "/admin/users"
            },

            {
                title: "Finance Dashboard",
                icon: "credit-card",
                route: "/admin/finance"
            },

            {
                title: "Warehouse",
                icon: "warehouse",
                route: "/admin/warehouses"
            },

            {
                title: "Reports",
                icon: "bar-chart",
                route: "/admin/reports"
            },

            {
                title: "AI Assistant",
                icon: "cpu",
                route: "/admin/ai"

            }

        ];

        return res.status(200).json({

            success: true,

            total: quickActions.length,

            quickActions

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get All Users
// ======================================================

exports.getAllUsers = async (req, res) => {

    try {

        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        return res.status(200).json({

            success: true,

            total: users.length,

            users

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Single User
// ======================================================

exports.getSingleUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
            .select("-password");

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        return res.status(200).json({

            success: true,

            user

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Update User
// ======================================================

exports.updateUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        // ==================================================
        // Update User Fields
        // ==================================================

        Object.assign(user, req.body);

        await user.save();

        return res.status(200).json({

            success: true,

            message: "User updated successfully.",

            user

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Block User
// ======================================================

exports.blockUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        // ==================================================
        // Block User
        // ==================================================

        user.isActive = false;

        await user.save();

        return res.status(200).json({

            success: true,

            message: "User has been blocked successfully.",

            user

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
