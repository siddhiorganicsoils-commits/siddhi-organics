import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import ShopPage from "./ShopPage.jsx";
import CartPage from "./CartPage.jsx";
import { useState, useEffect } from "react";
import Home from "./Home.jsx";
// import Toast from "./Toast.jsx";


export default function App() {
    return (
        <div className="font-sans">
            <nav className="bg-green-700 text-white px-6 py-3 flex justify-between items-center shadow">
                <Link to="/" className="text-xl font-bold hover:text-green-200 transition">
                    🛍️ Siddhi Organics
                </Link>
                <Link
                    to="/cart"
                    className="bg-white text-green-700 px-4 py-1 rounded hover:bg-green-100 transition"
                >
                    View Cart
                </Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/cart" element={<CartPage />} />
            </Routes>
        </div>
    );
}
