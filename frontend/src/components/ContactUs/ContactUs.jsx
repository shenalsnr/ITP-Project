import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! We will get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="bg-[#FFF7ED] min-h-screen">
      <Navbar />

      <div className="max-w-10xl mx-auto p-10 md:p-10 flex flex-col md:flex-row gap-10">
        {/* Left Panel - Info */}
        <div className="flex-1 bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 p-10 rounded-3xl text-white flex flex-col justify-center shadow-lg">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h2>
          <p className="mb-8 text-lg md:text-xl opacity-90">
            Questions about <b>CeloSpice</b>? Our team is ready to help!
          </p>

          <div className="space-y-4 text-lg">
            <p className="flex items-center gap-3 hover:scale-105 transition">
              <HiMail className="text-2xl" /> support@celospice.com
            </p>
            <p className="flex items-center gap-3 hover:scale-105 transition">
              <HiPhone className="text-2xl" /> +94 77 123 4567
            </p>
            <p className="flex items-center gap-3 hover:scale-105 transition">
              <HiLocationMarker className="text-2xl" /> Colombo, Sri Lanka
            </p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 bg-white p-10 md:p-12 rounded-3xl shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:outline-none text-lg"
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:outline-none text-lg"
            />

            {/* Message */}
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              placeholder="Your Message"
              required
              className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:outline-none text-lg"
            ></textarea>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 via-rose-500 to-amber-500 text-white py-4 rounded-2xl font-semibold text-xl hover:from-rose-600 hover:to-amber-600 transition duration-300 shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
