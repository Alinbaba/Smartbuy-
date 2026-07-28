// ======================================================
// SmartBuy Wishlist Controller
// ======================================================

const Wishlist = require("../models/Wishlist");


// ======================================================
// Get My Wishlist
// ======================================================

exports.getMyWishlist = async (req, res) => {

    try {

        const wishlist = await Wishlist.findOne({

            user: req.user.id

        }).populate("products");


        if (!wishlist) {

            return res.status(200).json({

                success: true,

                products: []

            });

        }


        return res.status(200).json({

            success: true,

            wishlist

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Add Product To Wishlist
// ======================================================

exports.addToWishlist = async (req, res) => {

    try {

        const { productId } = req.body;


        let wishlist = await Wishlist.findOne({

            user: req.user.id

        });


        // Create wishlist if user doesn't have one

        if (!wishlist) {

            wishlist = await Wishlist.create({

                user: req.user.id,

                products: []

            });

        }


        // Check if product already exists

        if (wishlist.products.includes(productId)) {

            return res.status(400).json({

                success: false,

                message: "Product already in wishlist."

            });

        }


        wishlist.products.push(productId);

        await wishlist.save();


        return res.status(200).json({

            success: true,

            message: "Product added to wishlist.",

            wishlist

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Remove Product From Wishlist
// ======================================================

exports.removeFromWishlist = async (req, res) => {

    try {

        const { productId } = req.params;


        const wishlist = await Wishlist.findOne({

            user: req.user.id

        });


        if (!wishlist) {

            return res.status(404).json({

                success: false,

                message: "Wishlist not found."

            });

        }


        wishlist.products = wishlist.products.filter(

            product => product.toString() !== productId

        );


        await wishlist.save();


        return res.status(200).json({

            success: true,

            message: "Product removed from wishlist.",

            wishlist

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Clear My Wishlist
// ======================================================

exports.clearWishlist = async (req, res) => {

    try {

        const wishlist = await Wishlist.findOne({

            user: req.user.id

        });


        if (!wishlist) {

            return res.status(404).json({

                success: false,

                message: "Wishlist not found."

            });

        }


        wishlist.products = [];


        await wishlist.save();


        return res.status(200).json({

            success: true,

            message: "Wishlist cleared successfully."

        });


    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};