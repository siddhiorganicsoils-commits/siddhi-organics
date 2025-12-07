// src/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ProductsList from "./ProductsList";
import ProductForm from "./ProductForm";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(null); // product row to edit (or null)
  const [refreshKey, setRefreshKey] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data?.session) nav("/admin-login");
      else setUser(data.session.user);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) nav("/admin-login");
      else setUser(session.user);
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    nav("/");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div>
          <button onClick={() => setEditing({})} className="mr-2 bg-blue-600 text-white px-3 py-1 rounded">Add product</button>
          <button
            onClick={() => nav("/admin/shipping")}
            className="mr-2 bg-yellow-600 text-white px-3 py-1 rounded"
          >
            Shipping Manager
          </button>

          <button onClick={() => setRefreshKey(k => k + 1)} className="mr-2 bg-gray-200 px-3 py-1 rounded">Refresh</button>
          <button onClick={signOut} className="bg-red-600 text-white px-3 py-1 rounded">Sign out</button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProductsList onEdit={(p) => setEditing(p)} refreshKey={refreshKey} />
        </div>

        <div className="md:col-span-1">
          <ProductForm
            key={editing?.id || "new"}
            product={editing}
            onDone={() => { setEditing(null); setRefreshKey(k => k + 1); }}
          />
        </div>
      </div>
    </div>
  );
}
