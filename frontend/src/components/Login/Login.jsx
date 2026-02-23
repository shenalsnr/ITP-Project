import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/customer/login", {
        email,
        password,
      });

      const customer = res.data.customer; // backend sends { customer: {...} }

      // Save user details in localStorage
      localStorage.setItem("userId", customer._id);
      localStorage.setItem("userRole", customer.role);

      alert("Login successful");

      // Role-based redirect
      if (customer.role === "admin") {
        navigate("/AdminDash");
      } else if (customer.role === "seller") {
        navigate("/Addsellerdashboard");
      } else if (customer.role === "buyer") {
        navigate("/Homepage");
      } else {
        navigate("/"); // fallback
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FFF7ED]  px-4">
      <div className="md:w-[35%] shadow-2xl rounded-3xl overflow-hidden bg-white">
        <div className="w-full p-12 md:p-10">
          <h2 className="md:text-3xl font-bold text-gray-900 mb-10 text-center">
            Sign in to Your Account
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-5 py-4 text-lg border border-gray-300 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* Forgot Password Link */}
              <div className="text-right mt-2">
                <Link
                  to="/ForgotPassword"
                  className="text-blue-600 font-semibold hover:underline text-sm"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 to-amber-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-rose-700 hover:to-amber-600 transition duration-300"
            >
              Sign In
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/Register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
