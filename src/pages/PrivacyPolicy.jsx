import React, { useEffect } from "react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 pt-10 pb-32 text-gray-800 leading-7">
      <Link
        to="/"
        className="text-green-600 font-medium hover:underline"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mt-6 mb-4 text-green-700">
        Privacy Policy
      </h1>

      <p className="mb-4">
        Last Updated: {new Date().toLocaleDateString()}
      </p>

      <p className="mb-4">
        At <strong>Siddhi Organics</strong>, we are committed to protecting your
        personal information and your right to privacy. This Privacy Policy
        explains how we collect, use, and safeguard your data.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
      <p className="mb-4">
        We may collect your name, phone number, email address, shipping
        address, and payment details during checkout or form submissions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Automatically Collected Data</h2>
      <p className="mb-4">
        When you visit our website, we may collect device information, cookies,
        IP address, and browsing behavior for analytics and performance.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. How We Use Your Information</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>To process and deliver your orders</li>
        <li>To provide customer support</li>
        <li>To improve user experience</li>
        <li>To send updates or promotions (only if opted-in)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Sharing of Information</h2>
      <p className="mb-4">
        We do not sell your data. We only share information with shipping
        partners, payment gateways, and analytics tools required to operate the
        service.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Cookies</h2>
      <p className="mb-4">
        Cookies help improve browsing, remember your cart, and analyze site
        usage. You can disable cookies in browser settings.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Data Security</h2>
      <p className="mb-4">
        We use secure systems to protect your information. However, no method of
        transmission is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Your Rights</h2>
      <p className="mb-4">
        You may request access, correction, or deletion of your personal
        information by contacting us.
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
