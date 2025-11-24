import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Link } from "react-router-dom";
import Footer from "./components/Footer";

const imgBase =
  "https://oryuihfxwdlyyhmpfedh.supabase.co/storage/v1/object/public/assets/products/";

export default function ShopPage() {
  const [products, setProducts] = useState(null); // null = loading
  const [sizes, setSizes] = useState([]);
  const [selected, setSelected] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadProducts();
    loadSizes();

    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(saved.length);
  }, []);

  // ---------------- LOAD PRODUCTS ----------------
  const loadProducts = async () => {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      setProducts([]); // still render page
      return;
    }

    let withImages = [];
    try {
      withImages = data.map((p) => ({
        ...p,
        img: p.image_url
          ? imgBase + p.image_url.replace("/products/", "")
          : "", // safe fallback
      }));
    } catch (e) {
    }

    setProducts(withImages);

    // Default selections
    const defaults = {};
    withImages.forEach((p) => {
      defaults[p.id] = { size: "250ml", count: 1 };
    });
    setSelected(defaults);
  };

  // ---------------- LOAD SIZES ----------------
  const loadSizes = async () => {
    const { data, error } = await supabase.from("product_sizes").select("*");

    if (error) {
      return;
    }

    setSizes(data);
  };

  const getSizeOptions = (productId) =>
    sizes.filter((s) => s.product_id === productId);

  const handleChange = (id, field, value) => {
    setSelected((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const getTotalFor = (product) => {
    const sel = selected[product.id];
    if (!sel) return 0;

    const sizeRow = sizes.find(
      (s) => s.product_id === product.id && s.size_label === sel.size
    );

    if (!sizeRow) return 0;

    return (
      Number(product.base_price) *
      Number(sizeRow.multiplier) *
      Number(sel.count)
    );
  };

  const handleAdd = (product) => {
    const sel = selected[product.id];
    const sizeRow = sizes.find(
      (s) => s.product_id === product.id && s.size_label === sel.size
    );

    const total =
      Number(product.base_price) *
      Number(sizeRow.multiplier) *
      Number(sel.count);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
      id: product.id,
      name: product.name,
      size: sel.size,
      qty: sel.count,
      pricePer250: product.base_price,
      total,
      time: new Date().toISOString(),
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);

    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 500);
  };

  // ---------------- LOADING SCREEN ----------------
  if (products === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex items-center justify-between mb-10">
          <Link
            to="/"
            onClick={() => window.scrollTo(0, 0)}
            className="inline-block mb-3 text-green-700 hover:text-green-900 font-semibold"
          >
            ← Back
          </Link>

          <h1 className="text-3xl font-bold text-green-700">
            Siddhi Organics — Wooden Cold-Pressed Oils
          </h1>

          <div className="text-sm bg-green-100 px-3 py-1 rounded-lg">
            🛒 Cart: {cartCount} items
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((p) => {
            const sel = selected[p.id] || { size: "250ml", count: 1 };
            const total = getTotalFor(p);
            const sizeOptions = getSizeOptions(p.id);

            return (
              <div
                key={p.id}
                className="border rounded-2xl p-6 bg-white shadow"
              >
                <img
                  src={p.img}
                  alt={p.name}
                  className="rounded-xl mb-4 h-48 w-full object-cover"
                />

                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{p.short_desc}</p>

                <p className="font-medium mt-4 text-green-700">
                  ₹{p.base_price} / 250ml
                </p>

                <div className="flex gap-2 mt-4">
                  <select
                    className="border rounded p-2 text-sm flex-1"
                    value={sel.size}
                    onChange={(e) =>
                      handleChange(p.id, "size", e.target.value)
                    }
                  >
                    {sizeOptions.map((s) => (
                      <option key={s.id}>{s.size_label}</option>
                    ))}
                  </select>

                  <select
                    className="border rounded p-2 text-sm w-20"
                    value={sel.count}
                    onChange={(e) =>
                      handleChange(p.id, "count", Number(e.target.value))
                    }
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <p className="text-gray-700 font-medium mt-3">
                  Total: ₹{total.toLocaleString()}
                </p>

                <button
                  disabled={!p.in_stock}
                  onClick={() => handleAdd(p)}
                  className={`py-2 mt-4 rounded w-full transition-all duration-300 ${p.in_stock
                      ? addedItem === p.id
                        ? "bg-green-700 text-white scale-105"
                        : "bg-green-600 text-white hover:bg-green-700"
                      : "bg-gray-300 text-gray-600"
                    }`}
                >
                  {p.in_stock
                    ? addedItem === p.id
                      ? "Added ✓"
                      : "Add to Cart"
                    : "Out of Stock"}
                </button>

              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </>
  );
}
