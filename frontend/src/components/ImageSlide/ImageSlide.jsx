import React, { useState, useEffect } from "react";
import Image1 from "../../assets/img1.jpg";
import Image2 from "../../assets/img2.jpg";
import Image3 from "../../assets/img3.jpg";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Up to 20% off all Spices",
    description:
      "Discover premium, authentic spices from around the world. Enhance your cooking with fresh, natural, and aromatic flavors. Shop high-quality herbs, seasonings, and blends for a delightful culinary experience.",
  },
  {
    id: 2,
    img: Image2,
    title: "Up to 20% off all Spices",
    description:
      "Discover premium, authentic spices from around the world. Enhance your cooking with fresh, natural, and aromatic flavors. Shop high-quality herbs, seasonings, and blends for a delightful culinary experience.",
  },
  {
    id: 3,
    img: Image3,
    title: "Up to 20% off all Spices",
    description:
      "Discover premium, authentic spices from around the world. Enhance your cooking with fresh, natural, and aromatic flavors. Shop high-quality herbs, seasonings, and blends for a delightful culinary experience.",
  },
];

const ImageSlide = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === ImageList.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[40vh] overflow-hidden flex justify-center items-center bg-gray-100 dark:bg-gray-950 dark:text-white">
      <img
        src={ImageList[currentIndex].img}
        alt={ImageList[currentIndex].title}
        className="w-full h-full object-cover transition-opacity duration-1000"
      />
      <div className="absolute bottom-5 left-5 text-white bg-black/40 p-4 rounded-lg max-w-lg">
        <h2 className="text-xl sm:text-2xl font-bold mb-1">
          {ImageList[currentIndex].title}
        </h2>
        <p className="text-xs sm:text-sm mb-3">
          {ImageList[currentIndex].description}
        </p>
        <button className="bg-orange-500 text-white font-semibold py-2 px-4 rounded hover:bg-orange-700 transition-colors">
          Shop Now
        </button>
      </div>
    </div>
  );
};

export default ImageSlide;
