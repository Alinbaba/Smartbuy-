// ======================================================
// SmartBuy Enterprise Admin Dashboard Controller
// ======================================================

const AdminDashboard = require("../models/AdminDashboard");
const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const Wallet = require("../models/Wallet");
const Withdrawal = require("../models/Withdrawal");
const Transaction = require("../models/Transaction");

// ======================================================
// Create Admin Dashboard
// ======================================================

exports.createDashboard = async (req, res) => {

    try {

        const dashboard = await AdminDashboard.create({

            admin: req.user.id,

            dashboardType: req.body.dashboardType,

            lastIP: req.ip

        });

        return res.status(201).json({

            success: true,

            message: "Admin dashboard created successfully.",

            dashboard

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
