import React from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import Customer from "../Customer/Customer.jsx";

const AdminDash = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar with gradient */}
      <aside className="w-72 h-screen bg-gradient-to-b from-rose-600 to-amber-500 p-6 flex flex-col justify-between text-white">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Spice Admin</h2>

          <nav className="space-y-2">
            <Link
              to="/AdminDash/products"
              className="block p-2 rounded hover:bg-white/20 transition"
            >
              Products
            </Link>

            <Link
              to="/AdminDash/settings"
              className="block p-2 rounded hover:bg-white/20 transition"
            >
              Inventory
            </Link>

            <Link
              to="/AdminDash/orders"
              className="block p-2 rounded hover:bg-white/20 transition"
            >
              Orders
            </Link>
            <Link
              to="/AdminDash/customer"
              className="block p-2 rounded hover:bg-white/20 transition"
            >
              Customers
            </Link>

            <Link
              to="/AdminDash/settings"
              className="block p-2 rounded hover:bg-white/20 transition"
            >
              Payment
            </Link>



            <Link
              to="/AdminDash/settings"
              className="block p-2 rounded hover:bg-white/20 transition"
            >
              Settings
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold transition duration-300"
        >
          Logout
        </button>
      </aside>

      {/* Right content panel with white-based gradient */}
      <div className="flex-1 bg-gradient-to-r from-white to-gray-100 p-6">
        <Routes>
          <Route path="/customer" element={<Customer />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDash;
