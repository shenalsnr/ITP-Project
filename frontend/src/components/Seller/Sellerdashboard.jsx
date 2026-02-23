import React, { useState, useEffect } from "react";
import axios from "axios";
import Image001 from "../../assets/cinnamons01.jpg";
import Image002 from "../../assets/blackpeper.jpg";
import Image003 from "../../assets/caradamon.jpg";
import Image004 from "../../assets/chilis01.jpg";
import Image005 from "../../assets/Spicelanka.jpg";
import Image006 from "../../assets/logo.jpg";
import Image007 from "../../assets/owners.jpg";
import Image008 from "../../assets/socials.jpg";
import Image009 from "../../assets/socials01.jpg";
import Image010 from "../../assets/socials02.jpg";
import Image011 from "../../assets/ginger.jpg";

import { Link, useNavigate } from "react-router-dom";

// Reusable Star component
const Star = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={`w-4 h-4 ${filled ? "fill-yellow-400" : "fill-gray-300"}`}
  >
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.401 8.168L12 18.896l-7.335 3.87 1.401-8.168L.132 9.21l8.2-1.192L12 .587z" />
  </svg>
);

// Icons
const Icon = {
  map: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-rose-500">
      <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
    </svg>
  ),
  joined: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-teal-600">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 17H5V10h14v10zm0-12H5V5h14v3z"/>
    </svg>
  ),
  box: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-pink-500">
      <path d="M21 8l-9-5-9 5 9 5 9-5zm-9 7L3 10v6l9 5 9-5v-6l-9 5z"/>
    </svg>
  ),
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-gray-400">
      <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
    </svg>
  ),
  heart: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-white/90">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41.81 4.5 2.09C12.09 4.81 13.76 4 15.5 4 18 4 20 6 20 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  ),
  cart: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-white/90">
      <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14h9.66c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 21.33 5H5.21L4.27 3H1v2h2l3.6 7.59-1.35 2.45A2 2 0 0 0 7.17 18h11.66v-2H7.17l1.1-2z"/>
    </svg>
  ),
  bell: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-white/90">
      <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 1 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
    </svg>
  ),
  user: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-white/90">
      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
    </svg>
  ),
  chevronDown: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-gray-500">
      <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
    </svg>
  ),
};

// ProductCard Component

const ProductCard = ({ img, title, reviews, price, rating }) => (
  
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition cursor-pointer">
     
      <img src={img} alt="" className="mx-auto h-28 md:h-32 object-contain" />
      <h4 className="mt-3 font-semibold text-gray-800 text-lg">{title}</h4>
      <div className="flex items-center justify-center gap-1 mt-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} filled={i < rating} />
        ))}
        <span className="text-gray-500 text-sm ml-1">{reviews}</span>
      </div>
      <p className="mt-1 text-gray-800 font-semibold text-base md:text-lg">LKR.{price}</p>
      <button className="mt-3 px-5 py-2 rounded-xl bg-[#2EFF2E] text-white text-sm md:text-base hover:bg-teal-600">Add to cart</button>
    </div>
  
);

