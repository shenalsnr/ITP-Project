import React, { useState } from "react";

// Local images
import chiliImg from "../../assets/categories/chili.jpg";
import turmericImg from "../../assets/categories/turmeric.jpg";
import cinnamonImg from "../../assets/categories/cinnamon.jpg";
import pepperImg from "../../assets/categories/pepper.jpg";
import herbsImg from "../../assets/categories/herbs.jpg";
import clovesImg from "../../assets/categories/cloves.jpg";
import nutmegImg from "../../assets/categories/nutmeg.jpg";
import garamMasalaImg from "../../assets/categories/masala.jpg";

// Categories array
const categories = [
  { name: "Chili & Pepper", img: chiliImg },
  { name: "Turmeric & Roots", img: turmericImg },
  { name: "Seeds & Pods", img: pepperImg },
  { name: "Cinnamon & Bark Spices", img: cinnamonImg },
  { name: "Herbs & Leaves", img: herbsImg },
  { name: "Flower & Aroma Spices", img: clovesImg },
  { name: "Nut & Kernel Spices", img: nutmegImg },
  { name: "Mixed / Blended Spices", img: garamMasalaImg },
];

export default function CategoriesPopup() {
  const [selected, setSelected] = useState(null); // category selected
  const [isOpen, setIsOpen] = useState(false); // modal state

  const openModal = (category) => {
    setSelected(category);
    setIsOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setIsOpen(false);
  };

  return (
    <div className="bg-white py-8">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Available Category
      </h2>

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6">
        {categories.map((cat, i) => (
          <div
            key={i}
            className="cursor-pointer bg-gray-50 shadow-md rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
            onClick={() => openModal(cat)}
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-3 text-center">
              <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white font-semibold text-sm md:text-lg">
                {cat.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isOpen && selected && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal} // click outside closes
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()} // prevent close on inner click
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selected.img}
              alt={selected.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold text-center bg-gradient-to-r from-rose-600 to-amber-500 text-white px-3 py-1 rounded-full">
              {selected.name}
            </h2>
            <p className="text-gray-700 mt-2 text-center">
              Explore the finest quality {selected.name.toLowerCase()} for your cooking and recipes.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
