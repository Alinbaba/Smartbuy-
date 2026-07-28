const AuditLog = require("../models/AuditLog");
// ======================================
// Create Audit Log
// ======================================

exports.createAuditLog = async (req, res) => {

    try {

        const auditLog = await AuditLog.create(req.body);

        res.status(201).json({

            success: true,

            message: "Audit log created successfully.",

            auditLog

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Get All Audit Logs
// ======================================

exports.getAllAuditLogs = async (req, res) => {

    try {

        const auditLogs = await AuditLog.find()

            .populate(
                "user",
                "userId fullName username role"
            )

            .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            totalLogs: auditLogs.length,

            auditLogs

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Get Audit Log By ID
// ======================================

exports.getAuditLogById = async (req, res) => {

    try {

        const auditLog = await AuditLog.findById(req.params.id)

            .populate(

                "user",

                "userId fullName username role email"

            );

        if (!auditLog) {

            return res.status(404).json({

                success: false,

                message: "Audit log not found."

            });

        }

        res.status(200).json({

            success: true,

            auditLog

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Get My Audit Logs
// ======================================

exports.getMyAuditLogs = async (req, res) => {

    try {

        const auditLogs = await AuditLog.find({

            user: req.user.id

        }).sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            totalLogs: auditLogs.length,

            auditLogs

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Get Audit Logs by Module
// ======================================

exports.getAuditLogsByModule = async (req, res) => {

    try {

        const { module } = req.params;

        const auditLogs = await AuditLog.find({

            module

        })

        .populate(

            "user",

            "userId fullName username role"

        )

        .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            module,

            totalLogs: auditLogs.length,

            auditLogs

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Get Audit Logs by User
// ======================================

exports.getAuditLogsByUser = async (req, res) => {

    try {

        const { userId } = req.params;

        const auditLogs = await AuditLog.find({

            user: userId

        })

        .populate(

            "user",

            "userId fullName username role email"

        )

        .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            totalLogs: auditLogs.length,

            auditLogs

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Get Audit Logs by Date Range
// ======================================

exports.getAuditLogsByDateRange = async (req, res) => {

    try {

        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {

            return res.status(400).json({

                success: false,

                message: "Start date and end date are required."

            });

        }

        const auditLogs = await AuditLog.find({

            createdAt: {

                $gte: new Date(startDate),

                $lte: new Date(endDate)

            }

        })

        .populate(

            "user",

            "userId fullName username role"

        )

        .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            startDate,

            endDate,

            totalLogs: auditLogs.length,

            auditLogs

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Get Failed Audit Logs
// ======================================

exports.getFailedAuditLogs = async (req, res) => {

    try {

        const auditLogs = await AuditLog.find({

            status: "failed"

        })

        .populate(

            "user",

            "userId fullName username role"

        )

        .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            totalFailedLogs: auditLogs.length,

            auditLogs

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Audit Dashboard Statistics
// ======================================

exports.getAuditStatistics = async (req, res) => {

    try {

        const totalLogs = await AuditLog.countDocuments();

        const successfulLogs = await AuditLog.countDocuments({

            status: "success"

        });

        const failedLogs = await AuditLog.countDocuments({

            status: "failed"

        });

        const warningLogs = await AuditLog.countDocuments({

            status: "warning"

        });

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const todayLogs = await AuditLog.countDocuments({

            createdAt: { $gte: today }

        });

        const moduleStatistics = await AuditLog.aggregate([

            {

                $group: {

                    _id: "$module",

                    total: { $sum: 1 }

                }

            },

            {

                $sort: {

                    total: -1

                }

            }

        ]);

        res.status(200).json({

            success: true,

            statistics: {

                totalLogs,

                successfulLogs,

                failedLogs,

                warningLogs,

                todayLogs,

                moduleStatistics

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};