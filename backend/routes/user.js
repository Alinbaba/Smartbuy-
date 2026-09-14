// ======================================================
// SmartBuy User Routes
// ======================================================

const express = require("express");

const router = express.Router();

const {

    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser

} = require("../controllers/userController");

// ======================================================
// Authentication Middleware
// ======================================================

const {

    protect

} = require("../middleware/authMiddleware");

// ======================================================
// Authorization Middleware
// ======================================================

const {

    authorize

} = require("../middleware/authorize");

// ======================================================
// User CRUD Routes
// ======================================================

router.post(
    "/",
    protect,
    authorize("users.create"),
    createUser
);

router.get(
    "/",
    protect,
    authorize("users.view"),
    getAllUsers
);

router.get(
    "/:id",
    protect,
    authorize("users.view"),
    getUserById
);

router.put(
    "/:id",
    protect,
    authorize("users.edit"),
    updateUser
);

router.delete(
    "/:id",
    protect,
    authorize("users.delete"),
    deleteUser
);

// ======================================================
// Export Router
// ======================================================

module.exports = router;
