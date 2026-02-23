const Supports = require("../../model/SupportModel/SupportModel");

// Get all supports
const getAllSupports = async (req, res, next) => {
  try {
    const supports = await Supports.find();
    if (!supports || supports.length === 0) {
      return res.status(404).json({ message: "Support not found" });
    }
    return res.status(200).json({ supports });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Add support
const addSupports = async (req, res, next) => {
  const { name, ticketID, subject, message, status } = req.body;

  try {
    const support = new Supports({ name, ticketID, subject, message, status });
    await support.save();
    return res.status(201).json({ support });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error while saving support", error: err });
  }
};

// Get support by ID
const getById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const support = await Supports.findById(id);
    if (!support) {
      return res.status(404).json({ message: "Support not found" });
    }
    return res.status(200).json({ support });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Update support
const updateSupport = async (req, res, next) => {
  const id = req.params.id;
  const { name, ticketID, subject, message, status } = req.body;

  try {
    let support = await Supports.findByIdAndUpdate(
      id,
      { name, ticketID, subject, message, status },
      { new: true }
    );
    if (!support) {
      return res.status(404).json({ message: "Unable to update support details" });
    }
    return res.status(200).json({ support });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

// Delete support
const deleteSupport = async (req, res, next) => {
  const id = req.params.id;
  try {
    const support = await Supports.findByIdAndDelete(id);
    if (!support) {
      return res.status(404).json({ message: "Unable to delete support details" });
    }
    return res.status(200).json({ support });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error", error: err });
  }
};

exports.getAllSupports = getAllSupports;
exports.addSupports = addSupports;
exports.getById = getById;
exports.updateSupport = updateSupport;
exports.deleteSupport = deleteSupport;
