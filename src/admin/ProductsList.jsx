// src/admin/ProductsList.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ProductsList({ onEdit, refreshKey }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const imgBase = `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/assets`;

  useEffect(() => {
    load();
  }, [refreshKey]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) console.error(error);
    else setProducts(data || []);
    setLoading(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return alert("Delete failed: " + error.message);
    // optionally delete image from storage if you want
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      {loading && <div>Loading…</div>}
      {!loading && products.length === 0 && <div>No products yet.</div>}

      <div className="space-y-4">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between border rounded p-3">
            <div className="flex items-center gap-4">
              <img src={p.image_url ? imgBase + p.image_url : ""} alt={p.name} className="w-24 h-16 object-cover rounded" />
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-600">₹{p.base_price} • {p.in_stock ? "In stock" : "Out of stock"}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => onEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
              <button onClick={() => remove(p.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
