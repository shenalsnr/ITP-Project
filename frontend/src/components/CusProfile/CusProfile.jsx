import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



// PDF imports
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [nameEdit, setNameEdit] = useState(false);
  const [newName, setNewName] = useState("");
  const [phoneEdit, setPhoneEdit] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showChangePassword, setShowChangePassword] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // --- Fetch user profile ---
  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/customer/profile/${userId}`
        );
        setUser(res.data.customer);
        setNewName(res.data.customer.fullName || "");
        setNewPhone(res.data.customer.phone || "");
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchUser();
  }, [userId, navigate]);

  // --- Logout with confirmation ---
  
  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      
      navigate("/login");
    }
  };
   
  const handleGoHome = () => navigate("/");

  // --- Update Name ---
  const handleNameSave = async () => {
    if (!newName.trim()) return alert("Name cannot be empty!");
    try {
      await axios.put(
        `http://localhost:5000/api/customer/update-name/${userId}`,
        { fullName: newName }
      );
      setUser({ ...user, fullName: newName });
      setNameEdit(false);
      alert("Name updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update name.");
    }
  };

  // --- Update Phone ---
  const handlePhoneSave = async () => {
    if (!/^\d{10}$/.test(newPhone)) return alert("Phone must be 10 digits!");
    try {
      await axios.put(
        `http://localhost:5000/api/customer/update-phone/${userId}`,
        { phone: newPhone }
      );
      setUser({ ...user, phone: newPhone });
      setPhoneEdit(false);
      alert("Phone updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update phone.");
    }
  };

  // --- Download PDF with CeloSpice header ---
  const downloadPDF = () => {
    if (!user) return;

    const doc = new jsPDF("p", "pt", "a4");

    // --- Header: Logo/Title Centered ---
    doc.setFontSize(28);
    doc.setTextColor(237, 106, 94); // Rose-like color
    doc.setFont("helvetica", "bold");
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerText = "CeloSpice";
    const textWidth = doc.getTextWidth(headerText);
    doc.text(headerText, (pageWidth - textWidth) / 2, 50);

    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("User Profile Report", 40, 80);

    // --- User Details ---
    const userDetails = [
      ["Full Name", user.fullName || "N/A"],
      ["Email", user.email || "N/A"],
      ["Phone", user.phone || "N/A"],
      ["Address", user.address || "N/A"],
      ["Customer ID", user._id || "N/A"],
      ["Role", user.role || "N/A"],
    ];

    autoTable(doc, {
      startY: 110,
      head: [["Field", "Value"]],
      body: userDetails,
      theme: "grid",
      styles: { fontSize: 12, cellPadding: 6 },
      headStyles: { fillColor: [237, 106, 94] },
    });

    doc.save("CeloSpice_UserProfile.pdf");
  };

  if (!user) {
    return (
      <p className="text-center mt-10 text-lg text-gray-600 animate-pulse">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: "#FFF7ED" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-r from-rose-600 to-amber-500 shadow-lg p-6 flex flex-col justify-between text-white fixed top-0 left-0 h-screen">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">My Account</h2>
            <button
              onClick={handleGoHome}
              className="text-white hover:text-gray-200 transition text-2xl"
              title="Back to Home"
            >
              🏠
            </button>
          </div>

          <nav className="space-y-3">
            <p className="px-4 py-2 rounded-lg font-medium hover:bg-white/20 cursor-pointer">
              👤 Profile
            </p>
            <p className="px-4 py-2 rounded-lg font-medium hover:bg-white/20 cursor-pointer">
              🏠 Addresses
            </p>
            <p className="px-4 py-2 rounded-lg font-medium hover:bg-white/20 cursor-pointer">
              📦 My Orders
            </p>
            <p
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="px-4 py-2 rounded-lg font-medium hover:bg-white/20 cursor-pointer"
            >
              🔑 Change Password
            </p>
            <p className="px-4 py-2 rounded-lg font-medium hover:bg-white/20 cursor-pointer">
              🔒 2-Step Verification
            </p>
            <p className="px-4 py-2 rounded-lg font-medium text-red-200 hover:bg-white/20 cursor-pointer">
              🗑️ Delete Account
            </p>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 rounded-lg bg-white text-rose-600 font-semibold shadow-md hover:text-rose-700 hover:bg-white/90 transition"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <h1 className="text-3xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-amber-500">
          🌿 Profile Details
        </h1>

        {/* Basic Info */}
        <section className="mb-6 bg-white/95 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-amber-500">
            Basic Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <p className="font-medium text-gray-600 uppercase text-sm">
                Full Name
              </p>
              {nameEdit ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    onClick={handleNameSave}
                    className="px-3 py-1 bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded shadow-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setNameEdit(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-gray-900 font-semibold text-lg">
                    {user.fullName}
                  </span>
                  <button
                    onClick={() => setNameEdit(true)}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <p className="font-medium text-gray-600 uppercase text-sm">
                Email Address
              </p>
              <p className="text-gray-900 font-semibold text-lg">{user.email}</p>
            </div>

            {/* Phone */}
            <div>
              <p className="font-medium text-gray-600 uppercase text-sm">
                Phone Number
              </p>
              {phoneEdit ? (
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-rose-500"
                  />
                  <button
                    onClick={handlePhoneSave}
                    className="px-3 py-1 bg-gradient-to-r from-rose-600 to-amber-500 text-white rounded shadow-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setPhoneEdit(false)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-gray-900 font-semibold text-lg">
                    {user.phone || "Not provided"}
                  </span>
                  <button
                    onClick={() => setPhoneEdit(true)}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Address Info */}
        <section className="mb-6 bg-white/95 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-amber-500">
            Address Information
          </h2>
          <div className="space-y-3">
            <p className="font-medium text-gray-600 uppercase text-sm">
              Default Shipping Address
            </p>
            <p className="text-gray-900 font-semibold text-lg">
              {user.address || "No address saved"}
            </p>
          </div>
        </section>

        {/* Account Info */}
        <section className="bg-white/95 rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-amber-500">
            Account Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium text-gray-600 uppercase text-sm">
                Customer ID
              </p>
              <p className="text-gray-900 font-semibold text-lg">{user._id}</p>
            </div>
            <div>
              <p className="font-medium text-gray-600 uppercase text-sm">Role</p>
              <p className="text-gray-900 font-semibold text-lg capitalize">
                {user.role}
              </p>
            </div>
          </div>

          {/* PDF Download Button */}
          <button
            onClick={downloadPDF}
            className="mt-6 px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-amber-500 text-white font-semibold shadow-md hover:from-rose-700 hover:to-amber-600 transition"
          >
            📄 Download Profile as PDF
          </button>
        </section>

        {/* Change Password */}
        {showChangePassword && (
          <section className="bg-white/95 rounded-xl shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-amber-500">
              Change Password
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Old Password"
                value={passwordData.oldPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    oldPassword: e.target.value,
                  })
                }
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={() => alert("Password change logic not yet added")}
                className="px-4 py-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white rounded shadow-md hover:from-rose-600 hover:to-amber-600"
              >
                Save Password
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default UserProfile;
