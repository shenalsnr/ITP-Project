import React from "react";
import { useNavigate } from "react-router-dom";

function PrivacyPolicy() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Fixed */}
      <aside className="w-64 bg-gradient-to-r from-rose-600 to-amber-500 shadow-lg p-6 flex flex-col justify-between text-white fixed top-0 left-0 h-screen">
        <div>
          

          <nav className="space-y-3">
            <p
              onClick={handleGoHome}
              className="px-4 py-2 rounded-lg font-medium hover:bg-white/20 cursor-pointer"
            >
              🏠 Home
            </p>
            <p className="px-4 py-2 rounded-lg font-medium text-yellow-200 cursor-default">
              📄 Privacy Policy
            </p>
          </nav>
        </div>
      </aside>

      {/* Right Content - Scrollable */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        <h1 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-amber-500">
          🔒 Privacy Policy
        </h1>

        <section className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-gray-700 mb-4">
            We value your privacy and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, and safeguard your data when
            you use our website.
          </p>

          <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We may collect information such as your name, email, phone number, shipping and
            billing addresses, and payment details when you register or make a purchase.
          </p>

          <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            Your information is used to process orders, improve our services, send updates,
            and provide a personalized experience.
          </p>

          <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We use appropriate security measures to protect your information. However,
            please note that no method of transmission over the Internet is 100% secure.
          </p>

          <h2 className="text-2xl font-bold mb-4">5. Sharing of Information</h2>
          <p className="text-gray-700 mb-4">
            We do not sell your personal information. We may share it with trusted
            third-party services to process payments, deliver orders, or comply with
            legal obligations.
          </p>

          <h2 className="text-2xl font-bold mb-4">6. Cookies</h2>
          <p className="text-gray-700 mb-4">
            We may use cookies to enhance your browsing experience, analyze site traffic,
            and personalize content.
          </p>

          <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You can access, update, or request deletion of your personal information by
            contacting us through the provided channels.
          </p>

          <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
          <p className="text-gray-700 mb-4">
            We may update this Privacy Policy from time to time. Any changes will be posted
            on this page with an updated revision date.
          </p>

          <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            For any questions regarding this Privacy Policy, please contact us at:
            <br />
            <strong>Email:</strong> support@example.com
            <br />
            <strong>Phone:</strong> +94 77 123 4567
          </p>
        </section>
      </main>
    </div>
  );
}

export default PrivacyPolicy;
