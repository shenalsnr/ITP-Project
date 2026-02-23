const mongoose = require("mongoose");

const SellerSchema = new mongoose.Schema(
  {
    Seller_ID: { type: String, required: true },
    Seller_Name: { type: String, required: true },
    Contact_Number: { type: String, required: true },
    Email: { type: String, required: true },
    Address: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SellerInfo", SellerSchema);
