const express = require("express");

const router = express.Router();

const {

    createBrand,

    getAllBrands,

    getBrandById,

    updateBrand,

    deleteBrand

} = require("../controllers/brandController");
const {    protect} = require("../middleware/authMiddleware");
router.post("/", protect, createBrand);

router.get("/", protect, getAllBrands);

router.get("/:id", protect, getBrandById);

router.put("/:id", protect, updateBrand);

router.delete("/:id", protect, deleteBrand);
module.exports = router;