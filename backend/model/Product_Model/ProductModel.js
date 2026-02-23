const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
  Product_Number: { type: String, required: true },
  Product_Name: { type: String, required: true },
  Category: { type: String, required: true },
  Weight: { type: String, required: true },
  Price: { type: Number, required: true },
  Expire_Date: { type: Date },
  Quantity: { type: Number, required: true },
  Description: { type: String },
  Product_Images: [{ type: String }], // store image file names
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
