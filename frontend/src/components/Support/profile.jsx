// src/components/SupportAgentProfileForm.jsx
import React, { useState } from "react";
import profile from "../../assets/profile.jpg";

function SupportAgentProfileForm() {
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Silva",
    email: "john.silva@example.com",
    contactNumber: "+94 71 234 5678",
    bio: "I’m a friendly and experienced support agent with over 5 years of customer service expertise. I love solving problems and helping users.",
    verificationStatus: "Pending",
    profileImage: null,
  });

  const [preview, setPreview] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      const response = await fetch("http://localhost:5000/api/sellers/add", {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      alert("✅ Seller profile saved successfully!");
      console.log(result);
      setIsEditing(false);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Failed to save seller profile.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 p-6">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-2xl p-8 md:p-12 space-y-6">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 relative">
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover rounded-full border-4 border-orange-400 shadow-md"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-2 cursor-pointer hover:bg-orange-600 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                📷
              </label>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {isEditing ? "Change Agent Photo" : "Agent Photo"}
          </p>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800">
          Support Agent Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
              onChange={handleChange}
              value={formData.firstName}
              disabled={!isEditing}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
              onChange={handleChange}
              value={formData.lastName}
              disabled={!isEditing}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            onChange={handleChange}
            value={formData.email}
            disabled={!isEditing}
            required
          />

          <input
            type="text"
            name="contactNumber"
            placeholder="Contact Number"
            className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            onChange={handleChange}
            value={formData.contactNumber}
            disabled={!isEditing}
            required
          />

          <textarea
            name="bio"
            placeholder="About Agent / Bio"
            className="border p-3 rounded-xl w-full h-28 focus:ring-2 focus:ring-orange-400 focus:outline-none transition"
            onChange={handleChange}
            value={formData.bio}
            disabled={!isEditing}
          />

          {isEditing ? (
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3 rounded-xl shadow-lg hover:bg-orange-600 transition"
            >
              Save Profile
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full bg-orange-500 text-white py-3 rounded-xl shadow-lg hover:bg-orange-600 transition"
            >
              ✏️ Edit Profile
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default SupportAgentProfileForm;
