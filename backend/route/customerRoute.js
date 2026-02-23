const express = require("express");
const router = express.Router();
const customerController = require("../controller/customerController");
const { loginCustomer } = require("../controller/authController");

// LOGIN must come before dynamic routes
router.post("/login", customerController.loginCustomer);

// ADD customer (Register)
router.post("/", customerController.addCustomer);

// Profile route (specific, before /:id)
router.get("/profile/:id", customerController.getProfile);

// GET all customers
router.get("/", customerController.getAllCustomers);

// GET customer by ID
router.get("/:id", customerController.getCustomerById);

// UPDATE customer
router.put("/:id", customerController.updateCustomer);

// DELETE customer
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
