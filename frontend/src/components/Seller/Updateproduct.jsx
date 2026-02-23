import React, { useState, useEffect } from "react";
import axios from "axios";
import { Package } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateProductForm() {
  const { id } = useParams(); // Get product ID from route (e.g., /update/:id)
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productNumber: "",
    productName: "",
    category: "",
    weight: "",
    price: "",
    expireDate: "",
    description: "",
    quantity: "",
    image: null,
  });

  // Fetch existing product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setFormData({
          productNumber: res.data.productNumber,
          productName: res.data.productName,
          category: res.data.category,
          weight: res.data.weight,
          price: res.data.price,
          expireDate: res.data.expireDate
            ? res.data.expireDate.split("T")[0]
            : "",
          description: res.data.description,
          quantity: res.data.quantity,
          image: null, // don't preload image file
        });
      } catch (err) {
        console.error(err);
        alert("❌ Failed to fetch product details");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null && formData[key] !== "")
        data.append(key, formData[key]);
    }

    try {
      await axios.put(`http://localhost:5000/api/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Product updated successfully!");
      navigate("/products"); // redirect after update
    } catch (err) {
      console.error(err);
      alert("❌ Error updating product");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100/20 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl shadow-lg overflow-hidden bg-transparent border border-gray-200 backdrop-blur-md"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 flex items-center gap-3">
          <Package className="text-white w-8 h-8" />
          <h2 className="text-2xl font-bold text-white">Update Product</h2>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {[
            { name: "productNumber", label: "Product Number", type: "text" },
            { name: "productName", label: "Product Name", type: "text" },
            { name: "category", label: "Category", type: "text" },
            { name: "weight", label: "Weight", type: "text" },
            { name: "price", label: "Price", type: "number" },
            { name: "expireDate", label: "Expire Date", type: "date" },
            { name: "quantity", label: "Quantity", type: "number" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none bg-transparent"
                required={field.name !== "expireDate"}
              />
            </div>
          ))}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image (optional)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 bg-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-400 outline-none bg-transparent resize-none"
              rows="4"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="p-6 border-t bg-gray-50/10">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-green-700 transition"
          >
            ♻️ Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
