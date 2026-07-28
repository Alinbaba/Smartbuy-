// ======================================================
// SmartBuy Notification Controller
// Handles notification operations
// ======================================================


// ======================================================
// Import Notification Model
// ======================================================

const Notification = require("../models/Notification");


// ======================================================
// Get Logged-in User Notifications
// ======================================================

exports.getMyNotifications = async (req, res) => {

    try {

        const notifications = await Notification.find({

            user: req.user.id

        })

        .sort({ createdAt: -1 });


        return res.status(200).json({

            success: true,

            total: notifications.length,

            notifications

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Mark Notification as Read
// ======================================================

exports.markNotificationAsRead = async (req, res) => {

    try {

        const notification = await Notification.findById(req.params.id);

        if (!notification) {

            return res.status(404).json({

                success: false,

                message: "Notification not found."

            });

        }

        // ==================================================
        // Check Ownership
        // ==================================================

        if (notification.user.toString() !== req.user.id) {

            return res.status(403).json({

                success: false,

                message: "Access denied."

            });

        }

        notification.isRead = true;

        await notification.save();

        return res.status(200).json({

            success: true,

            message: "Notification marked as read.",

            notification

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Mark All Notifications as Read
// ======================================================

exports.markAllNotificationsAsRead = async (req, res) => {

    try {

        await Notification.updateMany(

            {

                user: req.user.id,

                isRead: false

            },

            {

                $set: {

                    isRead: true

                }

            }

        );

        return res.status(200).json({

            success: true,

            message: "All notifications marked as read."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Delete Notification
// ======================================================

exports.deleteNotification = async (req, res) => {

    try {

        const notification = await Notification.findById(req.params.id);

        if (!notification) {

            return res.status(404).json({

                success: false,

                message: "Notification not found."

            });

        }

        // ==================================================
        // Check Ownership
        // ==================================================

        if (notification.user.toString() !== req.user.id) {

            return res.status(403).json({

                success: false,

                message: "Access denied."

            });

        }

        await notification.deleteOne();

        return res.status(200).json({

            success: true,

            message: "Notification deleted successfully."

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================================
// Create Notification
// Internal Helper Function
// Used by Order, Payment and Shipping Modules
// ======================================================

exports.createNotification = async (

    user,

    title,

    message,

    type = "system",

    referenceId = null,

    referenceModel = null

) => {

    try {

        return await Notification.create({

            user,

            title,

            message,

            type,

            referenceId,

            referenceModel

        });

    } catch (error) {

        console.error("Notification Error:", error.message);

    }

};