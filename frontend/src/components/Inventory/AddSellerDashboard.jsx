// AddSellerDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { PlusCircle, List, Edit3, Trash2 } from "lucide-react";

export default function AddSellerDashboard() {
  const [sellers, setSellers] = useState([]);
  const [editingSeller, setEditingSeller] = useState(null);
  const [formData, setFormData] = useState({});

  // ✅ Fetch sellers
  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sellers");
      setSellers(res.data);
    } catch (err) {
      console.error("Error fetching sellers:", err);
    }
  };

  // ✅ Delete seller
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this seller?")) {
      try {
        await axios.delete(`http://localhost:5000/api/sellers/${id}`);
        setSellers(sellers.filter((s) => s._id !== id));
      } catch (err) {
        console.error("Error deleting seller:", err);
      }
    }
  };

  // ✅ Open edit popup
  const handleEdit = (seller) => {
    setEditingSeller(seller);
    setFormData({ ...seller });
  };

  // ✅ Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Update seller
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/sellers/${editingSeller._id}`,
        formData
      );
      alert("✅ Seller updated successfully!");
      setEditingSeller(null);
      fetchSellers();
    } catch (err) {
      console.error("Error updating seller:", err);
      alert("❌ Failed to update seller");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFF7ED]">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#f5a385] to-[#f5a385] shadow-lg p-4">
        <h2 className="text-white font-bold text-xl mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              {/* ✅ Fixed navigation route */}
              <Link
                to="/Slist"
                className="flex items-center gap-3 p-2 rounded text-white hover:bg-gray-800"
              >
                <PlusCircle size={20} /> Add Items
              </Link>
            </li>
            <li>
              <Link
                to="/SellerDetails"
                className="flex items-center gap-3 p-2 rounded text-white hover:bg-gray-800"
              >
                <List size={20} /> Seller Details
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller List</h1>

        {/* Seller Table */}
        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-700">
                <th className="p-3">Seller ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Contact Number</th>
                <th className="p-3">Email</th>
                <th className="p-3">Address</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((s) => (
                <tr key={s._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{s.Seller_ID}</td>
                  <td className="p-3">{s.Seller_Name}</td>
                  <td className="p-3">{s.Contact_Number}</td>
                  <td className="p-3">{s.Email}</td>
                  <td className="p-3">{s.Address}</td>
                  <td className="p-3 flex gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(s)}
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(s._id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Popup */}
        {editingSeller && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Update Seller
              </h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                {/* Seller Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seller Name
                  </label>
                  <input
                    type="text"
                    name="Seller_Name"
                    value={formData.Seller_Name || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="Contact_Number"
                    value={formData.Contact_Number || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="Email"
                    value={formData.Email || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    name="Address"
                    value={formData.Address || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingSeller(null)}
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
