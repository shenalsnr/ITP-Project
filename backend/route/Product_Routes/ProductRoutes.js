const express = require("express");
const router = express.Router();
const upload = require("../../Middleware/upload"); // ✅ middleware imported
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../../controller/Seller_management_controllers/sellerControllers");

// ➕ Add product with images (max 5)
router.post("/", upload.array("Product_Images", 5), addProduct);

// 📖 Get all products
router.get("/", getProducts);

// 📖 Get product by ID
router.get("/:id", getProductById);

// ✏️ Update product (new images optional)
router.put("/:id", upload.array("Product_Images", 5), updateProduct);

// 🗑️ Delete product
router.delete("/:id", deleteProduct);

module.exports = router;
