import React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function UserPDFButton({ user }) {
  const generatePDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("User Profile Report", 14, 20);

    // User Basic Info
    doc.setFontSize(12);
    doc.text(`Full Name: ${user.fullName || "N/A"}`, 14, 40);
    doc.text(`Email: ${user.email || "N/A"}`, 14, 50);
    doc.text(`Phone: ${user.phone || "N/A"}`, 14, 60);
    doc.text(`Address: ${user.address || "N/A"}`, 14, 70);
    doc.text(`Customer ID: ${user._id}`, 14, 80);
    doc.text(`Role: ${user.role}`, 14, 90);

    // AutoTable Example (optional for structured layout)
    doc.autoTable({
      startY: 110,
      head: [["Field", "Value"]],
      body: [
        ["Full Name", user.fullName || "N/A"],
        ["Email", user.email || "N/A"],
        ["Phone", user.phone || "N/A"],
        ["Address", user.address || "N/A"],
        ["Customer ID", user._id],
        ["Role", user.role],
      ],
    });

    // Save PDF
    doc.save(`${user.fullName || "user"}-profile.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-amber-500 text-white font-semibold shadow-md hover:from-rose-700 hover:to-amber-600 transition"
    >
      📄 Download Profile PDF
    </button>
  );
}

export default UserPDFButton;
