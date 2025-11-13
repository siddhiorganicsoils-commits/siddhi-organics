import React, { useState, useEffect } from "react";
// import Toast from "./Toast.jsx";

export default function ShopPage() {
  const products = [
    { id: "coconut", name: "Cold-Pressed Coconut Oil", short: "Virgin cold-pressed coconut oil", price: 250, stock: true },
    { id: "sunflower", name: "Cold-Pressed Sunflower Oil", short: "Light cooking oil", price: 220, stock: false },
    { id: "nuvvulu", name: "Cold-Pressed Sesame (Nuvvulu) Oil", short: "Aromatic sesame oil", price: 300, stock: false },
    { id: "pallilu", name: "Cold-Pressed Groundnut (Pallilu) Oil", short: "Nutty groundnut oil", price: 240, stock: false },
    { id: "avalu", name: "Cold-Pressed Mustard (Avalu) Oil", short: "Mustard oil", price: 280, stock: false },
    { id: "Verri nuvvulu", name: "Cold-Pressed Niger (verri nuvvulu) Oil", short: "Niger oil", price: 220, stock: false },
    { id: "kuridi", name: "Cold-Pressed Whole Dried (Kuridi) Coconut Oil", short: "Whole-Dried Coconut oil", price: 280, stock: false },
  ];

  const qtyOptions = [
    { label: "250ml", multiplier: 1 },
    { label: "500ml", multiplier: 2 },
    { label: "1L", multiplier: 4 },
    { label: "2L", multiplier: 8 },
    { label: "5L", multiplier: 20 },
  ];

  const countOptions = [1, 2, 3, 4, 5];

  const [cartCount, setCartCount] = useState(0);
  const [selected, setSelected] = useState({});
  const [addedItem, setAddedItem] = useState(null);
  // const [toast, setToast] = useState({ show: false, message: "" });

  // load initial
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(saved.length);

    const defaults = {};
    products.forEach((p) => {
      defaults[p.id] = { size: "1L", count: 1 };
    });
    setSelected(defaults);
  }, []);

  const handleChange = (id, key, value) => {
    setSelected((prev) => ({
      ...prev,
      [id]: { ...prev[id], [key]: value },
    }));
  };

  const handleAdd = (product) => {
    const sel = selected[product.id];
    const sizeObj = qtyOptions.find((q) => q.label === sel.size);
    const total = product.price * sizeObj.multiplier * sel.count;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({
      id: product.id,
      name: product.name,
      size: sel.size,
      qty: sel.count,
      pricePer250: product.price,
      total,
      time: new Date().toISOString(),
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);

    // 🔔 feedback animations
    setAddedItem(product.id);
    // setToast({ show: true, message: `${product.name} added to cart!` });
    setTimeout(() => setAddedItem(null), 500); // blink time
  };

  const getTotalFor = (p) => {
    const sel = selected[p.id];
    if (!sel) return 0;
    const sizeObj = qtyOptions.find((q) => q.label === sel.size);
    return p.price * sizeObj.multiplier * sel.count;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 relative">
      {/* <Toast show={toast.show} message={toast.message} onHide={() => setToast({ show: false, message: "" })} /> */}

      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-green-700">
          Siddhi Organics — Cold-Pressed Oils
        </h1>
        <div className="text-sm text-right bg-green-100 px-3 py-1 rounded-lg">
          🛒 Cart: {cartCount} items
        </div>
      </header>

      <p className="text-gray-600 mb-10">
        Pure, small-batch, cold-pressed oils. Shop for quality cooking & health oils.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => {
          const sel = selected[p.id] || { size: "1L", count: 1 };
          const total = getTotalFor(p);
          const isBlinking = addedItem === p.id;

          return (
            <div
              key={p.id}
              className={`border rounded-2xl p-6 bg-white shadow transition transform 
              ${isBlinking ? "scale-105 bg-green-50 shadow-green-300" : "hover:shadow-lg"}`}
            >
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{p.short}</p>

              <p className="font-medium mt-4">₹{p.price} / 250ml</p>

              <div className="flex gap-2 mt-4">
                <select
                  className="border rounded p-2 text-sm flex-1"
                  value={sel.size}
                  onChange={(e) => handleChange(p.id, "size", e.target.value)}
                >
                  {qtyOptions.map((q) => (
                    <option key={q.label}>{q.label}</option>
                  ))}
                </select>

                <select
                  className="border rounded p-2 text-sm w-20"
                  value={sel.count}
                  onChange={(e) => handleChange(p.id, "count", parseInt(e.target.value))}
                >
                  {countOptions.map((n) => (
                    <option key={n}>{n}</option>
                  ))}
                </select>
              </div>

              <p className="text-gray-700 font-medium mt-3">
                Total: ₹{total.toLocaleString()}
              </p>

              <button
                disabled={!p.stock}
                className={`py-2 mt-4 rounded w-full transition ${p.stock
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                onClick={() => p.stock && handleAdd(p)}
              >
                {p.stock ? "Add to Cart" : "Out of Stock"}
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
}