export default function SellerDashboardSpice() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("❌ Error fetching products", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      {/* Top Navbar */}
      <header className="bg-[#2EFF2E] text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold">PR.</div>
            <nav className="hidden md:flex items-center gap-6 text-lg font-bold text-white/90">
              <a href="#" className="hover:text-white">Dashboard</a>
              <a href="#" className="hover:text-white">Configuration</a>
              <a href="#" className="hover:text-white">Products</a>
              <a href="#" className="hover:text-white relative">Affiliates
                <span className="absolute -top-2 -right-4 text-[10px] bg-rose-400 text-white px-1.5 py-0.5 rounded-md">Join</span>
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            {Icon.heart}
            {Icon.bell}
            {Icon.cart}
            {Icon.user}
            <button className="md:hidden">☰</button>
          </div>
        </div>
      </header>

      <main className="w-full px-10">
        {/* Seller banner + profile */}
        <section className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-40 md:h-56 bg-cover bg-center" style={{ backgroundImage: `url(${Image005})` }} />
            <div className="p-6 lg:p-8">
              <div className="flex items-start md:items-center gap-6">
                <img src={Image006} alt="" className="w-20 h-20 md:w-28 md:h-28 rounded-full object-cover border-4 border-white -mt-12" />
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">Cylon Spice</h2>
                  <p className="text-gray-500 md:text-base">Sri Lankan No.01 Spices </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4 text-sm md:text-base">
                    <div className="flex items-center gap-2 text-gray-600">
                      {Icon.map}
                      <div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">Location</div>
                        <div>Mirigama, Sri Lanka</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      {Icon.joined}
                      <div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">Joined</div>
                        <div>10 October 2021</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      {Icon.box}
                      <div>
                        <div className="text-xs uppercase tracking-wide text-gray-400">Total Product</div>
                        <div>230</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-7 h-7 bg-blue-600 rounded"> <img src={Image008} /></span>
                    <span className="inline-block w-7 h-7 bg-pink-500 rounded"> <img src={Image009} /></span>
                    <span className="inline-block w-7 h-7 bg-red-600 rounded"> <img src={Image010} /></span>
                  </div>
                  <button className="px-6 py-2 rounded-xl bg-rose-400 text-white hover:bg-rose-500 flex items-center gap-2 text-sm md:text-base">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M16 11H8v2h8v-2z"/></svg>
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Shop owner card */}
          <aside className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-700 border-b pb-3 text-lg">Shop Owner</h3>
            <img 
              src={Image007} 
              alt="" 
              className="w-40 h-40 mx-auto object-cover rounded-full mt-4 border-4 border-gray-100"
            />
            <p className="text-center mt-4 text-gray-700 font-medium text-lg">Isuru Nimantha</p>
            <p className="text-center mt-2 text-gray-500 text-sm">
              Passionate about bringing authentic Sri Lankan spices to the world.
            </p>
            <div className="mt-4 text-sm text-gray-600 space-y-1 text-center">
              <p><span className="font-medium">📧</span> isuru@cylonspice.com</p>
              <p><span className="font-medium">📞</span> +94 71 234 5678</p>
            </div>
          </aside>
        </section>

        {/* Tabs + filters */}
        <section className="mt-8 bg-white rounded-2xl shadow-sm p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-8 text-gray-600 text-sm md:text-base">
              <button className="text-teal-600 font-semibold">Seller Products</button>
              <button>Feedbacks</button>
              <button>Policy</button>
              <button>Description</button>
              <button>Extra Info</button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <input className="pl-9 pr-3 py-2 rounded-xl bg-gray-100 text-sm md:text-base outline-none w-48 md:w-60" placeholder="Search here..." />
                <span className="absolute left-3 top-1/2 -translate-y-1/2">{Icon.search}</span>
              </div>
              <button className="px-4 py-2 rounded-xl bg-gray-100 text-sm md:text-base flex items-center gap-2">Sort by {Icon.chevronDown}</button>
              <button className="px-4 py-2 rounded-xl bg-gray-100 text-sm md:text-base flex items-center gap-2">Show {Icon.chevronDown}</button>
            </div>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 mt-6">
            {/* --- Static products --- */}
            <ProductCard img={Image001} title="Ceylon Cinnamon" reviews={21} price={2000} rating={4} />
            <ProductCard img={Image002} title="Black Peper" reviews={23} price={2500} rating={4} />
            <ProductCard img={Image003} title="cardamom" reviews={12} price={2400} rating={5} />
            <ProductCard img={Image004} title="Hot Chili" reviews={32} price={950} rating={3} />
            <ProductCard img={Image011} title="Ginger" reviews={55} price={450} rating={4.5} />

            {/* --- Dynamic products from DB --- */}
            {products.length > 0 ? (
              products.map((p, idx) => (
                <div
                  key={p._id} // use product _id as key
                  onClick={() => navigate(`/linkto/${p._id}`)} // navigate on click
                >
                  <ProductCard
                    img={p.Product_Images?.[0] ? `http://localhost:5000/uploads/${p.Product_Images[0]}` : "https://via.placeholder.com/150"}
                    title={p.Product_Name}
                    reviews={p.reviews || 26}
                    price={p.Price}
                    rating={p.rating || 4}
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No dynamic products available yet</p>
            )}
          </div>
        </section>

        <div className="h-12" />
      </main>
    </div>
  );
}
