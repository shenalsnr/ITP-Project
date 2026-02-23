import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AddProductForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Product_Number: "",
    Product_Name: "",
    Category: "",
    Weight: "",
    Price: "",
    Expire_Date: "",
    Quantity: "",
    Description: "",
    Product_Images: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "Product_Images") {
      setFormData({ ...formData, Product_Images: Array.from(files).slice(0, 2) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const data = new FormData();
    for (let key in formData) {
      if (key === "Product_Images") {
        formData.Product_Images.forEach((img) => data.append("Product_Images", img));
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      await axios.post("http://localhost:5000/api/products", data);
      alert("✅ Product added successfully!");
      navigate("/dataf"); // Navigate to ProductDetails page after success
    } catch (err) {
      console.error(err);
      alert("❌ Error adding product");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-gray-700 text-center mb-6">
          Add New Product
        </h2>

        {/* Grid Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input name="Product_Number" label="Product Number" onChange={handleChange} />
          <Input name="Product_Name" label="Product Name" onChange={handleChange} />
          <Input name="Category" label="Category" onChange={handleChange} />
          <Input name="Weight" label="Weight (kg)" type="number" onChange={handleChange} />
          <Input name="Price" label="Price" type="number" onChange={handleChange} />
          <Input name="Expire_Date" label="Expiry Date" type="date" onChange={handleChange} />
          <Input name="Quantity" label="Quantity" type="number" onChange={handleChange} />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="Description"
            placeholder="Write product details..."
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
            rows="4"
            required
          />
        </div>

        {/* Product Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Images (up to 2)
          </label>
          <input
            type="file"
            name="Product_Images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
          <div className="grid grid-cols-2 gap-4 mt-3">
            {formData.Product_Images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                alt={`Preview ${i + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

// Reusable input component
function Input({ name, label, type = "text", onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
        required
      />
    </div>
  );
}
