import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ShopPage from "./ShopPage.jsx";
import CartPage from "./CartPage.jsx";
import { useState, useEffect } from "react";
import Home from "./Home.jsx";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import oildropicon from "./assets/oildropicon.png"
import ScrollToTop from "./ScrollToTop";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

// import Toast from "./Toast.jsx";


export default function App() {
    return (
        <div className="font-sans">
            <nav className="bg-green-700 text-white px-6 py-3 flex justify-between items-center shadow">
                <Link to="/" className="text-xl font-bold hover:text-green-200 transition flex items-center gap-2">
                    <img
                        src={oildropicon}
                        alt="Oil Drop Logo"
                        className="w-7 h-7 object-contain"
                    />
                    Siddhi Organics
                </Link>

                <Link
                    to="/cart"
                    className="bg-white text-green-700 px-4 py-1 rounded hover:bg-green-100 transition"
                >
                    View Cart
                </Link>
            </nav>

            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-and-conditions" element={<TermsConditions />} />
            </Routes>
        </div>
    );
}
