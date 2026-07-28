// ======================================================
// SmartBuy Cart Controller
// Enterprise Multi-Vendor Marketplace
// Version 2.0
// ======================================================

// ======================================================
// Import Models
// ======================================================

const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ======================================================
// Add Product To Cart
// ======================================================

exports.addToCart = async (req, res) => {

    try {

        const {

            productId,
            quantity,
            variant

        } = req.body;

        // ===============================================
        // Validate Input
        // ===============================================

        if (!productId) {

            return res.status(400).json({

                success: false,
                message: "Product ID is required."

            });

        }

        const qty = Number(quantity) || 1;
        // ===============================================
        // Find Product
        // ===============================================

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({

                success: false,
                message: "Product not found."

            });

        }

        // ===============================================
        // Product Availability Check
        // ===============================================

        if (product.status !== "active") {

            return res.status(400).json({

                success: false,
                message: "This product is not available."

            });

        }

        // ===============================================
        // Stock Check
        // ===============================================

        if (product.stock < qty) {

            return res.status(400).json({

                success: false,
                message: "Insufficient stock available."

            });

        }
  // ===============================================
   // Find Customer Cart
// ===============================================

        let cart = await Cart.findOne({

            user: req.user.id

        });

        // ===============================================
        // Create Cart If It Doesn't Exist
        // ===============================================

        if (!cart) {

            cart = await Cart.create({

                user: req.user.id,

                items: []

            });

        }
 
 // ===============================================
 // Check Existing Cart Item
   // ===============================================

        const existingItem = cart.items.find(

            item => item.product.toString() === productId

        );

        // ===============================================
        // Update Existing Item or Add New Item
        // ===============================================

        if (existingItem) {

            existingItem.quantity += quantity;

        } else {

            cart.items.push({

 product: product._id,

   quantity,

   price: product.discountPrice || product.price

            });

        }

        // ===============================================
        // Save Cart
        // ===============================================

        await cart.save();
        
        // ===============================================
        // Success Response
        // ===============================================

        return res.status(200).json({

            success: true,

            message: "Product added to cart successfully.",

            cart

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Customer Cart
// ======================================================

exports.getCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({

            user: req.user.id

        })

        .populate({

            path: "items.product",

            select: "productId name slug thumbnail price discountPrice stock seller"

        });

        if (!cart) {

            return res.status(200).json({

                success: true,

                cart: {

                    items: [],

                    totalItems: 0,

                    subtotal: 0

                }

            });

        }

        // ===============================================
        // Calculate Cart Totals
        // ===============================================

        let subtotal = 0;

        let totalItems = 0;

        cart.items.forEach(item => {

            subtotal += item.price * item.quantity;

            totalItems += item.quantity;

        });
        
        // ===============================================
        // Return Cart
        // ===============================================

        return res.status(200).json({

            success: true,

            totalItems,

            subtotal,

            cart

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Update Cart Item Quantity
// ======================================================

exports.updateCartItem = async (req, res) => {

    try {

        const { productId, quantity } = req.body;

        if (!productId) {

            return res.status(400).json({
                success: false,
                message: "Product ID is required."
            });

        }

        if (!quantity || quantity < 1) {

            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1."
            });

        }

        const cart = await Cart.findOne({

            user: req.user.id

        });

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });

        }

        const item = cart.items.find(

            item => item.product.toString() === productId

        );

        if (!item) {

            return res.status(404).json({
                success: false,
                message: "Product not found in cart."
            });

        }

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Product not found."
            });

        }

        if (product.stock < quantity) {

            return res.status(400).json({
                success: false,
                message: "Insufficient stock available."
            });

        }

        item.quantity = quantity;

        await cart.save();

        return res.status(200).json({

            success: true,
            message: "Cart updated successfully.",
            cart

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

// ======================================================
// Remove Item From Cart
// ======================================================

exports.removeCartItem = async (req, res) => {

    try {

        const { productId } = req.body;

        if (!productId) {

            return res.status(400).json({

                success: false,
                message: "Product ID is required."

            });

        }

        const cart = await Cart.findOne({

            user: req.user.id

        });

        if (!cart) {

            return res.status(404).json({

                success: false,
                message: "Cart not found."

            });

        }

        cart.items = cart.items.filter(

            item => item.product.toString() !== productId

        );

        await cart.save();

        return res.status(200).json({

            success: true,
            message: "Product removed from cart successfully.",
            cart

        });

    } catch (error) {

        return res.status(500).json({

            success: false,
            message: error.message

        });

    }

};
        
// ======================================================
// Clear Cart
// Removes every item from customer's cart
// ======================================================

exports.clearCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({

            user: req.user.id

        });

        if (!cart) {

            return res.status(404).json({

                success: false,

                message: "Cart not found."

            });

        }

        cart.items = [];

        await cart.save();

        return res.status(200).json({

            success: true,

            message: "Cart cleared successfully.",

            cart

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ======================================================
// Get Cart Summary
// Returns totals for checkout
// ======================================================

exports.getCartSummary = async (req, res) => {

    try {

        const cart = await Cart.findOne({

            user: req.user.id

        }).populate("items.product");

        if (!cart) {

            return res.status(404).json({

                success: false,

                message: "Cart not found."

            });

        }

        let totalItems = 0;
        let subtotal = 0;

        cart.items.forEach(item => {

            totalItems += item.quantity;

            subtotal += item.quantity * item.price;

        });

        return res.status(200).json({

            success: true,

            summary: {

                totalItems,

                subtotal

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
// Verify Cart Stock
// Ensures every product still has enough stock
// ======================================================

exports.verifyCartStock = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product");

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });

        }

        const unavailable = [];

        for (const item of cart.items) {

            if (!item.product) {

                unavailable.push({
                    product: "Deleted Product",
                    reason: "Product no longer exists"
                });

                continue;

            }

            if (item.product.stock < item.quantity) {

                unavailable.push({
                    product: item.product.name,
                    available: item.product.stock,
                    requested: item.quantity
                });

            }

        }

        return res.status(200).json({

            success: true,

            valid: unavailable.length === 0,

            unavailable

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

