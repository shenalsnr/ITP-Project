import React from "react";
import logo from "../../assets/logo.png";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        {/* Upper navbar */}
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 py-3 px-6 shadow-md">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              className="font-bold text-2xl sm:text-3xl text-white flex items-center gap-2"
            >
              <img src={logo} alt="logo" className="w-15" />
              Celospice
            </Link>

            {/* Right side buttons */}
            <div className="flex items-center gap-x-5">
              {/* Cart Button */}
              <button
                onClick={() => alert("Cart not available")}
                className="bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 transition-all duration-200 text-white py-2 px-3 rounded-full flex items-center gap-2"
              >
                <span className="hidden group-hover:block">Cart</span>
                <FaShoppingCart />
              </button>

              {/* Profile Button */}
              <Link to="/CusProfile">
                <button className="bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 transition-all duration-200 text-white py-2 px-3 rounded-full flex items-center gap-2">
                  <span className="hidden group-hover:block">Profile</span>
                  <FaUserCircle />
                </button>
              </Link>

              {/* Login Button */}
              <Link to="/login">
                <button className="bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white py-2 px-6 rounded-full font-semibold shadow-md transition-all duration-200">
                  Log In
                </button>
              </Link>
            </div>
          </div>

          {/* Lower navbar */}
          <div className="bg-white py-2 mt-2">
            <div className="container mx-auto flex justify-center gap-8">
              <Link
                to="/"
                className="text-gray-900 font-bold hover:text-rose-600"
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="text-gray-900 font-bold hover:text-rose-600"
              >
                Shop
              </Link>
              <Link
                to="/AboutUs"
                className="text-gray-900 font-bold hover:text-rose-600"
              >
                About Us
              </Link>
              <Link
                to="/ContactUs"
                className="text-gray-900 font-bold hover:text-rose-600"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for page content so navbar doesn't overlap */}
      <div className="pt-36">{/* Page content goes here */}</div>
    </>
  );
};

export default Navbar;
