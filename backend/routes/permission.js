const express = require("express");

const router = express.Router();

const {
    createPermission,
    getPermissions,
    getPermissionById,
    updatePermission,
    deletePermission
} = require("../controllers/permissionController");

// ==================================================
// Permission Routes
// ==================================================

// Create Permission
router.post("/", createPermission);

// Get All Permissions
router.get("/", getPermissions);

// Get Single Permission
router.get("/:id", getPermissionById);

// Update Permission
router.put("/:id", updatePermission);

// Delete Permission
router.delete("/:id", deletePermission);

module.exports = router;
