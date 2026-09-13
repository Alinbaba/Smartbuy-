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
const { Parser } = require("json2csv");
const Wallet = require("../models/Wallet");
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
const exportService = require("../services/exportService");
const createAuditLog = require("../utils/auditLog");
const executeFinancialTransaction = require("../utils/financialTransaction");

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

// ======================================================
// Unblock User
// ======================================================

exports.unblockUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        // ======================================================
// Change User Role
// ======================================================

exports.changeUserRole = async (req, res) => {

    try {

        const { role } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }

        // ==================================================
        // Allowed Roles
        // ==================================================

        const allowedRoles = [

            "customer",
            "seller",
            "customer-care",
            "finance-admin",
            "advertising-admin",
            "security-admin",
            "warehouse-admin",
            "logistics-admin",
            "vendor-manager",
            "ai-admin",
            "admin",
            "super-admin"

        ];

        if (!allowedRoles.includes(role)) {

            return res.status(400).json({

                success: false,

                message: "Invalid role."

            });

        }

        // ==================================================
        // Update Role
        // ==================================================

        user.role = role;

        await user.save();

        return res.status(200).json({

            success: true,

            message: "User role updated successfully.",

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
// Delete User
// ======================================================

exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);


        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found."

            });

        }


        // ==================================================
        // Delete User
        // ==================================================

        await user.deleteOne();


        return res.status(200).json({

            success: true,

            message: "User deleted successfully."

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Search & Pagination Users
// ======================================================

exports.searchUsers = async (req, res) => {

    try {

        // ==================================================
        // Query Parameters
        // ==================================================

        const {
            search = "",
            page = 1,
            limit = 20
        } = req.query;


        // ==================================================
        // Search Filter
        // ==================================================

        const filter = {

            $or: [

                {
                    fullName: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    phone: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    username: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ]

        };


        // ==================================================
        // Pagination Calculation
        // ==================================================

        const skip = (page - 1) * limit;


        // ==================================================
        // Get Users
        // ==================================================

        const users = await User.find(filter)

            .select("-password")

            .skip(skip)

            .limit(Number(limit))

            .sort({
                createdAt: -1
            });



        const totalUsers = await User.countDocuments(filter);



        return res.status(200).json({

            success: true,

            totalUsers,

            currentPage: Number(page),

            totalPages: Math.ceil(totalUsers / limit),

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
// User Analytics Dashboard
// ======================================================

exports.userAnalytics = async (req, res) => {

    try {

        // ==================================================
        // Total Users
        // ==================================================

        const totalUsers = await User.countDocuments();


        // ==================================================
        // Active Users
        // ==================================================

        const activeUsers = await User.countDocuments({

            isActive: true

        });


        // ==================================================
        // Blocked Users
        // ==================================================

        const blockedUsers = await User.countDocuments({

            isActive: false

        });


        // ==================================================
        // Verified Users
        // ==================================================

        const verifiedUsers = await User.countDocuments({

            isEmailVerified: true

        });


        // ==================================================
        // Unverified Users
        // ==================================================

        const unverifiedUsers = await User.countDocuments({

            isEmailVerified: false

        });


        // ==================================================
        // Role Statistics
        // ==================================================

        const customers = await User.countDocuments({

            role: "customer"

        });


        const sellers = await User.countDocuments({

            role: "seller"

        });


        const admins = await User.countDocuments({

            role: {

                $in: [

                    "admin",

                    "super-admin"

                ]

            }

        });


        // ==================================================
        // Date Filters
        // ==================================================

        const today = new Date();

        today.setHours(0,0,0,0);


        const firstDayMonth = new Date(

            today.getFullYear(),

            today.getMonth(),

            1

        );


        // ==================================================
        // New Users Today
        // ==================================================

        const newUsersToday = await User.countDocuments({

            createdAt: {

                $gte: today

            }

        });



        // ==================================================
        // New Users This Month
        // ==================================================

        const newUsersThisMonth = await User.countDocuments({

            createdAt: {

                $gte: firstDayMonth

            }

        });



        return res.status(200).json({

            success: true,

            analytics: {

                totalUsers,

                activeUsers,

                blockedUsers,

                verifiedUsers,

                unverifiedUsers,

                customers,

                sellers,

                admins,

                newUsersToday,

                newUsersThisMonth

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
// Get All Products
// ======================================================

exports.getAllProducts = async (req, res) => {

    try {

        const products = await Product.find()

            .populate("category", "name slug")

            .populate("brand", "name")

            .populate("vendor", "fullName email")

            .sort({

                createdAt: -1

            });


        return res.status(200).json({

            success: true,

            total: products.length,

            products

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Single Product
// ======================================================

exports.getSingleProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id)

            .populate("category", "name slug")

            .populate("brand", "name")

            .populate("vendor", "fullName email");


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }


        return res.status(200).json({

            success: true,

            product

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Update Product
// ======================================================

exports.updateProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }


        // ==================================================
        // Update Product Fields
        // ==================================================

        Object.assign(product, req.body);


        // ==================================================
        // Track Updated Admin
        // ==================================================

        if (req.user) {

            product.updatedBy = req.user.id;

        }


        await product.save();


        return res.status(200).json({

            success: true,

            message: "Product updated successfully.",

            product

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Approve Product
// ======================================================

exports.approveProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }


        // ==================================================
        // Approve Product
        // ==================================================

        product.status = "approved";


        // ==================================================
        // Track Admin Approval
        // ==================================================

        if (req.user) {

            product.approvedBy = req.user.id;

        }


        product.approvedAt = new Date();


        await product.save();



        return res.status(200).json({

            success: true,

            message: "Product approved successfully.",

            product

        });



    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Reject Product
// ======================================================

exports.rejectProduct = async (req, res) => {

    try {

        const { reason } = req.body;


        const product = await Product.findById(req.params.id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }

        // ==================================================
        // Reject Product
        // ==================================================

        product.status = "rejected";

        // ==================================================
        // Save Rejection Reason
        // ==================================================

        product.rejectionReason = reason || "Product rejected by admin.";



        // ==================================================
        // Track Admin Rejection
        // ==================================================

        if (req.user) {

            product.rejectedBy = req.user.id;

        }


        product.rejectedAt = new Date();


        await product.save();



        return res.status(200).json({

            success: true,

            message: "Product rejected successfully.",

            product

        });



    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Delete Product
// ======================================================

exports.deleteProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }


        await product.deleteOne();


        return res.status(200).json({

            success: true,

            message: "Product deleted successfully."

        });



    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Search & Filter Products
// ======================================================

exports.searchProducts = async (req, res) => {

    try {

        const {

            keyword,

            category,

            brand,

            status,

            minPrice,

            maxPrice

        } = req.query;


        const filter = {};


        // ==================================================
        // Search by Product Name
        // ==================================================

        if (keyword) {

            filter.name = {

                $regex: keyword,

                $options: "i"

            };

        }


        // ==================================================
        // Filter by Category
        // ==================================================

        if (category) {

            filter.category = category;

        }


        // ==================================================
        // Filter by Brand
        // ==================================================

        if (brand) {

            filter.brand = brand;

        }


        // ==================================================
        // Filter by Status
        // ==================================================

        if (status) {

            filter.status = status;

        }


        // ==================================================
        // Filter by Price
        // ==================================================

        if (minPrice || maxPrice) {

            filter.price = {};

            if (minPrice) {

                filter.price.$gte = Number(minPrice);

            }

            if (maxPrice) {

                filter.price.$lte = Number(maxPrice);

            }

        }


        const products = await Product.find(filter)

            .populate("category", "name")

            .populate("brand", "name")

            .populate("vendor", "fullName email")

            .sort({

                createdAt: -1

            });


        return res.status(200).json({

            success: true,

            total: products.length,

            products

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Product Analytics Dashboard
// ======================================================

exports.productAnalytics = async (req, res) => {

    try {

        // ==================================================
        // Total Products
        // ==================================================

        const totalProducts = await Product.countDocuments();

        // ==================================================
        // Product Status Statistics
        // ==================================================

        const approvedProducts = await Product.countDocuments({
            status: "approved"
        });

        const pendingProducts = await Product.countDocuments({
            status: "pending"
        });

        const rejectedProducts = await Product.countDocuments({
            status: "rejected"
        });

        // ==================================================
        // Featured Products
        // ==================================================

        const featuredProducts = await Product.countDocuments({
            featured: true
        });

        // ==================================================
        // Out Of Stock Products
        // ==================================================

        const outOfStockProducts = await Product.countDocuments({
            stock: 0
        });

        // ==================================================
        // Low Stock Products
        // ==================================================

        const lowStockProducts = await Product.countDocuments({
            stock: {
                $gt: 0,
                $lte: 10
            }
        });

        // ==================================================
        // Return Response
        // ==================================================

        return res.status(200).json({

            success: true,

            analytics: {

                totalProducts,

                approvedProducts,

                pendingProducts,

                rejectedProducts,

                featuredProducts,

                outOfStockProducts,

                lowStockProducts

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
// Get All Orders
// ======================================================

exports.getAllOrders = async (req, res) => {

    try {

        const orders = await Order.find()

            .populate("customer", "fullName email phone")

            .populate("items.product", "name")

            .populate("shippingAddress")

            .sort({

                createdAt: -1

            });

        return res.status(200).json({

            success: true,

            total: orders.length,

            orders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Single Order
// ======================================================

exports.getSingleOrder = async (req, res) => {

    try {

        const order = await Order.findById(req.params.id)

            .populate("customer", "fullName email phone")

            .populate("items.product", "name price")

            .populate("shippingAddress")

            .populate("payment");

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        return res.status(200).json({

            success: true,

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Update Order Status
// ======================================================

exports.updateOrderStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        // ==================================================
        // Update Status
        // ==================================================

        order.status = status;

        // ==================================================
        // Save Admin Who Updated
        // ==================================================

        if (req.user) {

            order.updatedBy = req.user.id;

        }

        // ==================================================
        // Save Update Time
        // ==================================================

        order.updatedAt = new Date();

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Order status updated successfully.",

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Assign Order to Warehouse
// ======================================================

exports.assignWarehouse = async (req, res) => {

    try {

        const { warehouseId } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        const warehouse = await Warehouse.findById(warehouseId);

        if (!warehouse) {

            return res.status(404).json({

                success: false,

                message: "Warehouse not found."

            });

        }

        // ==================================================
        // Assign Warehouse
        // ==================================================

        order.warehouse = warehouse._id;

        // ==================================================
        // Track Admin
        // ==================================================

        if (req.user) {

            order.updatedBy = req.user.id;

        }

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Warehouse assigned successfully.",

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Assign Order To Logistics Company
// ======================================================

exports.assignLogistics = async (req, res) => {

    try {

        const {

            logisticsCompany,
            trackingNumber

        } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        // ==================================================
        // Assign Logistics Information
        // ==================================================

        order.logisticsCompany = logisticsCompany;

        order.trackingNumber = trackingNumber;

        order.shippingStatus = "assigned";

        // ======================================================
// Logistics Information
// ======================================================

logisticsCompany: {

    type: String,

    default: ""

},

trackingNumber: {

    type: String,

    default: ""

},

shippingStatus: {

    type: String,

    enum: [

        "pending",
        "assigned",
        "picked-up",
        "in-transit",
        "out-for-delivery",
        "delivered"

    ],

    default: "pending"

}, you 
        
        // ==================================================
        // Save Admin Information
        // ==================================================

        if (req.user) {

            order.updatedBy = req.user.id;

        }

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Logistics company assigned successfully.",

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Cancel Order
// ======================================================

exports.cancelOrder = async (req, res) => {

    try {

        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        // ==================================================
        // Cancel Order
        // ==================================================

        order.status = "cancelled";

        // ==================================================
        // Save Cancellation Details
        // ==================================================

        order.cancellationReason = reason || "Cancelled by admin.";

        order.cancelledAt = new Date();

        if (req.user) {

            order.cancelledBy = req.user.id;

        }

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Order cancelled successfully.",

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Refund Order
// ======================================================

exports.refundOrder = async (req, res) => {

    try {

        const { refundReason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {

            return res.status(404).json({

                success: false,

                message: "Order not found."

            });

        }

        // ======================================================
// Refund Information
// ======================================================

refundReason: {

    type: String,

    default: ""

},

refundedBy: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    default: null

},

refundedAt: {

    type: Date,

    default: null

},

        // ==================================================
        // Update Refund Information
        // ==================================================

        order.status = "refunded";

        order.refundReason = refundReason || "Refund approved by admin.";

        order.refundedAt = new Date();

        if (req.user) {

            order.refundedBy = req.user.id;

        }

        await order.save();

        return res.status(200).json({

            success: true,

            message: "Order refunded successfully.",

            order

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Search & Filter Orders
// ======================================================

exports.searchOrders = async (req, res) => {

    try {

        const {

            orderNumber,
            customer,
            status,
            paymentStatus,
            warehouse,
            logisticsCompany,
            startDate,
            endDate

        } = req.query;

        const filter = {};

        // ==================================================
        // Order Number
        // ==================================================

        if (orderNumber) {

            filter.orderNumber = {

                $regex: orderNumber,

                $options: "i"

            };

        }

        // ==================================================
        // Customer
        // ==================================================

        if (customer) {

            filter.customer = customer;

        }

        // ==================================================
        // Order Status
        // ==================================================

        if (status) {

            filter.status = status;

        }

        // ==================================================
        // Payment Status
        // ==================================================

        if (paymentStatus) {

            filter.paymentStatus = paymentStatus;

        }

        // ==================================================
        // Warehouse
        // ==================================================

        if (warehouse) {

            filter.warehouse = warehouse;

        }

        // ==================================================
        // Logistics Company
        // ==================================================

        if (logisticsCompany) {

            filter.logisticsCompany = logisticsCompany;

        }

        // ==================================================
        // Date Range
        // ==================================================

        if (startDate || endDate) {

            filter.createdAt = {};

            if (startDate) {

                filter.createdAt.$gte = new Date(startDate);

            }

            if (endDate) {

                filter.createdAt.$lte = new Date(endDate);

            }

        }

        const orders = await Order.find(filter)

            .populate("customer", "fullName email phone")

            .populate("warehouse", "name")

            .sort({

                createdAt: -1

            });

        return res.status(200).json({

            success: true,

            total: orders.length,

            orders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Order Analytics Dashboard
// ======================================================

exports.orderAnalytics = async (req, res) => {

    try {

        // ==================================================
        // Total Orders
        // ==================================================

        const totalOrders = await Order.countDocuments();

        // ==================================================
        // Order Status Statistics
        // ==================================================

        const pendingOrders = await Order.countDocuments({
            status: "pending"
        });

        const confirmedOrders = await Order.countDocuments({
            status: "confirmed"
        });

        const processingOrders = await Order.countDocuments({
            status: "processing"
        });

        const packedOrders = await Order.countDocuments({
            status: "packed"
        });

        const shippedOrders = await Order.countDocuments({
            status: "shipped"
        });

        const deliveredOrders = await Order.countDocuments({
            status: "delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            status: "cancelled"
        });

        const refundedOrders = await Order.countDocuments({
            status: "refunded"
        });

        // ==================================================
        // Total Revenue
        // ==================================================

        const revenue = await Order.aggregate([
            {
                $match: {
                    status: "delivered"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        // ==================================================
        // Return Analytics
        // ==================================================

        return res.status(200).json({

            success: true,

            analytics: {

                totalOrders,

                pendingOrders,

                confirmedOrders,

                processingOrders,

                packedOrders,

                shippedOrders,

                deliveredOrders,

                cancelledOrders,

                refundedOrders,

                totalRevenue: revenue.length
                    ? revenue[0].totalRevenue
                    : 0

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
// Get Recent Orders
// ======================================================

exports.getRecentOrders = async (req, res) => {

    try {

        const recentOrders = await Order.find()

            .populate("customer", "fullName email")

            .sort({ createdAt: -1 })

            .limit(10);

        return res.status(200).json({

            success: true,

            total: recentOrders.length,

            recentOrders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Pending Orders
// ======================================================

exports.getPendingOrders = async (req, res) => {

    try {

        const pendingOrders = await Order.find({

            status: "pending"

        })

        .populate("customer", "fullName email phone")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: pendingOrders.length,

            pendingOrders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Processing Orders
// ======================================================

exports.getProcessingOrders = async (req, res) => {

    try {

        const processingOrders = await Order.find({

            status: "processing"

        })

        .populate("customer", "fullName email phone")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: processingOrders.length,

            processingOrders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Packed Orders
// ======================================================

exports.getPackedOrders = async (req, res) => {

    try {

        const packedOrders = await Order.find({

            status: "packed"

        })

        .populate("customer", "fullName email phone")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: packedOrders.length,

            packedOrders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Shipped Orders
// ======================================================

exports.getShippedOrders = async (req, res) => {

    try {

        const shippedOrders = await Order.find({

            status: "shipped"

        })

        .populate("customer", "fullName email phone")

        .populate("warehouse", "name")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: shippedOrders.length,

            shippedOrders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Delivered Orders
// ======================================================

exports.getDeliveredOrders = async (req, res) => {

    try {

        const deliveredOrders = await Order.find({

            status: "delivered"

        })

        .populate("customer", "fullName email phone")

        .populate("warehouse", "name")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: deliveredOrders.length,

            deliveredOrders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Get Cancelled Orders
// ======================================================

exports.getCancelledOrders = async (req, res) => {

    try {

        const cancelledOrders = await Order.find({

            status: "cancelled"

        })

        .populate("customer", "fullName email phone")

        .populate("warehouse", "name")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: cancelledOrders.length,

            cancelledOrders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Refunded Orders
// ======================================================

exports.getRefundedOrders = async (req, res) => {

    try {

        const refundedOrders = await Order.find({

            status: "refunded"

        })

        .populate("customer", "fullName email phone")

        .populate("warehouse", "name")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: refundedOrders.length,

            refundedOrders

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Finance Dashboard Overview
// ======================================================

exports.financeDashboard = async (req, res) => {

    try {

        // ==================================================
        // Payment Statistics
        // ==================================================

        const totalPayments = await Payment.countDocuments();

        const successfulPayments = await Payment.countDocuments({

            status: "successful"

        });

        const pendingPayments = await Payment.countDocuments({

            status: "pending"

        });

        const failedPayments = await Payment.countDocuments({

            status: "failed"

        });

        // ==================================================
        // Transaction Statistics
        // ==================================================

        const totalTransactions = await Transaction.countDocuments();

        // ==================================================
        // Wallet Statistics
        // ==================================================

        const totalWallets = await Wallet.countDocuments();

        // ==================================================
        // Withdrawal Statistics
        // ==================================================

        const totalWithdrawals = await Withdrawal.countDocuments();

        const pendingWithdrawals = await Withdrawal.countDocuments({

            status: "pending"

        });

        const approvedWithdrawals = await Withdrawal.countDocuments({

            status: "approved"

        });

        const rejectedWithdrawals = await Withdrawal.countDocuments({

            status: "rejected"

        });

        // ==================================================
        // Revenue
        // ==================================================

        const revenue = await Transaction.aggregate([

            {

                $match: {

                    status: "successful"

                }

            },

            {

                $group: {

                    _id: null,

                    totalRevenue: {

                        $sum: "$amount"

                    }

                }

            }

        ]);

        return res.status(200).json({

            success: true,

            finance: {

                totalPayments,

                successfulPayments,

                pendingPayments,

                failedPayments,

                totalTransactions,

                totalWallets,

                totalWithdrawals,

                pendingWithdrawals,

                approvedWithdrawals,

                rejectedWithdrawals,

                totalRevenue: revenue.length

                    ? revenue[0].totalRevenue

                    : 0

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
// Get All Payments
// ======================================================

exports.getAllPayments = async (req, res) => {

    try {

        const payments = await Payment.find()

            .populate("user", "fullName email phone")

            .populate("order", "orderNumber totalAmount status")

            .sort({

                createdAt: -1

            });

        return res.status(200).json({

            success: true,

            total: payments.length,

            payments

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Single Payment
// ======================================================

exports.getSinglePayment = async (req, res) => {

    try {

        const payment = await Payment.findById(req.params.id)

            .populate("user", "fullName email phone")

            .populate("order", "orderNumber totalAmount status");

        if (!payment) {

            return res.status(404).json({

                success: false,

                message: "Payment not found."

            });

        }

        return res.status(200).json({

            success: true,

            payment

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Search & Filter Payments
// ======================================================

exports.searchPayments = async (req, res) => {

    try {

        const {

            reference,
            user,
            order,
            status,
            paymentMethod,
            minAmount,
            maxAmount,
            startDate,
            endDate

        } = req.query;

        const filter = {};

        // ==================================================
        // Payment Reference
        // ==================================================

        if (reference) {

            filter.reference = {

                $regex: reference,

                $options: "i"

            };

        }

        // ==================================================
        // Customer
        // ==================================================

        if (user) {

            filter.user = user;

        }

        // ==================================================
        // Order
        // ==================================================

        if (order) {

            filter.order = order;

        }

        // ==================================================
        // Payment Status
        // ==================================================

        if (status) {

            filter.status = status;

        }

        // ==================================================
        // Payment Method
        // ==================================================

        if (paymentMethod) {

            filter.paymentMethod = paymentMethod;

        }

        // ==================================================
        // Amount Range
        // ==================================================

        if (minAmount || maxAmount) {

            filter.amount = {};

            if (minAmount) {

                filter.amount.$gte = Number(minAmount);

            }

            if (maxAmount) {

                filter.amount.$lte = Number(maxAmount);

            }

        }

        // ==================================================
        // Date Range
        // ==================================================

        if (startDate || endDate) {

            filter.createdAt = {};

            if (startDate) {

                filter.createdAt.$gte = new Date(startDate);

            }

            if (endDate) {

                filter.createdAt.$lte = new Date(endDate);

            }

        }

        const payments = await Payment.find(filter)

            .populate("user", "fullName email")

            .populate("order", "orderNumber")

            .sort({

                createdAt: -1

            });

        return res.status(200).json({

            success: true,

            total: payments.length,

            payments

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Payment Analytics Dashboard
// ======================================================

exports.paymentAnalytics = async (req, res) => {

    try {

        // ==================================================
        // Payment Statistics
        // ==================================================

        const totalPayments = await Payment.countDocuments();

        const successfulPayments = await Payment.countDocuments({
            status: "successful"
        });

        const pendingPayments = await Payment.countDocuments({
            status: "pending"
        });

        const failedPayments = await Payment.countDocuments({
            status: "failed"
        });

        // ==================================================
        // Total Payment Amount
        // ==================================================

        const paymentSummary = await Payment.aggregate([

            {
                $match: {
                    status: "successful"
                }
            },

            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" },
                    averageAmount: { $avg: "$amount" }
                }
            }

        ]);

        // ==================================================
        // Today's Payments
        // ==================================================

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const todaysPayments = await Payment.countDocuments({

            createdAt: {
                $gte: today
            }

        });

        // ==================================================
        // This Month's Payments
        // ==================================================

        const firstDayOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        const monthlyPayments = await Payment.countDocuments({

            createdAt: {
                $gte: firstDayOfMonth
            }

        });

        // ==================================================
        // Return Analytics
        // ==================================================

        return res.status(200).json({

            success: true,

            analytics: {

                totalPayments,

                successfulPayments,

                pendingPayments,

                failedPayments,

                totalPaymentAmount:
                    paymentSummary.length
                        ? paymentSummary[0].totalAmount
                        : 0,

                averagePaymentAmount:
                    paymentSummary.length
                        ? paymentSummary[0].averageAmount
                        : 0,

                todaysPayments,

                monthlyPayments

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
// Get Recent Payments
// ======================================================

exports.getRecentPayments = async (req, res) => {

    try {

        const recentPayments = await Payment.find()

            .populate("user", "fullName email")

            .populate("order", "orderNumber totalAmount")

            .sort({

                createdAt: -1

            })

            .limit(10);

        return res.status(200).json({

            success: true,

            total: recentPayments.length,

            recentPayments

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Successful Payments
// ======================================================

exports.getSuccessfulPayments = async (req, res) => {

    try {

        const successfulPayments = await Payment.find({

            status: "successful"

        })

        .populate("user", "fullName email phone")

        .populate("order", "orderNumber totalAmount")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: successfulPayments.length,

            successfulPayments

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Pending Payments
// ======================================================

exports.getPendingPayments = async (req, res) => {

    try {

        const pendingPayments = await Payment.find({

            status: "pending"

        })

        .populate("user", "fullName email phone")

        .populate("order", "orderNumber totalAmount")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: pendingPayments.length,

            pendingPayments

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Failed Payments
// ======================================================

exports.getFailedPayments = async (req, res) => {

    try {

        const failedPayments = await Payment.find({

            status: "failed"

        })

        .populate("user", "fullName email phone")

        .populate("order", "orderNumber totalAmount")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: failedPayments.length,

            failedPayments

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get All Transactions
// ======================================================

exports.getAllTransactions = async (req, res) => {

    try {

        const transactions = await Transaction.find()

            .populate("user", "fullName email phone")

            .sort({

                createdAt: -1

            });

        return res.status(200).json({

            success: true,

            total: transactions.length,

            transactions

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Single Transaction
// ======================================================

exports.getSingleTransaction = async (req, res) => {

    try {

        const transaction = await Transaction.findById(req.params.id)

            .populate("user", "fullName email phone")

            .populate("order", "orderNumber totalAmount status");

        if (!transaction) {

            return res.status(404).json({

                success: false,

                message: "Transaction not found."

            });

        }

        return res.status(200).json({

            success: true,

            transaction

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Search & Filter Transactions
// ======================================================

exports.searchTransactions = async (req, res) => {

    try {

        const {

            reference,
            user,
            order,
            type,
            status,
            paymentMethod,
            minAmount,
            maxAmount,
            startDate,
            endDate

        } = req.query;

        const filter = {};

        // ==================================================
        // Transaction Reference
        // ==================================================

        if (reference) {

            filter.reference = {

                $regex: reference,

                $options: "i"

            };

        }

        // ==================================================
        // Customer
        // ==================================================

        if (user) {

            filter.user = user;

        }

        // ==================================================
        // Order
        // ==================================================

        if (order) {

            filter.order = order;

        }

        // ==================================================
        // Transaction Type
        // ==================================================

        if (type) {

            filter.type = type;

        }

        // ==================================================
        // Transaction Status
        // ==================================================

        if (status) {

            filter.status = status;

        }

        // ==================================================
        // Payment Method
        // ==================================================

        if (paymentMethod) {

            filter.paymentMethod = paymentMethod;

        }

        // ==================================================
        // Amount Range
        // ==================================================

        if (minAmount || maxAmount) {

            filter.amount = {};

            if (minAmount) {

                filter.amount.$gte = Number(minAmount);

            }

            if (maxAmount) {

                filter.amount.$lte = Number(maxAmount);

            }

        }

        // ==================================================
        // Date Range
        // ==================================================

        if (startDate || endDate) {

            filter.createdAt = {};

            if (startDate) {

                filter.createdAt.$gte = new Date(startDate);

            }

            if (endDate) {

                filter.createdAt.$lte = new Date(endDate);

            }

        }

        const transactions = await Transaction.find(filter)

            .populate("user", "fullName email")

            .populate("order", "orderNumber")

            .sort({

                createdAt: -1

            });

        return res.status(200).json({

            success: true,

            total: transactions.length,

            transactions

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Transaction Analytics Dashboard
// ======================================================

exports.transactionAnalytics = async (req, res) => {

    try {

        // ==================================================
        // Total Transactions
        // ==================================================

        const totalTransactions = await Transaction.countDocuments();

        // ==================================================
        // Transaction Types
        // ==================================================

        const creditTransactions = await Transaction.countDocuments({
            type: "credit"
        });

        const debitTransactions = await Transaction.countDocuments({
            type: "debit"
        });

        // ==================================================
        // Transaction Status
        // ==================================================

        const successfulTransactions = await Transaction.countDocuments({
            status: "successful"
        });

        const pendingTransactions = await Transaction.countDocuments({
            status: "pending"
        });

        const failedTransactions = await Transaction.countDocuments({
            status: "failed"
        });

        // ==================================================
        // Total & Average Transaction Amount
        // ==================================================

        const summary = await Transaction.aggregate([

            {
                $match: {
                    status: "successful"
                }
            },

            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: "$amount"
                    },
                    averageAmount: {
                        $avg: "$amount"
                    }
                }
            }

        ]);

        // ==================================================
        // Return Analytics
        // ==================================================

        return res.status(200).json({

            success: true,

            analytics: {

                totalTransactions,

                creditTransactions,

                debitTransactions,

                successfulTransactions,

                pendingTransactions,

                failedTransactions,

                totalTransactionAmount:
                    summary.length
                        ? summary[0].totalAmount
                        : 0,

                averageTransactionAmount:
                    summary.length
                        ? summary[0].averageAmount
                        : 0

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
// Get Recent Transactions
// ======================================================

exports.getRecentTransactions = async (req, res) => {

    try {

        const recentTransactions = await Transaction.find()

            .populate("user", "fullName email")

            .populate("order", "orderNumber totalAmount")

            .sort({

                createdAt: -1

            })

            .limit(10);

        return res.status(200).json({

            success: true,

            total: recentTransactions.length,

            recentTransactions

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Credit Transactions
// ======================================================

exports.getCreditTransactions = async (req, res) => {

    try {

        const creditTransactions = await Transaction.find({

            type: "credit"

        })

        .populate("user", "fullName email phone")

        .populate("order", "orderNumber totalAmount")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: creditTransactions.length,

            creditTransactions

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Debit Transactions
// ======================================================

exports.getDebitTransactions = async (req, res) => {

    try {

        const debitTransactions = await Transaction.find({

            type: "debit"

        })

        .populate("user", "fullName email phone")

        .populate("order", "orderNumber totalAmount")

        .sort({

            createdAt: -1

        });

        return res.status(200).json({

            success: true,

            total: debitTransactions.length,

            debitTransactions

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Revenue Transactions
// ======================================================

exports.getRevenueTransactions = async (req, res) => {

    try {

        const revenueTransactions = await Transaction.find({

            type: "credit",

            status: "successful"

        })

        .populate("user", "fullName email phone")

        .populate("order", "orderNumber totalAmount")

        .sort({

            createdAt: -1

        });

        const totalRevenue = revenueTransactions.reduce(

            (sum, transaction) => sum + transaction.amount,

            0

        );

        return res.status(200).json({

            success: true,

            totalTransactions: revenueTransactions.length,

            totalRevenue,

            revenueTransactions

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Refund Transactions
// ======================================================

exports.getRefundTransactions = async (req, res) => {

    try {

        const refundTransactions = await Transaction.find({

            type: "debit",

            category: "refund"

        })

        .populate("user", "fullName email phone")

        .populate("order", "orderNumber totalAmount")

        .sort({

            createdAt: -1

        });

        const totalRefundAmount = refundTransactions.reduce(

            (sum, transaction) => sum + transaction.amount,

            0

        );

        return res.status(200).json({

            success: true,

            totalTransactions: refundTransactions.length,

            totalRefundAmount,

            refundTransactions

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Export Transactions to CSV
// ======================================================

exports.exportTransactionsCSV = async (req, res) => {

    try {

        const transactions = await Transaction.find()

            .populate("user", "fullName email")

            .populate("order", "orderNumber");

        const data = transactions.map(transaction => ({

            TransactionID: transaction._id,

            Reference: transaction.reference,

            Customer: transaction.user
                ? transaction.user.fullName
                : "",

            Email: transaction.user
                ? transaction.user.email
                : "",

            OrderNumber: transaction.order
                ? transaction.order.orderNumber
                : "",

            Amount: transaction.amount,

            Type: transaction.type,

            Status: transaction.status,

            PaymentMethod: transaction.paymentMethod,

            Date: transaction.createdAt

        }));

        const fields = [

            "TransactionID",

            "Reference",

            "Customer",

            "Email",

            "OrderNumber",

            "Amount",

            "Type",

            "Status",

            "PaymentMethod",

            "Date"

        ];

        const parser = new Parser({

            fields

        });

        const csv = parser.parse(data);

        res.header(

            "Content-Type",

            "text/csv"

        );

        res.attachment(

            "transactions.csv"

        );

        return res.send(csv);

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Export Transactions (CSV / Excel / PDF)
// ======================================================

exports.exportTransactions = async (req, res) => {

    try {

        const {

            format = "csv",
            status,
            type,
            paymentMethod,
            user,
            startDate,
            endDate,
            minAmount,
            maxAmount

        } = req.query;


        // ==================================================
        // Build Filters
        // ==================================================

        const filter = {};


        if (status) {

            filter.status = status;

        }


        if (type) {

            filter.type = type;

        }


        if (paymentMethod) {

            filter.paymentMethod = paymentMethod;

        }


        if (user) {

            filter.user = user;

        }


        if (minAmount || maxAmount) {

            filter.amount = {};

            if (minAmount) {

                filter.amount.$gte = Number(minAmount);

            }


            if (maxAmount) {

                filter.amount.$lte = Number(maxAmount);

            }

        }


        if (startDate || endDate) {

            filter.createdAt = {};

            if (startDate) {

                filter.createdAt.$gte =
                    new Date(startDate);

            }


            if (endDate) {

                filter.createdAt.$lte =
                    new Date(endDate);

            }

        }


        // ==================================================
        // Get Transactions
        // ==================================================

        const transactions = await Transaction.find(filter)

            .populate(
                "user",
                "fullName email"
            )

            .populate(
                "order",
                "orderNumber"
            )

            .sort({
                createdAt: -1
            });



        // ==================================================
        // CSV Export
        // ==================================================

        if (format === "csv") {


            const fields = [

                "reference",
                "amount",
                "type",
                "status",
                "paymentMethod",
                "createdAt"

            ];


            const csv =
                exportService.generateCSV(
                    transactions,
                    fields
                );


            res.header(
                "Content-Type",
                "text/csv"
            );


            res.attachment(
                "transactions.csv"
            );


            return res.send(csv);

        }



        // ==================================================
        // Excel Export
        // ==================================================

        if (format === "excel") {


            const workbook =
                await exportService.generateExcel(

                    "Transactions",

                    [

                        {
                            header: "Reference",
                            key: "reference"
                        },

                        {
                            header: "Amount",
                            key: "amount"
                        },

                        {
                            header: "Type",
                            key: "type"
                        },

                        {
                            header: "Status",
                            key: "status"
                        }

                    ],

                    transactions

                );


            res.setHeader(

                "Content-Type",

                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

            );


            res.setHeader(

                "Content-Disposition",

                "attachment; filename=transactions.xlsx"

            );


            return workbook.xlsx.write(res);

        }



        // ==================================================
        // PDF Export
        // ==================================================

        if (format === "pdf") {


            const pdf =
                exportService.generatePDF(

                    "SmartBuy Transaction Report",

                    transactions

                );


            res.setHeader(

                "Content-Type",

                "application/pdf"

            );


            res.setHeader(

                "Content-Disposition",

                "attachment; filename=transactions.pdf"

            );


            pdf.pipe(res);

            pdf.end();


            return;

        }



        return res.status(400).json({

            success: false,

            message:
            "Invalid export format. Use csv, excel, or pdf."

        });



    } catch (error) {


        return res.status(500).json({

            success: false,

            message: error.message

        });


    }

};

// ======================================================
// Wallet Dashboard
// ======================================================

exports.getWalletDashboard = async (req, res) => {

    try {

        const totalWallets = await Wallet.countDocuments();

        const activeWallets = await Wallet.countDocuments({

            isLocked: false

        });

        const lockedWallets = await Wallet.countDocuments({

            isLocked: true

        });

        const summary = await Wallet.aggregate([

            {

                $group: {

                    _id: null,

                    totalAvailableBalance: {

                        $sum: "$availableBalance"

                    },

                    totalPendingBalance: {

                        $sum: "$pendingBalance"

                    },

                    totalFrozenBalance: {

                        $sum: "$frozenBalance"

                    },

                    totalRewardPoints: {

                        $sum: "$rewardPoints"

                    },

                    totalCashback: {

                        $sum: "$cashbackBalance"

                    }

                }

            }

        ]);

        res.status(200).json({

            success: true,

            data: {

                totalWallets,

                activeWallets,

                lockedWallets,

                totalAvailableBalance:
                    summary[0]?.totalAvailableBalance || 0,

                totalPendingBalance:
                    summary[0]?.totalPendingBalance || 0,

                totalFrozenBalance:
                    summary[0]?.totalFrozenBalance || 0,

                totalRewardPoints:
                    summary[0]?.totalRewardPoints || 0,

                totalCashback:
                    summary[0]?.totalCashback || 0

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get All Wallets
// Enterprise Search + Filter + Pagination + Sorting
// ======================================================

exports.getWallets = async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;

        const limit = parseInt(req.query.limit) || 20;

        const skip = (page - 1) * limit;

        const search = req.query.search || "";

        const walletType = req.query.walletType;

        const currency = req.query.currency;

        const isActive = req.query.isActive;

        const isLocked = req.query.isLocked;

        const kycStatus = req.query.kycStatus;

        const sortBy = req.query.sortBy || "createdAt";

        const order = req.query.order === "asc" ? 1 : -1;

        const filter = {};

        if (walletType) {

            filter.walletType = walletType;

        }

        if (currency) {

            filter.currency = currency;

        }

        if (typeof isActive !== "undefined") {

            filter.isActive = isActive === "true";

        }

        if (typeof isLocked !== "undefined") {

            filter.isLocked = isLocked === "true";

        }

        if (kycStatus) {

            filter.kycStatus = kycStatus;

        }

        const wallets = await Wallet.find(filter)

            .populate({

                path: "user",

                select: "firstName lastName email phoneNumber"

            })

            .sort({

                [sortBy]: order

            })

            .skip(skip)

            .limit(limit);

        const filteredWallets = wallets.filter(wallet => {

            if (!search) return true;

            const user = wallet.user || {};

            const keyword = search.toLowerCase();

            return (

                wallet.walletId?.toLowerCase().includes(keyword) ||

                user.firstName?.toLowerCase().includes(keyword) ||

                user.lastName?.toLowerCase().includes(keyword) ||

                user.email?.toLowerCase().includes(keyword)

            );

        });

        const total = await Wallet.countDocuments(filter);

        res.status(200).json({

            success: true,

            data: filteredWallets,

            pagination: {

                page,

                limit,

                total,

                totalPages: Math.ceil(total / limit)

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Single Wallet Details
// ======================================================

exports.getWalletById = async (req, res) => {

    try {

        const wallet = await Wallet.findById(req.params.id)

            .populate({
                path: "user",
                select: "-password"
            });

        if (!wallet) {

            return res.status(404).json({

                success: false,
                message: "Wallet not found."

            });

        }

        res.status(200).json({

            success: true,
            data: wallet

        });

    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};


// ======================================================
// Credit Wallet
// ======================================================

exports.creditWallet = async (req, res) => {

    try {

        const { amount, description } = req.body;

        if (!amount || amount <= 0) {

            return res.status(400).json({

                success: false,
                message: "Invalid amount."

            });

        }

        const wallet = await Wallet.findById(req.params.id);
        const balanceBefore = wallet.availableBalance;

        if (!wallet) {

            return res.status(404).json({

                success: false,
                message: "Wallet not found."

            });

        }

        if (!wallet.isActive) {

            return res.status(403).json({

                success: false,
                message: "Wallet is inactive."

            });

        }

        if (wallet.isLocked) {

            return res.status(403).json({

                success: false,
                message: "Wallet is locked."

            });

        }

        wallet.availableBalance += Number(amount);

        wallet.totalEarned += Number(amount);

        wallet.lastTransactionDate = new Date();

        const result = await executeFinancialTransaction(async (session) => {

        wallet.availableBalance += Number(amount);

        wallet.totalEarned += Number(amount);

        wallet.lastTransactionDate = new Date();

       await wallet.save({ session });
            await Transaction.create([{

       user: wallet.user,

       wallet: wallet._id,

       transactionType: "adjustment",

       amount: Number(amount),

       currency: wallet.currency,

       paymentMethod: "wallet",

       transactionDirection: "credit",

       status: "successful",

       balanceBefore: balanceBefore,

       balanceAfter: wallet.availableBalance,

       description: description || "Wallet credited"

}], { session });

       return wallet;

});

        res.status(200).json({

            success: true,

            message: "Wallet credited successfully.",

            data: result

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Debit Wallet
// ======================================================

exports.debitWallet = async (req, res) => {

    try {

        const { amount, description } = req.body;

        if (!amount || amount <= 0) {

            return res.status(400).json({

                success: false,
                message: "Invalid amount."

            });

        }

        const wallet = await Wallet.findById(req.params.id);
        const balanceBefore = wallet.availableBalance;

        if (!wallet) {

            return res.status(404).json({

                success: false,
                message: "Wallet not found."

            });

        }

        if (!wallet.isActive) {

            return res.status(403).json({

                success: false,
                message: "Wallet is inactive."

            });

        }

        if (wallet.isLocked) {

            return res.status(403).json({

                success: false,
                message: "Wallet is locked."

            });

        }

        if (wallet.availableBalance < amount) {

            return res.status(400).json({

                success: false,
                message: "Insufficient wallet balance."

            });

        }

        wallet.availableBalance -= Number(amount);

        wallet.totalSpent += Number(amount);

        wallet.lastTransactionDate = new Date();

        await wallet.save({session});
        
await Transaction.create([{

    user: wallet.user,

    wallet: wallet._id,

    transactionType: "adjustment",

    amount: Number(amount),

    currency: wallet.currency,

    paymentMethod: "wallet",

    transactionDirection: "debit",

    status: "successful",

    balanceBefore: balanceBefore,

    balanceAfter: wallet.availableBalance,

    description: description || "Wallet debited"

}], { session });
        res.status(200).json({

            success: true,

            message: "Wallet debited successfully.",

            data: wallet

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Freeze Wallet
// ======================================================

exports.freezeWallet = async (req, res) => {

    try {

        const { reason } = req.body;

        const wallet = await Wallet.findById(req.params.id);

        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }

        if (wallet.isLocked) {

            return res.status(400).json({

                success: false,

                message: "Wallet is already frozen."

            });

        }

        wallet.isLocked = true;

        wallet.lockReason = reason || "Frozen by administrator.";

        await wallet.save();

        res.status(200).json({

            success: true,

            message: "Wallet frozen successfully.",

            data: wallet

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Unfreeze Wallet
// ======================================================

exports.unfreezeWallet = async (req, res) => {

    try {

        const wallet = await Wallet.findById(req.params.id);

        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }

        if (!wallet.isLocked) {

            return res.status(400).json({

                success: false,

                message: "Wallet is already active."

            });

        }

        wallet.isLocked = false;

        wallet.lockReason = "";

        await wallet.save();

        res.status(200).json({

            success: true,

            message: "Wallet unlocked successfully.",

            data: wallet

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Wallet Analytics
// ======================================================

exports.getWalletAnalytics = async (req, res) => {

    try {

        const analytics = await Wallet.aggregate([

            {

                $group: {

                    _id: null,

                    totalWallets: {
                        $sum: 1
                    },

                    totalAvailableBalance: {
                        $sum: "$availableBalance"
                    },

                    totalPendingBalance: {
                        $sum: "$pendingBalance"
                    },

                    totalFrozenBalance: {
                        $sum: "$frozenBalance"
                    },

                    totalEarned: {
                        $sum: "$totalEarned"
                    },

                    totalSpent: {
                        $sum: "$totalSpent"
                    },

                    totalWithdrawn: {
                        $sum: "$totalWithdrawn"
                    },

                    totalRewardPoints: {
                        $sum: "$rewardPoints"
                    },

                    totalCashback: {
                        $sum: "$cashbackBalance"
                    }

                }

            }

        ]);



        const walletTypes = await Wallet.aggregate([

            {

                $group: {

                    _id: "$walletType",

                    total: {
                        $sum: 1
                    }

                }

            }

        ]);



        const kycStatus = await Wallet.aggregate([

            {

                $group: {

                    _id: "$kycStatus",

                    total: {
                        $sum: 1
                    }

                }

            }

        ]);



        const activeWallets = await Wallet.countDocuments({

            isLocked: false

        });



        const lockedWallets = await Wallet.countDocuments({

            isLocked: true

        });



        return res.status(200).json({

            success: true,

            data: {

                overview: analytics[0] || {},

                walletTypes,

                kycStatus,

                activeWallets,

                lockedWallets

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
// Export Wallets (CSV / Excel / PDF)
// ======================================================

exports.exportWallets = async (req, res) => {

    try {

        const {

            format = "csv",
            walletType,
            currency,
            isActive,
            isLocked,
            kycStatus

        } = req.query;

        const filter = {};

        if (walletType) {

            filter.walletType = walletType;

        }

        if (currency) {

            filter.currency = currency;

        }

        if (typeof isActive !== "undefined") {

            filter.isActive = isActive === "true";

        }

        if (typeof isLocked !== "undefined") {

            filter.isLocked = isLocked === "true";

        }

        if (kycStatus) {

            filter.kycStatus = kycStatus;

        }

        const wallets = await Wallet.find(filter)

            .populate(
                "user",
                "firstName lastName email"
            )

            .sort({
                createdAt: -1
            });

        // ==========================================
        // CSV
        // ==========================================

        if (format === "csv") {

            const fields = [

                "walletId",
                "walletType",
                "currency",
                "availableBalance",
                "pendingBalance",
                "frozenBalance",
                "totalEarned",
                "totalSpent",
                "isActive",
                "isLocked"

            ];

            const csv = exportService.generateCSV(

                wallets,

                fields

            );

            res.header(

                "Content-Type",

                "text/csv"

            );

            res.attachment("wallets.csv");

            return res.send(csv);

        }

        // ==========================================
        // Excel
        // ==========================================

        if (format === "excel") {

            const workbook = await exportService.generateExcel(

                "Wallets",

                [

                    { header: "Wallet ID", key: "walletId" },

                    { header: "Wallet Type", key: "walletType" },

                    { header: "Balance", key: "availableBalance" },

                    { header: "Currency", key: "currency" },

                    { header: "Status", key: "isActive" }

                ],

                wallets

            );

            res.setHeader(

                "Content-Type",

                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

            );

            res.setHeader(

                "Content-Disposition",

                "attachment; filename=wallets.xlsx"

            );

            return workbook.xlsx.write(res);

        }

        // ==========================================
        // PDF
        // ==========================================

        if (format === "pdf") {

            const pdf = exportService.generatePDF(

                "SmartBuy Wallet Report",

                wallets

            );

            res.setHeader(

                "Content-Type",

                "application/pdf"

            );

            res.setHeader(

                "Content-Disposition",

                "attachment; filename=wallets.pdf"

            );

            pdf.pipe(res);

            pdf.end();

            return;

        }

        return res.status(400).json({

            success: false,

            message: "Invalid export format."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ======================================================
// Withdrawal Dashboard
// ======================================================

exports.getWithdrawalDashboard = async (req, res) => {

    try {

        const totalWithdrawals = await Withdrawal.countDocuments();

        const pendingWithdrawals = await Withdrawal.countDocuments({

            status: "pending"

        });

        const processingWithdrawals = await Withdrawal.countDocuments({

            status: "processing"

        });

        const completedWithdrawals = await Withdrawal.countDocuments({

            status: "completed"

        });

        const rejectedWithdrawals = await Withdrawal.countDocuments({

            status: "rejected"

        });

        const failedWithdrawals = await Withdrawal.countDocuments({

            status: "failed"

        });

        res.status(200).json({

            success: true,

            data: {

                totalWithdrawals,

                pendingWithdrawals,

                processingWithdrawals,

                completedWithdrawals,

                rejectedWithdrawals,

                failedWithdrawals

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Withdrawal Analytics
// ======================================================

exports.getWithdrawalAnalytics = async (req, res) => {

    try {

        const overview = await Withdrawal.aggregate([

            {

                $group: {

                    _id: null,

                    totalWithdrawals: {

                        $sum: 1

                    },

                    totalAmount: {

                        $sum: "$amount"

                    },

                    totalProcessingFees: {

                        $sum: "$processingFee"

                    },

                    totalNetAmount: {

                        $sum: "$netAmount"

                    }

                }

            }

        ]);



        const statusBreakdown = await Withdrawal.aggregate([

            {

                $group: {

                    _id: "$status",

                    total: {

                        $sum: 1

                    }

                }

            }

        ]);



        const methodBreakdown = await Withdrawal.aggregate([

            {

                $group: {

                    _id: "$withdrawalMethod",

                    total: {

                        $sum: 1

                    }

                }

            }

        ]);



        const gatewayBreakdown = await Withdrawal.aggregate([

            {

                $group: {

                    _id: "$paymentGateway",

                    total: {

                        $sum: 1

                    }

                }

            }

        ]);



        return res.status(200).json({

            success: true,

            data: {

                overview: overview[0] || {},

                statusBreakdown,

                methodBreakdown,

                gatewayBreakdown

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
// Get All Withdrawals
// ======================================================

exports.getAllWithdrawals = async (req, res) => {

    try {

        const {

            page = 1,

            limit = 20,

            status,

            withdrawalMethod,

            paymentGateway,

            search

        } = req.query;

        const filter = {};

        if (status) {

            filter.status = status;

        }

        if (withdrawalMethod) {

            filter.withdrawalMethod = withdrawalMethod;

        }

        if (paymentGateway) {

            filter.paymentGateway = paymentGateway;

        }

        if (search) {

            filter.withdrawalId = {

                $regex: search,

                $options: "i"

            };

        }

        const withdrawals = await Withdrawal.find(filter)

            .populate(

                "user",

                "firstName lastName email"

            )

            .populate(

                "wallet",

                "walletId"

            )

            .sort({

                createdAt: -1

            })

            .skip((page - 1) * limit)

            .limit(Number(limit));

        const total = await Withdrawal.countDocuments(filter);

        res.status(200).json({

            success: true,

            total,

            currentPage: Number(page),

            totalPages: Math.ceil(total / limit),

            data: withdrawals

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Single Withdrawal
// ======================================================

exports.getSingleWithdrawal = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id)

            .populate(
                "user",
                "firstName lastName email phone"
            )

            .populate(
                "wallet",
                "walletId availableBalance currency"
            )

            .populate(
                "transaction"
            )

            .populate(
                "requestedBy",
                "firstName lastName"
            )

            .populate(
                "approvedBy",
                "firstName lastName"
            )

            .populate(
                "completedBy",
                "firstName lastName"
            )

            .populate(
                "rejectedBy",
                "firstName lastName"
            );

        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }

        return res.status(200).json({

            success: true,

            data: withdrawal

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Request Withdrawal
// ======================================================

exports.requestWithdrawal = async (req, res) => {

    try {

        const {

            amount,

            withdrawalMethod,

            description

        } = req.body;

        // Find user's wallet

        const wallet = await Wallet.findOne({

            user: req.user._id

        });

        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }

        // Check if wallet is locked

        if (wallet.isLocked) {

            return res.status(403).json({

                success: false,

                message: "Wallet is locked."

            });

        }

        // Check available balance

        if (wallet.availableBalance < amount) {

            return res.status(400).json({

                success: false,

                message: "Insufficient wallet balance."

            });

        }

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// =====================================
// Check KYC Verification
// =====================================

if (wallet.kycStatus !== "verified") {

    return res.status(403).json({

        success: false,

        message: "Please complete KYC verification before making a withdrawal."

    });

}

// =====================================
// Check Daily Transaction Limit
// =====================================

if (amount > wallet.dailyTransactionLimit) {

    return res.status(400).json({

        success: false,

        message: "Daily withdrawal limit exceeded."

    });

}

// =====================================
// Check Monthly Transaction Limit
// =====================================

if (amount > wallet.monthlyTransactionLimit) {

    return res.status(400).json({

        success: false,

        message: "Monthly withdrawal limit exceeded."

    });

}

// =====================================
// Calculate Processing Fee
// =====================================

// Default fee = 1% of withdrawal amount

const processingFee = Number(amount) * 0.01;

// Amount the user will actually receive

const netAmount = Number(amount) - processingFee;


// =====================================
// Estimated Completion Time
// =====================================

// Estimate 24 hours from now

const estimatedCompletion = new Date(

    Date.now() + (24 * 60 * 60 * 1000)

);

    const withdrawal = await Withdrawal.create({

    user: req.user._id,

    wallet: wallet._id,

    amount,

    currency: wallet.currency,

    withdrawalMethod,

    processingFee,

    netAmount,

    estimatedCompletion,

    requestedBy: req.user._id,

    ipAddress: req.ip,

    deviceInfo: req.headers["user-agent"],

    description

});

// ======================================================
// Approve Withdrawal
// ======================================================

exports.approveWithdrawal = async (req, res) => {

    try {

        const withdrawal = await Withdrawal.findById(req.params.id);

        if (!withdrawal) {

            return res.status(404).json({

                success: false,

                message: "Withdrawal not found."

            });

        }

        if (withdrawal.status !== "pending") {

            return res.status(400).json({

                success: false,

                message: "Only pending withdrawals can be approved."

            });

        }

        const wallet = await Wallet.findById(

            withdrawal.wallet

        );

        if (!wallet) {

            return res.status(404).json({

                success: false,

                message: "Wallet not found."

            });

        }

// =====================================
// Check Wallet Balance
// =====================================

if (wallet.availableBalance < withdrawal.amount) {

    return res.status(400).json({

        success: false,

        message: "Insufficient wallet balance."

    });

}
        
// =====================================
// Deduct Wallet Balance
// =====================================
     wallet.availableBalance -= withdrawal.amount;

     wallet.totalWithdrawn += withdrawal.amount;

     wallet.lastWithdrawalDate = new Date();

     await wallet.save();
// =====================================
// Update Withdrawal
// =====================================

     withdrawal.status = "completed";

     withdrawal.approvedBy = req.user._id;

     withdrawal.approvedAt = new Date();

     withdrawal.completedBy = req.user._id;

     withdrawal.completedAt = new Date();

     await withdrawal.save();

        return res.status(200).json({

    success: true,

    message: "Withdrawal approved successfully.",

    data: withdrawal

});
        
    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
