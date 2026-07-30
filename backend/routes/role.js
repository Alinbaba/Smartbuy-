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
const { authorize } = require("../middleware/authorize");
// ======================================
// Role Routes
// ======================================
router.post(
    "/",
    protect,
    authorize("roles.manage"),
    createRole
);

// ==================================================
// Get All Roles
// ==================================================
router.get(
    "/",
    protect,
    authorize("roles.view"),
    getRoles
);

// ==================================================
// Get Single Role
// ==================================================
router.get(
    "/:id",
    protect,
    authorize("roles.view"),
    getRoleById
);

// ==================================================
// Update Role
// ==================================================
router.put(
    "/:id",
    protect,
    authorize("roles.manage"),
    updateRole
);

// ==================================================
// Delete Role
// ==================================================
router.delete(
    "/:id",
    protect,
    authorize("roles.manage"),
    deleteRole
);

// ==================================================
// Assign Permissions To Role
// ==================================================
router.put(
    "/:id/permissions",
    protect,
    authorize("roles.manage"),
    assignPermissions
);

// ==================================================
// Get Role Permissions
// ==================================================
router.get(
    "/:id/permissions",
    protect,
    authorize("roles.view"),
    getRolePermissions
);

// ==================================================
// Remove All Permissions
// ==================================================
router.delete(
    "/:id/permissions",
    protect,
    authorize("roles.manage"),
    clearPermissions
);
module.exports = router;
