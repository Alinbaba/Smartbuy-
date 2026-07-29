const express = require("express");

const router = express.Router();

const {

    createPurchaseOrder,

    getAllPurchaseOrders,

    getPurchaseOrderById,

    updatePurchaseOrder,

    deletePurchaseOrder,

    approvePurchaseOrder,

    receivePurchaseOrder,

    cancelPurchaseOrder

} = require("../controllers/purchaseOrderController");
const {

    protect

} = require("../middleware/authMiddleware");
router.post("/", protect, createPurchaseOrder);

router.get("/", protect, getAllPurchaseOrders);

router.get("/:id", protect, getPurchaseOrderById);

router.put("/:id", protect, updatePurchaseOrder);

router.delete("/:id", protect, deletePurchaseOrder);
router.put("/:id/approve", protect, approvePurchaseOrder);
router.put("/:id/receive", protect, receivePurchaseOrder);
router.put("/:id/cancel", protect, cancelPurchaseOrder);
module.exports = router;
