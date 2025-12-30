import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Link } from "react-router-dom";
import Footer from "./components/Footer";

const imgBase =
  "https://oryuihfxwdlyyhmpfedh.supabase.co/storage/v1/object/public/assets/products/";

export default function ShopPage() {
  const [products, setProducts] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selected, setSelected] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [addedItem, setAddedItem] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadSizes();
  }, []);

  useEffect(() => {
    if (sizes.length > 0) loadProducts();
    const saved = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartCount(saved.length);
  }, [sizes]);

  // -------- LOAD SIZES --------
  const loadSizes = async () => {
    const { data } = await supabase.from("product_sizes").select("*");
    if (data) setSizes(data);
  };

  // -------- LOAD PRODUCTS --------
  const loadProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("display_order", { ascending: true });

    if (!data) {
      setProducts([]);
      return;
    }

    const withImages = data.map((p) => ({
      ...p,
      img: p.image_url ? imgBase + p.image_url.replace("/products/", "") : "",
    }));

    setProducts(withImages);

    const defaults = {};
    withImages.forEach((p) => {
      if (p.sweet_type === "fixed") {
        defaults[p.id] = { count: 1 };
      } else if (p.sweet_type === "weight") {
        defaults[p.id] = { size: "500g", count: 1 };
      } else {
        defaults[p.id] = { size: "1L", count: 1 };
      }
    });

    setSelected(defaults);
  };

  const getSizeOptions = (productId) =>
    sizes.filter((s) => s.product_id === productId);

  const handleChange = (id, field, value) => {
    setSelected((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // -------- TOTAL --------
  const getTotalFor = (product) => {
    const sel = selected[product.id];
    if (!sel) return 0;

    if (product.sweet_type === "fixed") {
      return product.base_price * sel.count;
    }

    const sizeRow = sizes.find(
      (s) => s.product_id === product.id && s.size_label === sel.size
    );

    if (!sizeRow) return 0;

    return product.base_price * sizeRow.multiplier * sel.count;
  };

  const handleAdd = (product) => {
    if (!product.in_stock || product.coming_soon) return;

    const sel = selected[product.id];
    const total = getTotalFor(product);

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    cart.push({
      id: product.id,
      name: product.name,
      size: sel.size || "box",
      qty: sel.count,
      total,
      time: new Date().toISOString(),
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    setCartCount(cart.length);

    setAddedItem(product.id);
    setTimeout(() => setAddedItem(null), 500);
  };

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
          <Link to="/" className="text-green-700 font-semibold">
            ← Back
          </Link>

          <h1 className="text-3xl font-bold text-green-700">
            Siddhi Organics — Wooden Cold-Pressed Oils
          </h1>

          <div className="bg-green-100 px-3 py-1 rounded">
            🛒 Cart: {cartCount}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map((p) => {
            const sel = selected[p.id] || { count: 1 };
            const total = getTotalFor(p);
            const sizeOptions = getSizeOptions(p.id);

            return (
              <div key={p.id} className="border rounded-2xl p-6 bg-white shadow">
                <img
                  src={p.img}
                  alt={p.name}
                  className="rounded-xl mb-4 h-48 w-full object-cover"
                />

                <h2 className="text-lg font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{p.short_desc}</p>

                <p className="text-green-700 font-medium mt-3">
                  {p.sweet_type === "fixed"
                    ? `₹${p.base_price} / box`
                    : sizeOptions.length > 0
                    ? `₹${(
                        p.base_price *
                        sizeOptions.find((s) => s.size_label === sel.size)
                          ?.multiplier
                      ).toLocaleString()} / ${sel.size}`
                    : `₹${p.base_price} / 1L`}
                </p>

                <div className="flex gap-2 mt-4">
                  {p.sweet_type !== "fixed" && sizeOptions.length > 0 && (
                    <select
                      className="border rounded p-2 flex-1"
                      value={sel.size}
                      onChange={(e) =>
                        handleChange(p.id, "size", e.target.value)
                      }
                    >
                      {sizeOptions.map((s) => (
                        <option key={s.id}>{s.size_label}</option>
                      ))}
                    </select>
                  )}

                  <select
                    className={`border rounded p-2 ${
                      p.sweet_type === "fixed" ? "w-full" : "w-20"
                    }`}
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

                <p className="mt-3 font-medium">
                  Total: ₹{total.toLocaleString()}
                </p>

                <button
                  disabled={!p.in_stock && !p.coming_soon}
                  onClick={() => handleAdd(p)}
                  className={`w-full py-2 mt-4 rounded transition-all duration-300
                    ${
                      p.in_stock
                        ? addedItem === p.id
                          ? "bg-green-700 text-white"
                          : "bg-green-600 text-white hover:bg-green-700"
                        : p.coming_soon
                        ? "bg-yellow-400 text-yellow-900 cursor-not-allowed"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                  {p.in_stock
                    ? addedItem === p.id
                      ? "Added ✓"
                      : "Add to Cart"
                    : p.coming_soon
                    ? "Coming Soon"
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
