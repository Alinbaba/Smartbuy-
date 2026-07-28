const express = require("express");

const router = express.Router();

const {
    getProducts,
    createProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    approveProduct,
    rejecProduct
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");

const { authorize } = require("../middleware/roleMiddleware");

// Public Routes

router.get("/", getProducts);

router.get("/:id", getSingleProduct);

// Protected Routes

router.post(
    "/",
    protect,
    authorize("super admin", "admin", "seller"),
    createProduct
);

  router.put(
    "/:id",
    protect,
    authorize("super admin", "admin", "seller"),
    updateProduct
);

    router.delete(
    "/:id",
    protect,
    authorize("super admin", "admin", "seller"),
    deleteProduct
);

// Approve Product
router.put(
    "/:id/approve",
    protect,
    authorize("super admin", "admin"),
    approveProduct
);

// Reject Product
router.put(
    "/:id/reject",
    protect,
    authorize("super admin", "admin"),
    rejectProduct
);
module.exports = router;