import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/customer");
        const data = res.data.customers || [];
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Search customers
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCustomers(customers.filter((c) => c.fullName.toLowerCase().includes(query)));
  };

  // Delete customer
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/customer/${id}`);
      const updatedList = customers.filter((c) => c._id !== id);
      setCustomers(updatedList);
      setFilteredCustomers(updatedList.filter((c) => c.fullName.toLowerCase().includes(searchQuery)));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Save edited customer
  const handleSave = async (updatedCustomer) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/customer/${updatedCustomer._id}`,
        updatedCustomer
      );
      const updatedList = customers.map((c) =>
        c._id === updatedCustomer._id ? res.data.customer : c
      );
      setCustomers(updatedList);
      setFilteredCustomers(updatedList.filter((c) => c.fullName.toLowerCase().includes(searchQuery)));
      setEditingCustomer(null);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading)
    return <div className="text-center mt-10 text-lg text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Customer Table</h1>

      {/* Search bar */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border rounded w-80"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="text-center p-10 bg-white shadow-2xl rounded-lg">
          <p className="text-2xl font-semibold text-gray-800">No Customers Found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="text-white">
              <tr className="bg-gradient-to-r from-rose-600 to-amber-500">
                <th className="py-3 px-6 text-left">#</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Password</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c, index) => (
                <tr key={c._id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6">{c.fullName}</td>
                  <td className="py-3 px-6">{c.email}</td>
                  <td className="py-3 px-6">{c.password}</td>
                  <td className="py-3 px-6">
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => setEditingCustomer(c)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Customer</h2>

            <input
              className="w-full border p-2 rounded mb-2"
              value={editingCustomer.fullName}
              onChange={(e) =>
                setEditingCustomer({ ...editingCustomer, fullName: e.target.value })
              }
            />
            <input
              className="w-full border p-2 rounded mb-4"
              value={editingCustomer.email}
              onChange={(e) =>
                setEditingCustomer({ ...editingCustomer, email: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingCustomer(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(editingCustomer)}
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
