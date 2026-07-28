const express = require("express");

const router = express.Router();

const {

    addReview,

    getProductReviews,

    updateReview,

    deleteReview

} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// Public Route
router.get("/product/:productId", getProductReviews);

// Protected Routes
router.post("/", protect, addReview);

router.put("/:id", protect, updateReview);

router.delete("/:id", protect, deleteReview);

module.exports = router;