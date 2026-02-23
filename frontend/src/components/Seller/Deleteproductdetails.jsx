import React, { useState } from "react";

export default function ProductPopup() {
  const [product, setProduct] = useState({
    productNumber: "P001",
    productName: "Cinnamon",
    category: "Spices",
    weight: "1kg",
    price: "500",
    expireDate: "2025-12-31",
    quantity: "50",
    images: [],
    description: "High quality cinnamon sticks.",
  });

  const [viewPopup, setViewPopup] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteProduct = () => {
    setProduct({
      productNumber: "",
      productName: "",
      category: "",
      weight: "",
      price: "",
      expireDate: "",
      quantity: "",
      images: [],
      description: "",
    });
    setConfirmDelete(false);
    setViewPopup(false);
  };

  return (
    <div className="p-6 flex justify-center">
      {/* Button to open popup */}
      <button
        onClick={() => setViewPopup(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md"
      >
        Delete
      </button>

      {/* Popup Window */}
      {viewPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl relative">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Product Details
            </h2>

            {/* Product details */}
            <div className="space-y-2 text-left">
              <p>
                <span className="font-medium">Product Number:</span>{" "}
                {product.productNumber}
              </p>
              <p>
                <span className="font-medium">Name:</span> {product.productName}
              </p>
              <p>
                <span className="font-medium">Category:</span> {product.category}
              </p>
              <p>
                <span className="font-medium">Weight:</span> {product.weight}
              </p>
              <p>
                <span className="font-medium">Price:</span> Rs.{product.price}
              </p>
              <p>
                <span className="font-medium">Expire Date:</span>{" "}
                {product.expireDate}
              </p>
              <p>
                <span className="font-medium">Quantity:</span>{" "}
                {product.quantity}
              </p>
              <p>
                <span className="font-medium">Description:</span>{" "}
                {product.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setConfirmDelete(true)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
              <button
                onClick={() => setViewPopup(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Close
              </button>
            </div>

            {/* Confirmation message */}
            {confirmDelete && (
              <div className="mt-6 text-center">
                <p className="mb-4 text-gray-700 font-medium">
                  Are you sure you want to delete these details?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleDeleteProduct}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow-md"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
