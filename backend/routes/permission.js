const express = require("express");

const router = express.Router();

const {
    createPermission,
    getPermissions,
    getPermissionById,
    updatePermission,
    deletePermission
} = require("../controllers/permissionController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorize");

// ==================================================
// Permission Routes
// ==================================================

// Create Permission
router.post(
    "/",
    protect,
    authorize("permissions.manage"),
    createPermission
);

// Get All Permissions
router.get(
    "/",
    protect,
    authorize("permissions.view"),
    getPermissions
);

// Get Single Permission
router.get(
    "/:id",
    protect,
    authorize("permissions.view"),
    getPermissionById
);

// Update Permission
router.put(
    "/:id",
    protect,
    authorize("permissions.manage"),
    updatePermission
);

// Delete Permission
router.delete(
    "/:id",
    protect,
    authorize("permissions.manage"),
    deletePermission
);

module.exports = router;
