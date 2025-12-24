// CartPage.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CustomerDetailsPopup from "./CustomerDetailsPopup.jsx";
import { supabase } from "./lib/supabase";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(saved);
  }, []);

  // total product amount
  const totalAmount = cart.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  // convert sizes to liters
  const parseSizeToLiters = (sizeStr) => {
    if (!sizeStr) return 0;
    const s = sizeStr.trim().toLowerCase();
    if (s.includes("ml")) return parseFloat(s) / 1000;
    if (s.includes("l")) return parseFloat(s);
    return parseFloat(s) || 0;
  };

  const totalLiters = cart.reduce(
    (sum, item) => sum + parseSizeToLiters(item.size) * item.qty,
    0
  );

  // helper: check pincode is in 50 rs zone
  const is50RsZone = async (pincode) => {
    const { data } = await supabase
      .from("delivery_pincodes")
      .select("in_50_rs_zone")
      .eq("pincode", pincode)
      .maybeSingle();

    return data?.in_50_rs_zone === true;
  };

  // WhatsApp sender
  const sendWhatsApp = (number, msg) => {
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  // main order handler
  const handleWhatsAppOrder = async (user) => {
    if (!user || !user.pincode) {
      alert("Please enter a valid pincode.");
      return;
    }

    setLoading(true);

    try {
      let shippingText = "Will be added";
      let shippingCharge = 0;

      // FREE SHIPPING ≥ 5L
      if (totalLiters >= 3) {
        shippingText = "Free";
        shippingCharge = 0;
      } else {
        const in50Zone = await is50RsZone(user.pincode.trim());
        if (in50Zone) {
          shippingText = "₹50";
          shippingCharge = 50;
        }
      }

      const grandTotal = totalAmount + shippingCharge;

      const orderList = cart
        .map(
          (item, i) =>
            `${i + 1}. ${item.name} (${item.size}) x ${item.qty} = ₹${item.total}`
        )
        .join("\n");

      const message = `
New Order from Siddhi Organics Web
------------------------------
Name: ${user.name}
Mobile: ${user.mobile}
Email: ${user.email || "N/A"}

Address:
${user.houseNo}, ${user.street}
${user.city}, ${user.state} - ${user.pincode}

Order Details:
${orderList}

Total: ₹${totalAmount}
Shipping (based on location): ${shippingText}
Grand Total: ₹${grandTotal}${shippingText === "Will be added" ? " (+Shipping)" : ""}
------------------------------
      `.trim();

      sendWhatsApp("919858226789", message);

      localStorage.removeItem("cart");
      setCart([]);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
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
                    ₹{Number(item.total).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const updated = cart.filter((_, i) => i !== index);
                    setCart(updated);
                    localStorage.setItem("cart", JSON.stringify(updated));
                  }}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 text-right">
            <p className="text-xl font-bold text-green-700">
              Total: ₹{totalAmount.toLocaleString()}
            </p>
            <p className="text-gray-600 text-sm">
              {totalLiters >= 5
                ? "Free shipping on orders of 5L or more"
                : "Shipping will be calculated based on your pincode"}
            </p>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPopup(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                disabled={loading}
              >
                {loading ? "Processing..." : "📱 Order via WhatsApp"}
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("cart");
                  setCart([]);
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}

      <CustomerDetailsPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        onSubmit={handleWhatsAppOrder}
      />
    </div>
  );
}
