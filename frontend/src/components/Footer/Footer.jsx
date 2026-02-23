import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-rose-500 to-amber-500 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* Brand / About */}
        <div>
          <h2 className="text-2xl font-bold mb-3">CeloSpice</h2>
          <p className="text-white/80">
            Fresh spices delivered to your doorstep. 
            Buy, sell, and explore the world of flavors.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/PrivacyPolicy" className="hover:underline">Privacy Policy</Link></li>
            
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p>📍 Colombo, Sri Lanka</p>
          <p>📞 +94 77 123 4567</p>
          <p>✉️ support@spicehub.com</p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-black/20 text-center py-4 text-sm">
        © {new Date().getFullYear()} CeloSpice. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
