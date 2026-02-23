import React from "react";
import Navbar from "../Navbar/Navbar"; 
import Footer from "../Footer/Footer";

const AboutUs = () => {
  return (
    <div>
      <Navbar />

      <div className="bg-[#FFF7ED] min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-amber-500 mb-8">
            About CeloSpice
          </h1>

          {/* Intro Paragraph */}
          <p className="text-lg text-gray-700 text-center mb-12 leading-relaxed">
            Welcome to <span className="font-semibold text-rose-600">CeloSpice</span>, 
            your trusted destination for authentic, high-quality spices.  
            We are passionate about bringing you the purest flavors sourced directly 
            from local farmers and spice growers. With CeloSpice, every pinch tells 
            a story of tradition, culture, and freshness.
          </p>

          {/* Cards Section */}
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition">
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-amber-500 mb-4">
                🌿 Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To empower spice farmers and deliver premium, sustainably sourced 
                spices to kitchens worldwide, while keeping traditions alive.
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition">
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-amber-500 mb-4">
                🤝 Why Choose Us
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We guarantee freshness, fair trade practices, and 100% natural 
                spices. Our quality control ensures that you get only the best.
              </p>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-8 hover:shadow-xl transition">
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-amber-500 mb-4">
                🌍 Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed">
                To be a global leader in spice eCommerce, connecting cultures 
                through authentic flavors and sustainable practices.
              </p>
            </div>
          </div>

          {/* Join Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-amber-500 mb-4">
              Join the CeloSpice Journey
            </h3>
            <p className="text-gray-600 mb-6">
              Discover the taste of authenticity. Let CeloSpice add color, aroma, 
              and richness to every dish you prepare.
            </p>
          </div>
        </div>
      </div>
   <Footer />
    </div>

    
      
  );
};

export default AboutUs;
