const express = require("express");

const router = express.Router();

const {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
    assignPermissions,
    getRolePermissions,
    clearPermissions
} = require("../controllers/roleController");
const { protect } = require("../middleware/authMiddleware");

// ======================================
// Role Routes
// ======================================

// Create a new role
router.post("/", protect, createRole);

// Get all roles
router.get("/", protect, getRoles);

// Get a single role
router.get("/:id", protect, getRole);

// Update a role
router.put("/:id", protect, updateRole);

// Delete a role
router.delete("/:id", protect, deleteRole);

module.exports = router;
