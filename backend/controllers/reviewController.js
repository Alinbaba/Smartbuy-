const Review = require("../models/Review");
const Product = require("../models/Product");

// ==========================
// Update Product Rating
// ==========================

const updateProductRating = async (productId) => {

    const reviews = await Review.find({ product: productId });

    const totalReviews = reviews.length;

    let averageRating = 0;

    if (totalReviews > 0) {

        const totalRating = reviews.reduce(

            (sum, review) => sum + review.rating,

            0

        );

        averageRating = totalRating / totalReviews;

    }

    await Product.findByIdAndUpdate(productId, {

        rating: averageRating,

        totalReviews

    });

};
// ==========================
// Add Review
// ==========================

exports.addReview = async (req, res) => {

    try {

        const { productId, rating, comment } = req.body;

        const product = await Product.findById(productId);

        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found."

            });

        }

        const existingReview = await Review.findOne({

            user: req.user.id,

            product: productId

        });

        if (existingReview) {

            return res.status(400).json({

                success: false,

                message: "You have already reviewed this product."

            });

        }

        const review = await Review.create({

            user: req.user.id,

            product: productId,

            rating,

            comment

        });
        
        await updateProductRating(productId);

        res.status(201).json({

            success: true,

            message: "Review added successfully.",

            review

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Get Product Reviews
// ==========================

exports.getProductReviews = async (req, res) => {

    try {

        const reviews = await Review.find({

            product: req.params.productId,

            status: "visible"

        }).populate("user", "name");

        res.status(200).json({

            success: true,

            totalReviews: reviews.length,

            reviews

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Update Review
// ==========================

exports.updateReview = async (req, res) => {

    try {

        const review = await Review.findById(req.params.id);

        if (!review) {

            return res.status(404).json({

                success: false,

                message: "Review not found."

            });

        }

        // Only the owner can update the review

        if (review.user.toString() !== req.user.id) {

            return res.status(403).json({

                success: false,

                message: "You are not allowed to update this review."

            });

        }

        review.rating = req.body.rating || review.rating;

        review.comment = req.body.comment || review.comment;

        await review.save();
        
        await updateProductRating(review.product);

        res.status(200).json({

            success: true,

            message: "Review updated successfully.",

            review

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ==========================
// Delete Review
// ==========================

exports.deleteReview = async (req, res) => {

    try {

        const review = await Review.findById(req.params.id);

        if (!review) {

            return res.status(404).json({

                success: false,

                message: "Review not found."

            });

        }

        // Only the review owner or an Admin can delete

        if (

            review.user.toString() !== req.user.id &&

            req.user.role !== "Admin" &&

            req.user.role !== "Super Admin"

        ) {

            return res.status(403).json({

                success: false,

                message: "You are not allowed to delete this review."

            });

        }
        
        const productId = review.product;

        await review.deleteOne();
        
        await updateProductRating(productId);

        res.status(200).json({

            success: true,

            message: "Review deleted successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};