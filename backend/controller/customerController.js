const Customer = require("../model/customerModel");

// -------------------- GET all customers --------------------
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select("-password");
    res.status(200).json({ customers });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------- GET single customer by ID --------------------
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "null" || id === "undefined") {
    return res.status(400).json({ message: "Invalid or missing customer ID" });
  }

  try {
    const customer = await Customer.findById(id).select("-password");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ customer });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// -------------------- ADD customer (Register) --------------------
exports.addCustomer = async (req, res) => {
  const { fullName, email, phone, password, role } = req.body; // Added phone
  try {
    // Check if email already exists
    const existing = await Customer.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    const customer = new Customer({ fullName, email, phone, password, role }); // Added phone
    await customer.save();

    res
      .status(201)
      .json({ message: "Customer added successfully", customer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Unable to add customer", error: err.message });
  }
};


// -------------------- LOGIN customer --------------------
exports.loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        role: customer.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Unable to login", error: err.message });
  }
};

// -------------------- UPDATE customer --------------------
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "null" || id === "undefined") {
    return res.status(400).json({ message: "Invalid or missing customer ID" });
  }

  const { fullName, email, password, role } = req.body;

  try {
    const customer = await Customer.findById(id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    if (email && email !== customer.email) {
      const existing = await Customer.findOne({ email });
      if (existing) return res.status(400).json({ message: "Email already exists" });
      customer.email = email;
    }

    if (fullName) customer.fullName = fullName;
    if (password) customer.password = password;
    if (role) customer.role = role;

    await customer.save();
    res.status(200).json({ message: "Customer updated", customer });
  } catch (err) {
    res.status(500).json({ message: "Unable to update customer", error: err.message });
  }
};

// -------------------- DELETE customer --------------------
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "null" || id === "undefined") {
    return res.status(400).json({ message: "Invalid or missing customer ID" });
  }

  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ message: "Customer deleted successfully", customer });
  } catch (err) {
    res.status(500).json({ message: "Unable to delete customer", error: err.message });
  }
};

// -------------------- GET PROFILE (by logged-in user ID) --------------------
exports.getProfile = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "null" || id === "undefined") {
    return res.status(400).json({ message: "Invalid or missing user ID" });
  }

  try {
    const customer = await Customer.findById(id).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ customer });
  } catch (err) {
    console.error("Error fetching profile:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
