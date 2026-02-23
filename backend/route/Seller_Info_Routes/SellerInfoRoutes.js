const express = require("express");
const router = express.Router();
const sellerController = require("../../controller/Seller_Info_Controller/SellerInfoControllers");

// Create seller
router.post("/", sellerController.addSeller);

// Get all sellers
router.get("/", sellerController.getSellers);

// Update seller
router.put("/:id", sellerController.updateSeller);

// Delete seller
router.delete("/:id", sellerController.deleteSeller);

module.exports = router;
