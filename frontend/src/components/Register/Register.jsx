import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserTag } from "react-icons/fa";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "buyer", // default role
    termsAccepted: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "phone") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/customer", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
      });

      console.log("Registration Success:", response.data);
      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFF7ED]  px-4">
      <div className="md:w-[40%] w-full shadow-2xl rounded-3xl bg-white overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-amber-500 p-6 text-center">
          <h2 className="text-3xl font-bold text-white">Create Your Account</h2>
        </div>

        {/* Form */}
        <div className="p-8 md:p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex items-center border rounded-xl px-4 py-3 bg-gray-50">
              <FaUser className="text-gray-500 mr-3" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-lg"
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center border rounded-xl px-4 py-3 bg-gray-50">
              <FaEnvelope className="text-gray-500 mr-3" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-lg"
                required
              />
            </div>

            {/* Phone */}
            <div className="flex items-center border rounded-xl px-4 py-3 bg-gray-50">
              <FaPhone className="text-gray-500 mr-3" />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-lg"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center border rounded-xl px-4 py-3 bg-gray-50">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-lg"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border rounded-xl px-4 py-3 bg-gray-50">
              <FaLock className="text-gray-500 mr-3" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-lg"
                required
              />
            </div>

            {/* Role Select */}
            <div className="flex items-center border rounded-xl px-4 py-3 bg-gray-50">
              <FaUserTag className="text-gray-500 mr-3" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full outline-none bg-transparent text-lg"
                required
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            {/* Terms */}
            <div className="flex items-center text-sm">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="w-5 h-5 rounded mr-2"
                required
              />
              <span className="text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms & Conditions
                </a>
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 to-amber-500 text-white py-4 rounded-xl font-semibold text-lg shadow-md hover:from-rose-700 hover:to-amber-600 transition duration-300"
            >
              Register
            </button>

            {/* Link to Login */}
            <p className="text-center text-gray-600 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
