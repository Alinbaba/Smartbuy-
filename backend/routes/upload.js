const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const { protect } = require("../middleware/authMiddleware");

const { authorize } = require("../middleware/roleMiddleware");

const {

    uploadSingleFile,

    uploadMultipleFiles,

    getUploadById,

    getMyUploads,

    getAllUploads,

    updateUpload,

    deleteUpload,

    restoreUpload,

    permanentlyDeleteUpload,

    getUploadStatistics

} = require("../controllers/uploadController");
// ======================================
// Upload Single File
// ======================================

router.post(

    "/single",

    protect,

    upload.single("file"),

    uploadSingleFile

);

// ======================================
// Upload Multiple Files
// ======================================

router.post(

    "/multiple",

    protect,
    
    upload.array("files"),
    
    uploadMultipleFiles
    );

    // ======================================
// Get My Uploads
// ======================================

router.get(

    "/my-uploads",

    protect,

    getMyUploads

);

// ======================================
// Get Upload By ID
// ======================================

router.get(

    "/:id",

    protect,

    getUploadById

);

// ======================================
// Get All Uploads (Admin)
// ======================================

router.get(

    "/",

    protect,

    authorize("admin", "super-admin"),

    getAllUploads

);

// ======================================
// Update Upload
// ======================================

router.put(

    "/:id",

    protect,

    updateUpload

);

// ======================================
// Soft Delete Upload
// ======================================

router.delete(

    "/:id",

    protect,

    deleteUpload

);

// ======================================
// Restore Upload
// ======================================

router.patch(

    "/restore/:id",

    protect,

    authorize("admin", "super-admin"),

    restoreUpload

);

// ======================================
// Permanently Delete Upload
// ======================================

router.delete(

    "/permanent/:id",

    protect,

    authorize("super-admin"),

    permanentlyDeleteUpload

);

// ======================================
// Upload Statistics
// ======================================

router.get(

    "/statistics/dashboard",

    protect,

    authorize("admin", "super-admin"),

    getUploadStatistics

);

// ======================================
// Export Router
// ======================================

module.exports = router;
