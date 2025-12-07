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
  const totalAmount = cart.reduce((sum, item) => sum + Number(item.total || 0), 0);

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

  // --- helper: shipping by pincode
  const fetchShippingForPincode = async (pincode) => {
    if (!pincode) return null;

    const { data: pinRow } = await supabase
      .from("delivery_pincodes")
      .select("*")
      .eq("pincode", pincode)
      .maybeSingle();

    if (pinRow) {
      if (pinRow.in_50_rs_zone) {
        return { found: true, shipping: 50, reason: "50_zone" };
      }
      return { found: true, shipping: null, reason: "known_not_50" };
    }

    const { data: defRow } = await supabase
      .from("default_shipping_rules")
      .select("*")
      .maybeSingle();

    return {
      found: false,
      shipping: defRow ? Number(defRow.default_shipping) : 80,
      reason: "fallback_default",
    };
  };

  // WhatsApp sender
  const sendWhatsApp = (number, msg) => {
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${number}?text=${encoded}`, "_blank");
  };

  // main order handler
  const handleWhatsAppOrder = async (user) => {
    if (!user || !user.pincode) {
      alert("Please enter a valid pincode.");
      return;
    }

    setLoading(true);

    try {
      const pincode = user.pincode.trim();
      const shippingInfo = await fetchShippingForPincode(pincode);

      // Unknown pincode → send admin WhatsApp only
      if (!shippingInfo.found) {
        const adminNumber = "919858226789";

        const msg = `
New Pincode Request (Unknown Zone)
--------------------------------------
Name: ${user.name}
Mobile: ${user.mobile}
Email: ${user.email || "N/A"}

Address:
${user.houseNo}, ${user.street}
${user.city}, ${user.state} - ${pincode}

Cart Liters: ${totalLiters}L
Product Total: ₹${totalAmount}

⚠️ This pincode is NOT in delivery_pincodes.
Please call/message customer with shipping details.
--------------------------------------
        `.trim();

        sendWhatsApp(adminNumber, msg);
        setLoading(false);
        return;
      }

      // Known pincode → apply shipping rules
      let shippingCharge = shippingInfo.shipping;

      if (shippingCharge == null) {
        const { data: defRow } = await supabase
          .from("default_shipping_rules")
          .select("*")
          .maybeSingle();

        shippingCharge = defRow ? Number(defRow.default_shipping) : 80;
      }

      // free shipping
      let freeAboveLiters = 5;
      const { data: defaultRules } = await supabase
        .from("default_shipping_rules")
        .select("*")
        .maybeSingle();

      if (defaultRules?.free_shipping_above_liters) {
        freeAboveLiters = Number(defaultRules.free_shipping_above_liters);
      }

      if (totalLiters >= freeAboveLiters) shippingCharge = 0;

      const grandTotal = totalAmount + shippingCharge;

      // Build clean message (NO encoding here)
      const cleanOrderList = cart
        .map(
          (item, i) =>
            `${i + 1}. ${item.name} (${item.size}) × ${item.qty} = ₹${item.total}`
        )
        .join("\n");

      const cleanMessage = `
New Order from Siddhi Organics Web
--------------------------------------
Name: ${user.name}
Mobile: ${user.mobile}
Email: ${user.email || "N/A"}

Address:
${user.houseNo}, ${user.street}
${user.city}, ${user.state} - ${user.pincode}

Order Details:
${cleanOrderList}

Product Total: ₹${totalAmount}
Shipping: ₹${shippingCharge}
Grand Total: ₹${grandTotal}
--------------------------------------
      `.trim();

      const adminNumber = "919858226789";
      sendWhatsApp(adminNumber, cleanMessage);

      // clear cart
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
              * Shipping will be calculated based on your pincode
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
