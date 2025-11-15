import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaFacebook, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm mt-10">
      <div className="max-w-6xl mx-auto px-4 py-10 text-center space-y-6">

        {/* --- SOCIAL LINKS --- */}
        <div className="flex justify-center gap-6 text-xl">
          <a
            href="https://www.instagram.com/siddhi.organics?igsh=bHkxNWcyOWR4OG4w"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaInstagram />
          </a>

          <a
            href="https://wa.me/919858226789"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaWhatsapp />
          </a>

          <a
            href="https://www.facebook.com/share/1SP3HRaD9L/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaFacebook />
          </a>

          <a
            href="mailto:siddhiorganics.oils@gmail.com"
            className="hover:text-white transition"
          >
            <FaEnvelope />
          </a>
        </div>

        {/* --- PRIVACY / TERMS --- */}
        <div className="flex justify-center gap-6 text-xs">
          <Link
            to="/privacy-policy"
            className="hover:text-white transition"
          >
            Privacy Policy
          </Link>

          <Link
            to="/terms-and-conditions"
            className="hover:text-white transition"
          >
            Terms & Conditions
          </Link>
        </div>

        {/* --- COPYRIGHT --- */}
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} Siddhi Organics. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
