// Frontend/src/components/product/AllProduct.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Star, Search, Link } from "lucide-react";
import { useNavigate } from "react-router-dom"; // <-- Added import
import Navbar from "../Navbar/Navbar";


export default function AllProduct() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate(); // <-- Initialize navigate

  // Fetch products from backend
  console.log("Fetching products...");
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setFilteredProducts(res.data);
        console.log("all data:", res.data);
        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            res.data.map((p) => p.Category || p.category || "Uncategorized")
          ),
        ];
        setCategories(["All Categories", ...uniqueCategories]);

        console.log("✅ Products fetched:", res.data);
        setLoading(false);
        console.log(res);
      })
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        (p.Product_Name || p.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(
        (p) => (p.Category || p.category || "Uncategorized") === selectedCategory
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-600 text-lg animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  return (
      <div>

        <Navbar />
      

    <div className="px-6 py-12 bg-gradient-to-b from-rose-50 to-orange-50 dark:from-zinc-900 dark:to-zinc-800 min-h-[90vh]">
      {/* Header */}
      <h2 className="text-3xl font-extrabold text-center text-rose-700 dark:text-amber-200 mb-10 tracking-wide">
        Find Your Perfect Spices
      </h2>

      {/* 🔍 Search + Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
        {/* Search Bar */}
        <div className="flex items-center w-full md:w-1/2 rounded-xl border border-gray-300 shadow-sm bg-white px-4 py-2 focus-within:ring-2 focus-within:ring-rose-400 dark:bg-zinc-800 dark:border-gray-700">
          <Search className="text-gray-400 mr-2" size={18} />
          <input
            type="text"
            placeholder="Search by product name: Ceylon cinnamon, cardamom, black pepper..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-gray-700 dark:text-gray-200"
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/4 rounded-xl border border-gray-300 bg-white px-4 py-2 shadow-sm focus:ring-2 focus:ring-rose-400 dark:bg-zinc-800 dark:border-gray-700 dark:text-gray-200"
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          No products found for your search.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {filteredProducts.map((product) => {
            const imageUrl = product.Product_Images?.[0]
              ? `http://localhost:5000/uploads/${product.Product_Images[0]}`
              : product.images?.[0]
              ? `http://localhost:5000/uploads/${product.images[0]}`
              : "https://via.placeholder.com/300";

            return (

            
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)} 
                className="group rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden dark:bg-zinc-800 dark:border-gray-700 relative"
              >
                {/* Category Tag */}
                <div className="absolute top-0 left-0 bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-br-2xl">
                  {product.Category || product.category || "WHOLE SPICES"}
                </div>

                {/* Product Image */}
                <div className="relative w-full h-52 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={product.Product_Name || product.name || "Product"}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="p-5 flex flex-col justify-between h-64">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-amber-100 line-clamp-1">
                      {product.Product_Name || product.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                      {product.Description ||
                        product.description ||
                        "No description available"}
                    </p>
                  </div>

                  {/* Price + Weight */}
                  <div className="mt-3">
                    <p className="text-rose-600 font-bold text-xl">
                      LKR {product.Price || product.price || "N/A"}
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                        per 100g
                      </span>
                    </p>
                    <span className="inline-block mt-1 text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                      {product.Weight || product.weight || "100"} kg
                    </span>
                    <span className="text-green-400 font-bold relative -right-32">
                      In Stock
                    </span>
                  </div>

                  {/* Rating + Seller */}
                  <div className="flex items-center justify-between text-sm mt-3 text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Star size={14} className="text-yellow-400" />
                      0.0 (0)
                    </span>
                    <span>by seller person</span>
                  </div>

                  {/* Button made navigable */}
                  <button
                     key={product._id}
                       
                    className="mt-4 flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 px-5 py-2.5 text-white font-medium shadow-md hover:opacity-90 hover:scale-[1.02] transition-transform duration-200"
                  >
                    <ShoppingCart size={18} /> Order Now
                  </button>
                </div>
              </div>
             
            );
          })}
        </div>
      )}
    </div>
    </div>
  );
}
