// controllers/productController.js
const Product = require("../../model/Product_Model/ProductModel");

// ➕ Add new product
exports.addProduct = async (req, res) => {
  try {
    const {
      Product_Number,
      Product_Name,
      Category,
      Weight,
      Price,
      Expire_Date,
      Quantity,
      Description,
    } = req.body;

    console.log("📩 Body:", req.body);
    console.log("📸 Files:", req.files);

    const images = req.files ? req.files.map(file => file.filename) : [];

    const newProduct = new Product({
      Product_Number,
      Product_Name,
      Category,
      Weight,
      Price,
      Expire_Date,
      Quantity,
      Description,
      Product_Images: images,
    });

    await newProduct.save();
    res.status(201).json({ message: "✅ Product added successfully", product: newProduct });
  } catch (err) {
    console.error("❌ AddProduct Error:", err);
    res.status(500).json({ error: "Server error while adding product" });
  }
};

// 📖 Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.error("❌ GetProducts Error:", err);
    res.status(500).json({ error: "Server error while fetching products" });
  }
};

// 📖 Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (err) {
    console.error("❌ GetProductById Error:", err);
    res.status(500).json({ error: "Server error while fetching product" });
  }
};

// ✏️ Update product
exports.updateProduct = async (req, res) => {
  try {
    const {
      Product_Number,
      Product_Name,
      Category,
      Weight,
      Price,
      Expire_Date,
      Quantity,
      Description,
    } = req.body;

    console.log("📩 Update Body:", req.body);
    console.log("📸 Update Files:", req.files);

    const images = req.files ? req.files.map(file => file.filename) : [];

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        Product_Number,
        Product_Name,
        Category,
        Weight,
        Price,
        Expire_Date,
        Quantity,
        Description,
        ...(images.length > 0 && { Product_Images: images }), // update only if new images uploaded
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "✅ Product updated successfully", product: updatedProduct });
  } catch (err) {
    console.error("❌ UpdateProduct Error:", err);
    res.status(500).json({ error: "Server error while updating product" });
  }
};

// 🗑️ Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });

    res.status(200).json({ message: "✅ Product deleted successfully" });
  } catch (err) {
    console.error("❌ DeleteProduct Error:", err);
    res.status(500).json({ error: "Server error while deleting product" });
  }
};
