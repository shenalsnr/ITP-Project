const express = require("express");
const router = express.Router();

// ✅ Insert Model (corrected path)
const Support = require("../../model/SupportModel/SupportModel");

// ✅ Insert Support Controller (corrected path)
const SupportController = require("../../controller/SupportControllers/SupportControllers");

// Routes
router.get("/", SupportController.getAllSupports);
router.post("/", SupportController.addSupports);
router.get("/:id", SupportController.getById);
router.put("/:id", SupportController.updateSupport);
router.delete("/:id", SupportController.deleteSupport);

// Export
module.exports = router;
