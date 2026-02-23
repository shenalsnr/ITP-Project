import React, { useState } from "react";

function SellerProfileForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    storeName: "",
    businessAddress: "",
    bio: "",
    verificationStatus: "Pending",
    profileImage: null,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input (profile photo)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare FormData for file upload
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    const response = await fetch("http://localhost:5000/api/sellers/add", {
      method: "POST",
      body: data, // send multipart/form-data
    });

    const result = await response.json();
    alert("Seller profile created successfully!");
    console.log(result);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-100 p-6">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-8">
        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <img
            src={preview || "https://via.placeholder.com/120"}
            alt=""
            className="w-28 h-28 rounded-full object-cover border-4 border-orange-400 shadow-md"
          />
          <label className="mt-3 text-sm font-medium text-gray-700">
            Upload Seller Photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 w-2/3 border p-2 rounded-md text-sm text-gray-600"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mt-6 mb-6">
          Create Seller Profile
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="border p-3 rounded-lg w-full"
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="border p-3 rounded-lg w-full"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            className="border p-3 rounded-lg w-full"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="storeName"
            placeholder="Store / Business Name"
            className="border p-3 rounded-lg w-full"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="businessAddress"
            placeholder="Business Address"
            className="border p-3 rounded-lg w-full"
            onChange={handleChange}
            required
          />

          <textarea
            name="bio"
            placeholder="About Seller / Bio"
            className="border p-3 rounded-lg w-full h-24"
            onChange={handleChange}
          ></textarea>

         
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg shadow-lg hover:bg-orange-600 transition"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default SellerProfileForm;
