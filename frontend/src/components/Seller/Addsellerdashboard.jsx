import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ShoppingCart,
  DollarSign,
  Package,
  Bell,
  Clock,
  Truck,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Home,
  List,
  Store,
  CreditCard,
  LifeBuoy,
  Settings,
  Boxes,
  Edit3,
  Trash2,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function SellerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ new state for search

  // ✅ Dummy data for activities
  const activities = [
    { id: 1, text: "Order #1024 has been shipped", icon: <Truck size={16} className="text-green-600" /> },
    { id: 2, text: "Product stock updated", icon: <RefreshCcw size={16} className="text-blue-600" /> },
    { id: 3, text: "Payment of LKR 12,000 received", icon: <CheckCircle2 size={16} className="text-green-600" /> },
    { id: 4, text: "Order #1022 was canceled", icon: <XCircle size={16} className="text-red-600" /> },
  ];

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // ✅ Filter products by search
  const filteredProducts = products.filter(
    (p) =>
      p.Product_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.Product_Number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.Category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ Handlers for edit and delete
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/products/${selectedProduct._id}`, selectedProduct);
      setProducts(products.map(p => p._id === selectedProduct._id ? selectedProduct : p));
      setModalOpen(false);
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleDelete = async (productNumber) => {
    const productToDelete = products.find(p => p.Product_Number === productNumber);
    if (!productToDelete) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productToDelete._id}`);
        setProducts(products.filter(p => p.Product_Number !== productNumber));
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFF7ED]">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-[#f5a385] to-[#f5a385] shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className={`text-lg font-bold text-gray-800 ${!sidebarOpen && "hidden"}`}>MyStore</h2>
          <button
            className="p-1 rounded hover:bg-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? "<" : ">"}
          </button>
        </div>

        <nav className="mt-4">
          <ul className="space-y-1">
            {[
              { name: "Home", icon: <Home size={20} />, path: "/" },
              { name: "Dashboard", icon: <Package size={20} />, path: "/dashboard" },
              { name: "List Product", icon: <List size={20} />, path: "/listproduct" },
              { name: "My Store", icon: <Store size={20} />, path: "/store" },
              { name: "Finance", icon: <CreditCard size={20} />, path: "/finance" },
              { name: "Delivery", icon: <Truck size={20} />, path: "/delivery" },
              { name: "Inventory", icon: <Boxes size={20} />, path: "/inventory" },
              { name: "Support", icon: <LifeBuoy size={20} />, path: "/support" },
              { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
            ].map((item, i) => (
              <li key={i}>
                <Link
                  to={item.path}
                  className="flex items-center gap-3 p-3 hover:bg-gray-100 transition rounded"
                >
                  <span className="text-white">{item.icon}</span>
                  <span className={`${!sidebarOpen && "hidden"} text-white font-medium`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here’s what’s happening today.</p>
        </header>

        {/* Top Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#f5a385] rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition">
            <Package className="text-green-600 w-10 h-10 p-2 bg-green-100 rounded-full" />
            <div>
              <h3 className="text-gray-500 text-sm">Total Products</h3>
              <p className="text-xl font-bold text-gray-800">{products.length}</p>
            </div>
          </div>
          <div className="bg-[#f5a385] rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition">
            <ShoppingCart className="text-blue-600 w-10 h-10 p-2 bg-blue-100 rounded-full" />
            <div>
              <h3 className="text-gray-500 text-sm">Daily Sales</h3>
              <p className="text-xl font-bold text-gray-800">25</p>
            </div>
          </div>
          <div className="bg-[#f5a385] rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition">
            <DollarSign className="text-yellow-600 w-10 h-10 p-2 bg-yellow-100 rounded-full" />
            <div>
              <h3 className="text-gray-500 text-sm">Revenue</h3>
              <p className="text-xl font-bold text-gray-800">LKR 56,000</p>
            </div>
          </div>
          <div className="bg-[#f5a385] rounded-xl shadow p-5 flex items-center gap-4 hover:shadow-md transition">
            <Bell className="text-red-600 w-10 h-10 p-2 bg-red-100 rounded-full" />
            <div>
              <h3 className="text-gray-500 text-sm">Notifications</h3>
              <p className="text-xl font-bold text-gray-800">12</p>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product List */}
          <section className="lg:col-span-2 bg-white p-8 rounded-xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Product List</h3>

              {/* ✅ Search Bar */}
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

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-600 text-base">
                    <th className="p-4">Image</th>
                    <th className="p-4">Product No.</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Weight</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Expiry Date</th>
                    <th className="p-4">Quantity</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr
                      key={p._id}
                      className={`border-b hover:bg-gray-50 text-gray-700 ${
                        searchQuery &&
                        (p.Product_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.Product_Number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.Category?.toLowerCase().includes(searchQuery.toLowerCase()))
                          ? "bg-yellow-100"
                          : ""
                      }`}
                    >
                      <td className="p-4">
                        <img
                          src={
                            p.Product_Images?.[0]
                              ? `http://localhost:5000/uploads/${p.Product_Images[0]}`
                              : "https://via.placeholder.com/150"
                          }
                          alt={p.Product_Name}
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                      </td>
                      <td className="p-4 font-medium">{p.Product_Number}</td>
                      <td className="p-4">{p.Product_Name}</td>
                      <td className="p-4">{p.Category}</td>
                      <td className="p-4">{p.Weight}</td>
                      <td className="p-4 text-green-600 font-semibold">LKR {p.Price}</td>
                      <td className="p-4">
                        {p.Expire_Date ? new Date(p.Expire_Date).toLocaleDateString() : "-"}
                      </td>
                      <td className="p-4">{p.Quantity}</td>
                      <td className="p-4">{p.Description}</td>
                      <td className="p-4 flex gap-3">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => handleEditClick(p)}
                        >
                          <Edit3 size={20} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(p.Product_Number)}
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Activities */}
          <section className="bg-white p-5 rounded-xl shadow max-h-[600px] max-w-400 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Recent Activities</h3>
            <div className="relative border-l border-gray-300 ml-4">
              {activities.map((a, i) => (
                <div key={a.id} className="mb-6 ml-6">
                  <span className="absolute -left-4 flex items-center justify-center w-8 h-8 bg-white border-2 border-green-500 rounded-full">
                    {a.icon}
                  </span>
                  <div className="bg-gray-50 p-3 rounded-lg shadow hover:shadow-md transition">
                    <p className="text-gray-800 font-medium">{a.text}</p>
                    <span className="text-sm text-gray-500 flex items-center mt-1">
                      <Clock size={14} className="mr-1 text-gray-400" />
                      {` ${i + 1}h ago`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Modal for Update */}
      {modalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-1/2 p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Update Product</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {[
                "Product_Number",
                "Product_Name",
                "Category",
                "Weight",
                "Price",
                "Expire_Date",
                "Quantity",
                "Description",
              ].map((field) => (
                <div key={field}>
                  <label className="block mb-1 font-medium">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type={
                      field.includes("Price") ||
                      field.includes("Weight") ||
                      field.includes("Quantity")
                        ? "number"
                        : field.includes("Expire_Date")
                        ? "date"
                        : "text"
                    }
                    name={field}
                    value={selectedProduct[field] || ""}
                    onChange={handleModalChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
