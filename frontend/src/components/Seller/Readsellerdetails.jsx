import React, { useState } from "react";



export default function ProductTableWithActions() {
  const [product, setProduct] = useState({
    productNumber: "P001",
    productName: "Cinnamon",
    category: "Spices",
    weight: "1kg",
    price: "500",
    expireDate: "2025-12-31",
    quantity: "50",
    images: [], // store File objects
    description: "High quality cinnamon sticks.",
  });

  const [viewImage, setViewImage] = useState(null);

  // Handle text inputs update
  const handleChange = (field, value) => {
    setProduct({ ...product, [field]: value });
  };

  // Handle image updates
  const handleUpdateImage = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const updatedImages = [...product.images];
    updatedImages[index] = file;
    setProduct({ ...product, images: updatedImages });
  };

  const handleDeleteImage = (index) => {
    const updatedImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: updatedImages });
  };

  const handleAddImage = (e) => {
    const files = Array.from(e.target.files).slice(0, 2 - product.images.length);
    setProduct({ ...product, images: [...product.images, ...files] });
  };
    const fetchHandler = async () =>{
      return await axios.get(URL).then((res) => res.data);
    }
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Upload Images */}
      <div className="mb-4">
        <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer">
          Add Image
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAddImage}
          />
        </label>
      </div>

      <table className="min-w-full border rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-blue-600 text-white">
             <th className="px-6 py-3">Product Images</th>
            <th className="px-6 py-3">Product Number</th>
            <th className="px-6 py-3">Product Name</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Weight</th>
            <th className="px-6 py-3">Price</th>
            <th className="px-6 py-3">Expire Date</th>
            <th className="px-6 py-3">Quantity</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr className="border-t">
            {/* Editable fields */}

                <td className="px-4 py-4">
              <div className="flex gap-2 justify-center">
                {product.images.length > 0 ? (
                  product.images.map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      alt={`Product ${i + 1}`}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                  ))
                ) : (
                  "No Image"
                )}
              </div>
            </td>
            <td className="px-4 py-4">
              <input
                type="text"
                value={product.productNumber}
                onChange={(e) => handleChange("productNumber", e.target.value)}
                className="border px-2 py-1 rounded-lg w-full"
              />
            </td>
            <td className="px-4 py-4">
              <input
                type="text"
                value={product.productName}
                onChange={(e) => handleChange("productName", e.target.value)}
                className="border px-2 py-1 rounded-lg w-full"
              />
            </td>
            <td className="px-4 py-4">
              <input
                type="text"
                value={product.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="border px-2 py-1 rounded-lg w-full"
              />
            </td>
            <td className="px-4 py-4">
              <input
                type="text"
                value={product.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                className="border px-2 py-1 rounded-lg w-full"
              />
            </td>
            <td className="px-4 py-4">
              <input
                type="number"
                value={product.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="border px-2 py-1 rounded-lg w-full"
              />
            </td>
            <td className="px-4 py-4">
              <input
                type="date"
                value={product.expireDate}
                onChange={(e) => handleChange("expireDate", e.target.value)}
                className="border px-2 py-1 rounded-lg w-full"
              />
            </td>
            <td className="px-4 py-4">
              <input
                type="number"
                value={product.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                className="border px-2 py-1 rounded-lg w-full"
              />
            </td>
            <td className="px-4 py-4">
              <textarea
                value={product.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="border px-2 py-1 rounded-lg w-full"
              />
            </td>
            <td className="px-4 py-4 flex flex-col gap-2">
              {product.images.map((img, i) => (
                <div key={i} className="flex gap-2 justify-center">
                  <button
                    onClick={() => setViewImage(URL.createObjectURL(img))}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    View
                  </button>
                  <label className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm cursor-pointer">
                    Update
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpdateImage(i, e)}
                    />
                  </label>
                  <button
                    onClick={() => handleDeleteImage(i)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Modal for viewing image */}
      {viewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg relative">
            <img src={viewImage} alt="View" className="max-w-md max-h-[80vh]" />
            <button
              onClick={() => setViewImage(null)}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
