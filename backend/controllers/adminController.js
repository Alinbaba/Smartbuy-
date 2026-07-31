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

        rejectionReason: {
    type: String,
    default: ""
},

rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
},

rejectedAt: {
    type: Date
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

        // ======================================================
// Cancellation Information
// ======================================================

cancellationReason: {

    type: String,

    default: ""

},

cancelledBy: {

    type: mongoose.Schema.Types.ObjectId,

    ref: "User",

    default: null

},

cancelledAt: {

    type: Date,

    default: null

},
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
