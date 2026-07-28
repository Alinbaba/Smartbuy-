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
// User CRUD Routes
// ======================================================

router.post("/", protect, createUser);

router.get("/", protect, getAllUsers);

router.get("/:id", protect, getUserById);

router.put("/:id", protect, updateUser);

router.delete("/:id", protect, deleteUser);
// ======================================================
// Export Router
// ======================================================

module.exports = router;