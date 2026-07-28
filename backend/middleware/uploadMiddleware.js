const multer = require("multer");

// Store files in memory before uploading to Cloudinary
const storage = multer.memoryStorage();

// Allowed MIME types
const allowedMimeTypes = [
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",

    // Videos
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm",

    // Documents
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    // Archives
    "application/zip",
    "application/x-zip-compressed",

    // Audio
    "audio/mpeg",
    "audio/mp4"
];

const fileFilter = (req, file, cb) => {

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type."), false);
    }

};

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 100 * 1024 * 1024 // 50MB

    }

});

module.exports = upload;
