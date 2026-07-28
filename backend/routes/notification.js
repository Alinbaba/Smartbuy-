// ======================================================
// SmartBuy Notification Routes
// ======================================================


// ======================================================
// Import Packages
// ======================================================

const express = require("express");

const router = express.Router();


// ======================================================
// Import Notification Controller
// ======================================================

const {

    getMyNotifications,

    markNotificationAsRead,

    markAllNotificationsAsRead,

    deleteNotification

} = require("../controllers/notificationController");


// ======================================================
// Import Authentication Middleware
// ======================================================

const {

    protect

} = require("../middleware/authMiddleware");// ======================================================
// Get My Notifications
// ======================================================

router.get(

    "/",

    protect,

    getMyNotifications

);


// ======================================================
// Mark One Notification as Read
// ======================================================

router.put(

    "/:id/read",

    protect,

    markNotificationAsRead

);


// ======================================================
// Mark All Notifications as Read
// ======================================================

router.put(

    "/read-all",

    protect,

    markAllNotificationsAsRead

);
// ======================================================
// Delete Notification
// ======================================================

router.delete(

    "/:id",

    protect,

    deleteNotification

);


// ======================================================
// Export Router
// ======================================================

module.exports = router;