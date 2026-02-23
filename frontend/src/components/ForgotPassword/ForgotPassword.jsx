import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/customer/forgot-password",
        { email }
      );
      setMessage(res.data.message || "Check your email for reset instructions.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-[#FFF7ED]">
      <div className="md:w-[35%] shadow-2xl rounded-3xl overflow-hidden bg-white p-12 md:p-10">
        <h2 className="md:text-3xl font-bold text-gray-900 mb-6 text-center">
          Forgot Password
        </h2>

        <p className="text-center text-gray-600 mb-6">
          Enter your email address and we will send you instructions to reset your password.
        </p>

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

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-rose-600 hover:to-amber-600 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>

        {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}

        <p className="mt-6 text-center text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
