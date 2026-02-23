import React from "react";
import Navbar from "../Navbar/Navbar"; 
import ImageSlide from "../ImageSlide/ImageSlide"; 
import Categories from "../Categories/Categories";
import Footer from "../Footer/Footer";

const Homepage = () => {

  console.log("Homepage component rendered");

  return (
    <div className="bg-[#FFF7ED] min-h-screen">
      <Navbar />
      <ImageSlide />
      <Categories />
      <Footer />
    </div>
  );
}

export default Homepage;
