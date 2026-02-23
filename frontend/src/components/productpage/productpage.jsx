// Frontend/src/components/product/AllProduct.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart } from "lucide-react";

export default function AllProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 bg-white dark:bg-zinc-900 min-h-[90vh]">
      <h2 className="text-2xl font-bold text-rose-900 dark:text-amber-100 mb-6">
        View All Products
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="rounded-xl border border-gray-200 bg-white shadow-md overflow-hidden hover:shadow-lg transition dark:bg-zinc-800 dark:border-gray-700"
            >
              {/* Product Image */}
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-amber-100 truncate">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 truncate">
                  {product.description}
                </p>
                <p className="text-rose-600 font-bold text-lg">
                  ${product.price}
                </p>

                {/* Add to Cart Button */}
                <button className="mt-3 flex items-center justify-center gap-2 w-full rounded-lg bg-rose-600 px-4 py-2 text-white font-medium hover:bg-rose-700 transition">
                  <ShoppingCart size={18} /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}