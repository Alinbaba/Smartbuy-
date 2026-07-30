const Role = require("../models/Role");

// ======================================================
// Seed Default SmartBuy Roles
// ======================================================

const seedRoles = async () => {

    try {

        const defaultRoles = [

            {
                name: "super-admin",
                description: "Full system access.",
                dashboard: "super-admin",
                isSystemRole: true,
                priority: 100,
                permissions: ["*"]
            },

            {
                name: "ai-admin",
                description: "AI administration and automation.",
                dashboard: "ai-admin",
                isSystemRole: true,
                priority: 95,
                permissions: [
                    "view_analytics",
                    "manage_reports",
                    "ai_tools"
                ]
            },

            {
                name: "admin",
                description: "General administration.",
                dashboard: "admin",
                isSystemRole: true,
                priority: 90,
                permissions: [
                    "manage_users",
                    "manage_products",
                    "manage_orders"
                ]
            },

            {
                name: "finance-admin",
                description: "Finance department.",
                dashboard: "finance",
                priority: 80,
                permissions: [
                    "wallet",
                    "payments",
                    "withdrawals"
                ]
            },

            {
                name: "logistics-admin",
                description: "Logistics management.",
                dashboard: "logistics",
                priority: 75,
                permissions: [
                    "shipping",
                    "delivery",
                    "tracking"
                ]
            },

            {
                name: "advertising-admin",
                description: "Advertising management.",
                dashboard: "advertising",
                priority: 70,
                permissions: [
                    "ads",
                    "campaigns"
                ]
            },

            {
                name: "security-admin",
                description: "Security management.",
                dashboard: "security",
                priority: 85,
                permissions: [
                    "audit_logs",
                    "security"
                ]
            },

            {
                name: "customer-care",
                description: "Customer support.",
                dashboard: "customer-care",
                priority: 60,
                permissions: [
                    "support",
                    "tickets"
                ]
            },

            {
                name: "warehouse-manager",
                description: "Warehouse manager.",
                dashboard: "warehouse",
                priority: 65,
                permissions: [
                    "warehouse",
                    "inventory"
                ]
            },

            {
                name: "warehouse-staff",
                description: "Warehouse staff.",
                dashboard: "warehouse",
                priority: 50,
                permissions: [
                    "inventory"
                ]
            },

            {
                name: "delivery-staff",
                description: "Delivery staff.",
                dashboard: "delivery",
                priority: 45,
                permissions: [
                    "deliver_orders"
                ]
            },

            {
                name: "vendor-manager",
                description: "Vendor management.",
                dashboard: "vendor",
                priority: 55,
                permissions: [
                    "vendors"
                ]
            },

            {
                name: "supplier",
                description: "Supplier account.",
                dashboard: "supplier",
                priority: 40,
                permissions: [
                    "supply_products"
                ]
            },

            {
                name: "seller",
                description: "Seller account.",
                dashboard: "seller",
                priority: 40,
                permissions: [
                    "sell_products"
                ]
            },

            {
                name: "manufacturer",
                description: "Manufacturer account.",
                dashboard: "manufacturer",
                priority: 40,
                permissions: [
                    "manufacture_products"
                ]
            },

            {
                name: "wholesaler",
                description: "Wholesaler account.",
                dashboard: "wholesaler",
                priority: 40,
                permissions: [
                    "wholesale_products"
                ]
            },

            {
                name: "affiliate",
                description: "Affiliate account.",
                dashboard: "affiliate",
                priority: 35,
                permissions: [
                    "affiliate_sales"
                ]
            },

            {
                name: "dropshipper",
                description: "Dropshipper account.",
                dashboard: "dropshipper",
                priority: 35,
                permissions: [
                    "dropshipping"
                ]
            },

            {
                name: "customer",
                description: "Customer account.",
                dashboard: "customer",
                isSystemRole: true,
                priority: 10,
                permissions: [
                    "shop"
                ]
            }

        ];

        for (const role of defaultRoles) {

            const exists = await Role.findOne({ name: role.name });

            if (!exists) {

                await Role.create(role);

                console.log(`✅ Role created: ${role.name}`);

            }

        }

        console.log("✅ Default SmartBuy roles seeded successfully.");

    } catch (error) {

        console.error("❌ Role seeding failed:", error.message);

    }

};

module.exports = seedRoles;
