// src/pages/Product.jsx
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000/api";


export default function Product() {
  const { id } = useParams(); // /products/:id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE}/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("❌ Error fetching product:", err?.response?.data || err.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className="text-yellow-500 text-xl">★</span>);
      } else if (i - rating < 1) {
        stars.push(
          <span key={i} className="text-yellow-500 text-xl relative inline-block">
            <span className="absolute overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
              ★
            </span>
            <span className="text-gray-300">★</span>
          </span>
        );
      } else {
        stars.push(<span key={i} className="text-gray-300 text-xl">★</span>);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-600 text-lg animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-red-600 text-lg">Product not found!</p>
      </div>
    );
  }

  const productImages =
    product.Product_Images?.map((img) => `${API_BASE.replace("/api","")}/uploads/${img}`) || [];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-100 sticky top-0 z-50 p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer">Cylon Spice</h1>
        <nav>
          <ul className="flex gap-6">
            <li className="text-gray-700 hover:text-indigo-600 cursor-pointer">Home</li>
            <li className="text-gray-700 hover:text-indigo-600 cursor-pointer">Products</li>
            <li className="text-gray-700 hover:text-indigo-600 cursor-pointer">Cart</li>
          </ul>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 p-6 w-full">
        <div className="flex flex-col md:flex-row gap-12 w-full max-w-[1400px] mx-auto">
          {/* Image Slider */}
          <div className="flex flex-col md:w-1/2 gap-4">
            <div className="relative w-full">
              <img
                src={productImages[mainImage] || "https://via.placeholder.com/500"}
                alt={product.Product_Name}
                className="rounded-lg w-full h-auto object-cover shadow-md"
              />
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setMainImage((prev) => (prev - 1 + productImages.length) % productImages.length)
                    }
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow"
                  >
                    &#10094;
                  </button>
                  <button
                    onClick={() =>
                      setMainImage((prev) => (prev + 1) % productImages.length)
                    }
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow"
                  >
                    &#10095;
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {productImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${product.Product_Name} ${idx + 1}`}
                  className={`w-24 h-24 object-cover rounded-lg border cursor-pointer hover:scale-105 transition ${
                    mainImage === idx ? "border-indigo-600" : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(idx)}
                />
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col justify-between text-gray-800">
            <h2 className="text-4xl font-bold mb-2">{product.Product_Name}</h2>

            <div className="flex items-center gap-2 mb-4">
              <div>{renderStars(product.rating || 4)}</div>
              <span className="text-gray-600 text-lg">
                {product.rating || 4} ({product.reviews || 0} reviews)
              </span>
            </div>

            <p className="text-indigo-600 font-bold text-3xl mb-4">LKR {product.Price}</p>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p><span className="font-semibold">Product Number:</span> {product.Product_Number || "-"}</p>
                <p><span className="font-semibold">Category:</span> {product.Category}</p>
                <p><span className="font-semibold">Weight:</span> {product.Weight}</p>
                <p><span className="font-semibold">Stock:</span> {product.Stock || "N/A"}</p>
              </div>
              <div>
                <p><span className="font-semibold">Brand:</span> {product.Brand || "Cylon Natural Product"}</p>
                <p><span className="font-semibold">Seller:</span> {product.Seller || "Cylon Spice"}</p>
                <p><span className="font-semibold">Shipping:</span> {product.Shipping || "Free Express Shipping"}</p>
                <p><span className="font-semibold">Expire Date:</span> {product.ExpireDate || "1 Year"}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-300 mb-4">
              <nav className="-mb-px flex gap-6">
                {["description", "features", "reviews"].map((t) => (
                  <button
                    key={t}
                    className={`pb-2 font-semibold ${
                      activeTab === t
                        ? "border-b-2 border-indigo-600 text-indigo-600"
                        : "text-gray-600 hover:text-indigo-600"
                    }`}
                    onClick={() => setActiveTab(t)}
                  >
                    {t[0].toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mb-6 text-gray-800">
              {activeTab === "description" && <p>{product.Description || "No description available."}</p>}
              {activeTab === "features" && (
                <ul className="list-disc list-inside">
                  {product.Features?.map((f, i) => <li key={i}>{f}</li>) || <li>Export Quality</li>}
                </ul>
              )}
              {activeTab === "reviews" && (
                <p>{product.reviews || 0} reviews with average rating of {product.rating || 4} ★</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4">
              {/* 👇 Pass productId & qty to Cart via route state */}
              <Link
                to="/cart"
                state={{ productId: product._id || id, qty: 1 }}
              >
                <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg shadow hover:bg-indigo-700 transition text-lg font-semibold">
                  Add to Cart
                </button>
              </Link>

               <Link to="/checkout" state={{ productId: product._id || id, qty: 1 }}>
                <button className="bg-gray-200 text-gray-800 px-8 py-4 rounded-lg shadow hover:bg-gray-300 transition text-lg font-semibold">
                  Buy Now
                </button>
              </Link> 
            </div>
          </div>
        </div>
      </main>

      <footer className="p-4 text-center text-gray-600 mt-6">
        &copy; 2025 eShop. All rights reserved.
      </footer>
    </div>
  );
}
