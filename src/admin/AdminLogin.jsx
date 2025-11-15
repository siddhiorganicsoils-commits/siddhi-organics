// src/admin/AdminLogin.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const nav = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg("");
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/admin/dashboard`,
            },
        });

        if (error) setMsg(error.message);
        else setMsg("Check your email for sign-in link (magic link).");
        setLoading(false);
    };

    // quick: if already logged in, redirect to dashboard
    supabase.auth.getSession().then(({ data }) => {
        if (data?.session) nav("/dashboard");
    });

    return (
        <div className="max-w-md mx-auto p-6 mt-24 shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Admin sign in</h2>
            <form onSubmit={handleLogin}>
                <label className="block mb-2 text-sm">Email</label>
                <input
                    type="email"
                    required
                    placeholder="admin@yourdomain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded mb-4"
                />
                <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>
                    {loading ? "Sending..." : "Send sign-in link"}
                </button>
            </form>
            {msg && <p className="mt-4 text-sm">{msg}</p>}
        </div>
    );
}
