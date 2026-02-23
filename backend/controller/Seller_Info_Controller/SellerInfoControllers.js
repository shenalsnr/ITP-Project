const SellerInfo = require("../../model/Seller_Info_Model/SellerInfoModel");

// Add, Get, Update, Delete functions



// ✅ Add SellerInfo
exports.addSeller = async (req, res) => {
  try {
    const newSeller = new SellerInfo(req.body);
    const savedSeller = await newSeller.save();
    res.status(201).json(savedSeller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all Sellers
exports.getSellers = async (req, res) => {
  try {
    const sellers = await SellerInfo.find();
    res.status(200).json(sellers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Seller
exports.updateSeller = async (req, res) => {
  try {
    const updatedSeller = await SellerInfo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedSeller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Seller
exports.deleteSeller = async (req, res) => {
  try {
    await SellerInfo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Seller deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
