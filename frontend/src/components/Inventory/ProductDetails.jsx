// ProductDetails.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Home, PlusCircle, List, Edit3, Trash2, Search } from "lucide-react";

export default function ProductDetails() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter((p) => p._id !== id));
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  // ✅ Edit popup open
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({ ...product, Product_Images: null }); // reset image file
    setPreviewImage(
      product.Product_Images?.[0]
        ? `http://localhost:5000/uploads/${product.Product_Images[0]}`
        : null
    );
  };

  // ✅ Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, Product_Images: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ✅ Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("Product_Name", formData.Product_Name);
      data.append("Category", formData.Category);
      data.append("Weight", formData.Weight);
      data.append("Price", formData.Price);
      data.append("Expire_Date", formData.Expire_Date);
      data.append("Quantity", formData.Quantity);
      data.append("Description", formData.Description);
      if (formData.Product_Images) {
        data.append("Product_Images", formData.Product_Images);
      }

      await axios.put(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Product updated!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      alert("❌ Failed to update product");
    }
  };

  // ✅ Filter products based on search query
  const filteredProducts = products.filter(
    (p) =>
      p.Product_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.Product_Number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.Category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#FFF7ED]">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#f5a385] to-[#f5a385] shadow-lg p-4">
        <h2 className="text-white font-bold text-xl mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 p-2 rounded text-white hover:bg-gray-800"
              >
                <Home size={20} /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/addItems"
                className="flex items-center gap-3 p-2 rounded text-white hover:bg-gray-800"
              >
                <PlusCircle size={20} /> Add Items
              </Link>
            </li>
            <li>
              <Link
                to="/ItemDetails"
                className="flex items-center gap-3 p-2 rounded text-white hover:bg-gray-800"
              >
                <List size={20} /> Product Item Details
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Product Item Details
        </h1>

        {/* Search Bar (Right-aligned) */}
        <div className="mb-4 flex justify-end w-full absolute right-30 top-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white p-6 rounded-xl shadow overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left text-gray-700">
                <th className="p-3">Image</th>
                <th className="p-3">Product No.</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Weight</th>
                <th className="p-3">Price</th>
                <th className="p-3">Expire Date</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Description</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr
                  key={p._id}
                  className={`border-b hover:bg-gray-50 ${
                    searchQuery &&
                    (p.Product_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.Product_Number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      p.Category?.toLowerCase().includes(searchQuery.toLowerCase()))
                      ? "bg-yellow-100"
                      : ""
                  }`}
                >
                  <td className="p-3">
                    <img
                      src={
                        p.Product_Images?.[0]
                          ? `http://localhost:5000/uploads/${p.Product_Images[0]}`
                          : "https://via.placeholder.com/100"
                      }
                      alt={p.Product_Name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  </td>
                  <td className="p-3">{p.Product_Number}</td>
                  <td className="p-3">{p.Product_Name}</td>
                  <td className="p-3">{p.Category}</td>
                  <td className="p-3">{p.Weight}</td>
                  <td className="p-3 text-green-600 font-semibold">LKR {p.Price}</td>
                  <td className="p-3">
                    {p.Expire_Date ? new Date(p.Expire_Date).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-3">{p.Quantity}</td>
                  <td className="p-3">{p.Description}</td>
                  <td className="p-3 flex gap-3">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleEdit(p)}
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(p._id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Modern Popup with Image Update */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Update Product
              </h2>
              <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4">
                {/* Product Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Number
                  </label>
                  <input
                    type="text"
                    value={formData.Product_Number || ""}
                    disabled
                    className="w-full border rounded px-3 py-2 bg-gray-200 cursor-not-allowed"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="Product_Name"
                    value={formData.Product_Name || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="Category"
                    value={formData.Category || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight
                  </label>
                  <input
                    type="number"
                    name="Weight"
                    value={formData.Weight || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    name="Price"
                    value={formData.Price || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Expire Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expire Date
                  </label>
                  <input
                    type="date"
                    name="Expire_Date"
                    value={
                      formData.Expire_Date
                        ? formData.Expire_Date.split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="Quantity"
                    value={formData.Quantity || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="Description"
                    value={formData.Description || ""}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                {/* Product Image */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border rounded px-3 py-2"
                  />
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded-lg shadow-md"
                    />
                  )}
                </div>

                {/* Buttons */}
                <div className="col-span-2 flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
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
