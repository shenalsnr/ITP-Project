import React, { useState } from "react";
import axios from "axios";
import { Package } from "lucide-react";

export default function AddProductForm() {
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
      // Limit to 2 images
      const selectedFiles = Array.from(files).slice(0, 2);
      setFormData({ ...formData, Product_Images: selectedFiles });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      window.location.href = "/Addsellerdashboard";
    } catch (err) {
      console.error(err);
      alert("❌ Error adding product");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED] p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl shadow-lg overflow-hidden bg-transparent border border-gray-200 backdrop-blur-md"
      >
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-center gap-3">
          <Package className="text-white w-8 h-8" />
          <h2 className="text-2xl font-bold text-white">Add New Product</h2>
        </div>

        <div className="p-6 space-y-5">
          <InputField name="Product_Number" label="Product Number" type="text" onChange={handleChange} />
          <InputField name="Product_Name" label="Product Name" type="text" onChange={handleChange} />
          <InputField name="Category" label="Category" type="text" onChange={handleChange} />
          <InputField name="Weight" label="Weight (kg)" type="number" onChange={handleChange} />
          <InputField name="Price" label="Price" type="number" onChange={handleChange} />
          <InputField name="Expire_Date" label="Expire Date" type="date" onChange={handleChange} />
          <InputField name="Quantity" label="Quantity" type="number" onChange={handleChange} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (up to 2)</label>
            <input
              type="file"
              name="Product_Images"
              accept="image/*"
              multiple
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 bg-transparent"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="Description"
              placeholder="Write product details..."
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none bg-transparent resize-none"
              rows="4"
              required
            />
          </div>
        </div>
        

        <div className="p-6 border-t bg-gray-50/10">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable InputField Component
function InputField({ name, label, type, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none bg-transparent"
        required
      />
    </div>
  );
}
