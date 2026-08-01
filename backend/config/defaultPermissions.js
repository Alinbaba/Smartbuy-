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
    // Transactions
    // ==========================
    { module: "transactions", action: "view", description: "View transactions" },
    { module: "transactions", action: "export", description: "Export transactions" },
    { module: "transactions", action: "manage", description: "Manage transactions" },
  
    // ==========================
    // Wallets
    // ==========================
    { module: "wallets", action: "view", description: "View wallets" },
    { module: "wallets", action: "credit", description: "Credit wallets" },
    { module: "wallets", action: "debit", description: "Debit wallets" },
    { module: "wallets", action: "freeze", description: "Freeze wallets" },
    { module: "wallets", action: "manage", description: "Manage wallets" },
    // ==========================
    // Withdrawals
    // ==========================
    { module: "withdrawals", action: "view", description: "View withdrawals" },
    { module: "withdrawals", action: "approve", description: "Approve withdrawals" },
    { module: "withdrawals", action: "reject", description: "Reject withdrawals" },
    { module: "withdrawals", action: "manage", description: "Manage withdrawals" },
    
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
    // Coupons
    // ==========================
    { module: "coupons", action: "view", description: "View coupons" },
    { module: "coupons", action: "create", description: "Create coupons" },
    { module: "coupons", action: "edit", description: "Edit coupons" },
    { module: "coupons", action: "delete", description: "Delete coupons" },

    // ==========================
    // Reviews
    // ==========================
    { module: "reviews", action: "view", description: "View reviews" },
    { module: "reviews", action: "manage", description: "Manage reviews" },

    // ==========================
    // Notifications
    // ==========================
    { module: "notifications", action: "view", description: "View notifications" },
    { module: "notifications", action: "send", description: "Send notifications" },
    { module: "notifications", action: "delete", description: "Delete notifications" },

    // ==========================
    // Shipping
    // ==========================
    { module: "shipping", action: "view", description: "View shipping" },
    { module: "shipping", action: "manage", description: "Manage shipping" },

    // ==========================
    // Addresses
    // ==========================
    { module: "addresses", action: "view", description: "View addresses" },
    { module: "addresses", action: "manage", description: "Manage addresses" },

    // ==========================
    // Wishlist
    // ==========================
    { module: "wishlists", action: "view", description: "View wishlists" },
    { module: "wishlists", action: "manage", description: "Manage wishlists" },

    // ==========================
    // Cart
    // ==========================
    { module: "carts", action: "view", description: "View carts" },
    { module: "carts", action: "manage", description: "Manage carts" },

    // ==========================
    // KYC
    // ==========================
    { module: "kyc", action: "view", description: "View KYC" },
    { module: "kyc", action: "approve", description: "Approve KYC" },
    { module: "kyc", action: "reject", description: "Reject KYC" },

    // ==========================
    // Uploads
    // ==========================
    { module: "uploads", action: "view", description: "View uploads" },
    { module: "uploads", action: "manage", description: "Manage uploads" },

    // ==========================
    // Reports
    // ==========================
    { module: "reports", action: "view", description: "View reports" },
    { module: "reports", action: "export", description: "Export reports" },

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
