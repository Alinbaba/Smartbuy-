// ==================================================
// SmartBuy Default Permissions
// ==================================================

const defaultPermissions = [

    // ==========================
    // User Management
    // ==========================
    { module: "users", action: "view", description: "View users" },
    { module: "users", action: "create", description: "Create users" },
    { module: "users", action: "edit", description: "Edit users" },
    { module: "users", action: "delete", description: "Delete users" },
    { module: "users", action: "suspend", description: "Suspend users" },
    { module: "users", action: "verify", description: "Verify users" },

    // ==========================
    // Products
    // ==========================
    { module: "products", action: "view", description: "View products" },
    { module: "products", action: "create", description: "Create products" },
    { module: "products", action: "edit", description: "Edit products" },
    { module: "products", action: "delete", description: "Delete products" },
    { module: "products", action: "approve", description: "Approve products" },

    // ==========================
    // Orders
    // ==========================
    { module: "orders", action: "view", description: "View orders" },
    { module: "orders", action: "create", description: "Create orders" },
    { module: "orders", action: "edit", description: "Edit orders" },
    { module: "orders", action: "cancel", description: "Cancel orders" },
    { module: "orders", action: "refund", description: "Refund orders" },

    // ==========================
    // Payments
    // ==========================
    { module: "payments", action: "view", description: "View payments" },
    { module: "payments", action: "approve", description: "Approve payments" },

    // ==========================
    // Warehouse
    // ==========================
    { module: "warehouse", action: "view", description: "View warehouse" },
    { module: "warehouse", action: "manage", description: "Manage warehouse" },

    // ==========================
    // Inventory
    // ==========================
    { module: "inventory", action: "view", description: "View inventory" },
    { module: "inventory", action: "manage", description: "Manage inventory" },

    // ==========================
    // Suppliers
    // ==========================
    { module: "suppliers", action: "view", description: "View suppliers" },
    { module: "suppliers", action: "create", description: "Create suppliers" },
    { module: "suppliers", action: "edit", description: "Edit suppliers" },

    // ==========================
    // Categories
    // ==========================
    { module: "categories", action: "view", description: "View categories" },
    { module: "categories", action: "manage", description: "Manage categories" },

    // ==========================
    // Brands
    // ==========================
    { module: "brands", action: "view", description: "View brands" },
    { module: "brands", action: "manage", description: "Manage brands" },

    // ==========================
    // Roles
    // ==========================
    { module: "roles", action: "view", description: "View roles" },
    { module: "roles", action: "manage", description: "Manage roles" },

    // ==========================
    // Permissions
    // ==========================
    { module: "permissions", action: "view", description: "View permissions" },
    { module: "permissions", action: "manage", description: "Manage permissions" },

    // ==========================
    // Analytics
    // ==========================
    { module: "analytics", action: "view", description: "View analytics" },

    // ==========================
    // Audit Logs
    // ==========================
    { module: "audit", action: "view", description: "View audit logs" },

    // ==========================
    // AI
    // ==========================
    { module: "ai", action: "use", description: "Use AI features" },

    // ==========================
    // System
    // ==========================
    { module: "system", action: "manage", description: "Manage system settings" }

];

module.exports = defaultPermissions;
