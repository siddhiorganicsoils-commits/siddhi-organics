import React, { useEffect } from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function TermsConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="px-6 py-10 max-w-4xl mx-auto leading-relaxed">
      <Link
        to="/"
        className="text-green-600 font-medium hover:underline"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mt-6 mb-4 text-green-700">
        Terms & Conditions
      </h1>

      <p className="mb-4">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <p className="mb-4">
        These Terms govern your use of the Siddhi Organics website and
        services. By using our site, you agree to these terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Products</h2>
      <p className="mb-4">
        All products are natural wooden cold-pressed oils. Images may differ
        slightly depending on device screens. Prices may change anytime.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Orders & Payment</h2>
      <p className="mb-4">
        Orders are confirmed only after successful payment. We do not store card
        or UPI details.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Shipping & Delivery</h2>
      <p className="mb-4">
        Delivery time varies by location. Orders can't be cancelled after
        dispatch. Incorrect addresses may result in delays.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Returns & Refunds</h2>
      <p className="mb-4">
        Due to the nature of edible oils, returns are not accepted once opened.
        Refunds apply only for wrong or damaged items reported within 24 hours.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Website Usage</h2>
      <p className="mb-4">
        You agree not to misuse the site or attempt any unauthorized access.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Intellectual Property</h2>
      <p className="mb-4">
        All content including product images, descriptions, and branding belongs
        to Siddhi Organics and cannot be used without permission.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Limitation of Liability</h2>
      <p className="mb-4">
        We are not responsible for courier delays, allergic reactions, or
        misuse of products.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact Us</h2>
      <p>
        Email: <strong>siddhiorganics.oils@gmail.com</strong><br />
        WhatsApp: <strong>+91 9858226789</strong>
      </p>

      <Footer />
    </div>
  );
}
