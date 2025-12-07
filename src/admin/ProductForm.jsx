// src/admin/ProductForm.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { v4 as uuidv4 } from "uuid";

export default function ProductForm({ product, onDone }) {
  const isEdit = !!product?.id;
  const [name, setName] = useState(product?.name || "");
  const [short_desc, setShortDesc] = useState(product?.short_description || "");
  const [base_price, setBasePrice] = useState(product?.base_price || 250);
  const [in_stock, setInStock] = useState(Boolean(product?.in_stock));
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const imgBase = `${import.meta.env.VITE_SUPABASE_URL.replace(/\/$/, "")}/storage/v1/object/public/assets`;

  useEffect(() => {
    setName(product?.name || "");
    setShortDesc(product?.short_description || "");
    setBasePrice(product?.base_price || 250);
    setInStock(Boolean(product?.in_stock));
    setFile(null);
  }, [product]);

  const handleUpload = async () => {
    if (!file) return product?.image_url || null;
    setUploading(true);
    const filename = `products/${uuidv4()}-${file.name}`;
    const { error: upErr } = await supabase.storage.from("assets").upload(filename, file, { cacheControl: "3600", upsert: false });
    if (upErr) {
      setUploading(false);
      alert("Upload error: " + upErr.message);
      return null;
    }
    setUploading(false);
    // return path used in DB (leading slash so consistent)
    return `/${filename}`;
  };

  const handleSave = async () => {
    let image_url = product?.image_url || null;
    if (file) {
      const uploadedPath = await handleUpload();
      if (!uploadedPath) return;
      image_url = uploadedPath;
    }

    const row = {
      name,
      short_description: short_desc,
      base_price: Number(base_price),
      image_url,
      in_stock: in_stock,
    };

    if (isEdit) {
      const { error } = await supabase.from("products").update(row).eq("id", product.id);
      if (error) return alert("Update failed: " + error.message);
    } else {
      const { error } = await supabase.from("products").insert([row]);
      if (error) return alert("Create failed: " + error.message);
    }

    onDone?.();
  };

  return (
    <div className="border rounded p-4">
      <h3 className="font-semibold mb-3">{isEdit ? "Edit product" : "Add product"}</h3>

      <label className="block text-sm mb-1">Name</label>
      <input className="w-full border p-2 rounded mb-2" value={name} onChange={(e) => setName(e.target.value)} />

      <label className="block text-sm mb-1">Short description</label>
      <input className="w-full border p-2 rounded mb-2" value={short_desc} onChange={(e) => setShortDesc(e.target.value)} />

      <label className="block text-sm mb-1">Base price (₹ for 1L)</label>
      <input type="number" className="w-full border p-2 rounded mb-2" value={base_price} onChange={(e) => setBasePrice(e.target.value)} />

      <label className="block text-sm mb-1">Stock</label>
      <select className="w-full border p-2 rounded mb-2" value={in_stock ? "1" : "0"} onChange={(e) => setInStock(e.target.value === "1")}>
        <option value="1">In stock</option>
        <option value="0">Out of stock</option>
        {/* <option value="0">Coming Soon</option> */}
      </select>

      <label className="block text-sm mb-1">Image (optional)</label>
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
      <div className="mt-2 text-sm text-gray-600">Current image: {product?.image_url || "none"}</div>

      <div className="flex gap-2 mt-4">
        <button onClick={handleSave} disabled={uploading} className="bg-green-600 text-white px-4 py-2 rounded">
          {isEdit ? "Save" : "Create"}
        </button>

        <button onClick={() => onDone?.()} className="bg-gray-200 px-3 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
}
