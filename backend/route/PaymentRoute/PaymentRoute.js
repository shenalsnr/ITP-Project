const express = require("express");
const {
  listPayments,
  getPayment,
  createPayment,
  updatePayment,
  deletePayment,
  getReceipt,
} = require("../../controller/PaymentControl/PaymentSystemController");

const router = express.Router();

// Public/user routes
router.get("/", listPayments);
router.get("/:id", getPayment);
router.get("/:id/receipt", getReceipt);
router.post("/", createPayment);

// Admin ops (you can add auth middleware later)
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

module.exports = router;
