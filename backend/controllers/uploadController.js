const Upload = require("../models/Upload");
const User = require("../models/User");
// ======================================
// Upload Single File
// ======================================

exports.uploadSingleFile = async (req, res) => {

    try {

        // Check if a file was uploaded

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No file uploaded."

            });

        }

        // Create upload record

        const upload = await Upload.create({

            uploadedBy: req.user.id,

            user: req.user.id,

            originalName: req.file.originalname,

            fileName: req.file.filename,

            fileUrl: req.file.path,

            filePath: req.file.path,

            fileType: req.file.mimetype.startsWith("image")
                ? "image"
                : req.file.mimetype.startsWith("video")
                ? "video"
                : req.file.mimetype.startsWith("audio")
                ? "audio"
                : "document",

            mimeType: req.file.mimetype,

            fileExtension: req.file.originalname.split(".").pop(),

            fileSize: req.file.size

        });

        res.status(201).json({

            success: true,

            message: "File uploaded successfully.",

            upload

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Upload Multiple Files
// ======================================

exports.uploadMultipleFiles = async (req, res) => {

    try {

        if (!req.files || req.files.length === 0) {

            return res.status(400).json({

                success: false,

                message: "No files uploaded."

            });

        }

        const uploads = [];

        for (const file of req.files) {

            const upload = await Upload.create({

                uploadedBy: req.user.id,

                user: req.user.id,

                originalName: file.originalname,

                fileName: file.filename,

                fileUrl: file.path,

                filePath: file.path,

                fileType: file.mimetype.startsWith("image")
                    ? "image"
                    : file.mimetype.startsWith("video")
                    ? "video"
                    : file.mimetype.startsWith("audio")
                    ? "audio"
                    : "document",

                mimeType: file.mimetype,

                fileExtension: file.originalname.split(".").pop(),

                fileSize: file.size

            });

            uploads.push(upload);

        }

        res.status(201).json({

            success: true,

            message: `${uploads.length} file(s) uploaded successfully.`,

            totalFiles: uploads.length,

            uploads

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Get Upload By ID
// ======================================

exports.getUploadById = async (req, res) => {

    try {

        const upload = await Upload.findById(req.params.id)
            .populate(
                "uploadedBy",
                "userId fullName username role email avatar"
            );

        if (!upload) {

            return res.status(404).json({

                success: false,

                message: "Upload not found."

            });

        }

        res.status(200).json({

            success: true,

            upload

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Get My Uploads
// ======================================

exports.getMyUploads = async (req, res) => {

    try {

        const uploads = await Upload.find({

            uploadedBy: req.user.id,

            isDeleted: false

        }).sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            totalUploads: uploads.length,

            uploads

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};// ======================================
// Get All Uploads
// Admin Only
// ======================================

exports.getAllUploads = async (req, res) => {

    try {

        const uploads = await Upload.find({

            isDeleted: false

        })

        .populate(

            "uploadedBy",

            "userId fullName username role"

        )

        .sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            totalUploads: uploads.length,

            uploads

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Update Upload Information
// ======================================

exports.updateUpload = async (req, res) => {

    try {

        const upload = await Upload.findById(req.params.id);

        if (!upload) {

            return res.status(404).json({

                success: false,

                message: "Upload not found."

            });

        }

        upload.folder = req.body.folder || upload.folder;

        upload.visibility = req.body.visibility || upload.visibility;

        upload.notes = req.body.notes || upload.notes;

        upload.usedFor = req.body.usedFor || upload.usedFor;

        upload.product = req.body.product || upload.product;

        upload.user = req.body.user || upload.user;

        upload.kyc = req.body.kyc || upload.kyc;

        upload.review = req.body.review || upload.review;

        upload.store = req.body.store || upload.store;

        upload.advertisement = req.body.advertisement || upload.advertisement;

        upload.order = req.body.order || upload.order;

        await upload.save();

        res.status(200).json({

            success: true,

            message: "Upload updated successfully.",

            upload

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Soft Delete Upload
// ======================================

exports.deleteUpload = async (req, res) => {

    try {

        const upload = await Upload.findById(req.params.id);

        if (!upload) {

            return res.status(404).json({

                success: false,

                message: "Upload not found."

            });

        }

        upload.isDeleted = true;

        upload.deletedAt = new Date();

        upload.deletedBy = req.user.id;

        await upload.save();

        res.status(200).json({

            success: true,

            message: "Upload deleted successfully."

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Restore Upload
// ======================================

exports.restoreUpload = async (req, res) => {

    try {

        const upload = await Upload.findById(req.params.id);

        if (!upload) {

            return res.status(404).json({

                success: false,

                message: "Upload not found."

            });

        }

        upload.isDeleted = false;

        upload.deletedAt = null;

        upload.deletedBy = null;

        await upload.save();

        res.status(200).json({

            success: true,

            message: "Upload restored successfully.",

            upload

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Permanently Delete Upload
// ======================================

exports.permanentlyDeleteUpload = async (req, res) => {

    try {

        const upload = await Upload.findById(req.params.id);

        if (!upload) {

            return res.status(404).json({

                success: false,

                message: "Upload not found."

            });

        }

        await Upload.findByIdAndDelete(req.params.id);

        res.status(200).json({

            success: true,

            message: "Upload permanently deleted."

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
// ======================================
// Upload Statistics
// Admin Dashboard
// ======================================

exports.getUploadStatistics = async (req, res) => {

    try {

        const totalUploads = await Upload.countDocuments();

        const activeUploads = await Upload.countDocuments({

            isDeleted: false

        });

        const deletedUploads = await Upload.countDocuments({

            isDeleted: true

        });

        const imageUploads = await Upload.countDocuments({

            fileType: "image"

        });

        const videoUploads = await Upload.countDocuments({

            fileType: "video"

        });

        const audioUploads = await Upload.countDocuments({

            fileType: "audio"

        });

        const documentUploads = await Upload.countDocuments({

            fileType: "document"

        });

        const uploads = await Upload.find({}, "fileSize");

        const totalStorageUsed = uploads.reduce(

            (total, upload) => total + upload.fileSize,

            0

        );

        res.status(200).json({

            success: true,

            statistics: {

                totalUploads,

                activeUploads,

                deletedUploads,

                imageUploads,

                videoUploads,

                audioUploads,

                documentUploads,

                totalStorageUsed

            }

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};