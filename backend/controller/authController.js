const Customer = require("../model/customerModel");
const bcrypt = require("bcryptjs");

// POST /api/customer/login
exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Respond with customer details (without password)
    res.json({
      message: "Login successful",
      customer: {
        id: customer._id,
        email: customer.email,
        role: customer.role, // make sure role exists in your schema
        name: customer.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
