import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomerDetailsPopup from "./CustomerDetailsPopup.jsx";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(saved);
    }, []);

    const handleDelete = (index) => {
        const updated = cart.filter((_, i) => i !== index);
        setCart(updated);
        localStorage.setItem("cart", JSON.stringify(updated));
    };

    const handleClear = () => {
        localStorage.removeItem("cart");
        setCart([]);
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);

    const handleWhatsAppOrder = (user) => {
        const orderText = cart
            .map(
                (item, i) =>
                    `${i + 1}. ${item.name} (${item.size}) x ${item.qty} = ₹${item.total}`
            )
            .join("%0A");

        const address = `${user.houseNo}, ${user.street},%0A${user.city}, ${user.state} - ${user.pincode}`;

        const msg = ` New Order from Siddhi Organics Web: %0A------------------------------%0A Name: ${user.name}%0A Mobile:  ${user.mobile}%0A Email:  ${user.email || "N/A"
            }%0A Address: %0A${address}%0A%0A Order Details: %0A${orderText}%0A%0A Total:  ₹${totalAmount.toLocaleString()} + Shipping (based on location)%0A------------------------------`;

        const whatsappNumber = "919858226789"; // Replace with your actual number
        window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, "_blank");

        localStorage.removeItem("cart");
        setCart([]);
    };



    return (
        <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6 text-green-700">🛒 Your Cart</h2>

            {cart.length === 0 ? (
                <div className="text-center text-gray-600">
                    Your cart is empty.
                    <br />
                    <Link to="/" className="text-green-600 underline">
                        Go back to shop
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {cart.map((item, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-4 flex justify-between items-center bg-white shadow"
                            >
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {item.size} × {item.qty}
                                    </p>
                                    <p className="text-green-700 font-semibold">
                                        ₹{item.total.toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    ❌ Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 border-t pt-4 text-right">
                        <p className="text-xl font-bold text-green-700">
                            Total: ₹{totalAmount.toLocaleString()}{" "}
                            <span className="text-sm text-gray-500">( + Shipping based on location )</span>
                        </p>

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => setShowPopup(true)}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                            >
                                📱 Order via WhatsApp
                            </button>
                            <button
                                onClick={handleClear}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/*  Popup for details */}
            <CustomerDetailsPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                onSubmit={handleWhatsAppOrder}
            />
        </div>
    );
}
