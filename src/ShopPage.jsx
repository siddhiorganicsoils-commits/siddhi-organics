import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import { Link, useParams, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";

const imgBase =
  "https://oryuihfxwdlyyhmpfedh.supabase.co/storage/v1/object/public/assets/products/";

const gheeImg = imgBase + "ghee.jpg";
const oilsCatImg = imgBase + "oils.jpg";
const sweetsImg = imgBase + "sweets.jpg";
const picklesImg = imgBase + "pickles.jpg";
const poduluImg = imgBase + "podulu.jpg";

export default function ShopPage() {
  const navigate = useNavigate();
  const { category } = useParams();

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
  }, [sizes, category]);

  const loadSizes = async () => {
    const { data } = await supabase.from("product_sizes").select("*");
    if (data) setSizes(data);
  };

  const loadProducts = async () => {
    let query = supabase
      .from("products")
      .select("*")
      .order("display_order", { ascending: true });

    if (category) query = query.eq("category", category);

    const { data } = await query;

    if (!data) {
      setProducts([]);
      return;
    }

    const withImages = data.map((p) => ({
      ...p,
      img: p.image_url
        ? imgBase + p.image_url.replace("/products/", "")
        : "",
    }));

    setProducts(withImages);

    const defaults = {};
    withImages.forEach((p) => {
      if (p.sweet_type === "fixed") defaults[p.id] = { count: 1 };
      else if (p.sweet_type === "weight")
        defaults[p.id] = { size: "500g", count: 1 };
      else defaults[p.id] = { size: "1L", count: 1 };
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

  const getTotalFor = (product) => {
    const sel = selected[product.id];
    if (!sel) return 0;

    if (product.sweet_type === "fixed")
      return product.base_price * sel.count;

    const sizeRow = sizes.find(
      (s) =>
        s.product_id === product.id &&
        s.size_label === sel.size
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

  const categories = [
    { name: "Ghee", img: gheeImg, slug: "ghee" },
    { name: "Oils", img: oilsCatImg, slug: "oils" },
    { name: "Sweets & Snacks", img: sweetsImg, slug: "sweets" },
    { name: "Pickles", img: picklesImg, slug: "pickles" },
    { name: "Podulu", img: poduluImg, slug: "podulu" },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-10">

        {/* ✅ HEADER */}
        <header className="flex items-center justify-between mb-6">
          <Link to="/" className="text-green-700 font-semibold">
            ← Back
          </Link>

          <div className="bg-green-100 px-3 py-1 rounded">
            🛒 Cart: {cartCount}
          </div>
        </header>

        {/* ✅ CATEGORY ICON BAR */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {categories.map((cat) => {
            const isActive = category === cat.slug;

            return (
              <div
                key={cat.slug}
                onClick={() => navigate(`/shop/${cat.slug}`)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div
                  className={`p-1 rounded-full transition-all duration-300
                    ${
                      isActive
                        ? "bg-green-600"
                        : "bg-transparent group-hover:bg-green-100"
                    }`}
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-24 h-24 object-cover rounded-full shadow-md"
                  />
                </div>

                <p
                  className={`text-sm mt-2 font-medium transition
                    ${
                      isActive
                        ? "text-green-700 font-semibold"
                        : "text-gray-700"
                    }`}
                >
                  {cat.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* ✅ EMPTY STATE */}
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No products found in this category
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => {
              const sel = selected[p.id] || { count: 1 };
              const total = getTotalFor(p);
              const sizeOptions = getSizeOptions(p.id);

              const selectedSizeRow = sizeOptions.find(
                (s) => s.size_label === sel.size
              );

              const price =
                p.sweet_type === "fixed"
                  ? p.base_price
                  : selectedSizeRow
                  ? p.base_price * selectedSizeRow.multiplier
                  : p.base_price;

              return (
                <div
                  key={p.id}
                  className="border rounded-2xl p-6 bg-white shadow hover:shadow-md transition"
                >
                  <img
                    src={p.img}
                    alt={p.name}
                    className="rounded-xl mb-4 h-48 w-full object-cover"
                  />

                  <h2 className="text-lg font-semibold">{p.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {p.short_desc}
                  </p>

                  <p className="text-green-700 font-medium mt-3">
                    {p.sweet_type === "fixed"
                      ? `₹${p.base_price} / box`
                      : `₹${price.toLocaleString()} / ${sel.size}`}
                  </p>

                  <div className="flex gap-2 mt-4">
                    {p.sweet_type !== "fixed" &&
                      sizeOptions.length > 0 && (
                        <select
                          className="border rounded p-2 flex-1"
                          value={sel.size}
                          onChange={(e) =>
                            handleChange(p.id, "size", e.target.value)
                          }
                        >
                          {sizeOptions.map((s) => (
                            <option key={s.id}>
                              {s.size_label}
                            </option>
                          ))}
                        </select>
                      )}

                    <select
                      className="border rounded p-2 w-20"
                      value={sel.count}
                      onChange={(e) =>
                        handleChange(
                          p.id,
                          "count",
                          Number(e.target.value)
                        )
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
                    onClick={() => handleAdd(p)}
                    className={`w-full py-2 mt-4 rounded transition-all duration-300
                      ${
                        p.in_stock
                          ? addedItem === p.id
                            ? "bg-green-700 text-white"
                            : "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
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
        )}
      </div>

      <Footer />
    </>
  );
}
