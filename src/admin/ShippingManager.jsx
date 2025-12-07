import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function ShippingManager() {
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState({ pincode: "", area: "", charge: 50 });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("shipping_zones")
      .select("*")
      .order("pincode");
    setZones(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const saveZone = async () => {
    if (!form.pincode) return alert("Please enter pincode");
    if (form.pincode.length !== 6)
      return alert("Pincode must be 6 digits");

    setLoading(true);
    await supabase.from("shipping_zones").insert(form);
    setLoading(false);

    setForm({ pincode: "", area: "", charge: 50 });
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this zone?")) return;
    await supabase.from("shipping_zones").delete().eq("id", id);
    load();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Manage Shipping Zones
      </h1>

      {/* Card for Adding Zone */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Add New Zone
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            placeholder="Pincode"
            value={form.pincode}
            onChange={(e) =>
              setForm({ ...form, pincode: e.target.value })
            }
          />

          <input
            className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            placeholder="Area Name"
            value={form.area}
            onChange={(e) =>
              setForm({ ...form, area: e.target.value })
            }
          />

          <input
            type="number"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            placeholder="Delivery Charge"
            value={form.charge}
            onChange={(e) =>
              setForm({
                ...form,
                charge: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>

        <button
          onClick={saveZone}
          disabled={loading}
          className={`mt-5 px-5 py-2 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Saving..." : "Save Zone"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 text-left">Pincode</th>
              <th className="p-3 text-left">Area</th>
              <th className="p-3 text-left">Charge</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {zones.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="text-center p-6 text-gray-500"
                >
                  No shipping zones added yet.
                </td>
              </tr>
            )}

            {zones.map((z, index) => (
              <tr
                key={z.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-green-50 transition`}
              >
                <td className="p-3">{z.pincode}</td>
                <td className="p-3">{z.area}</td>
                <td className="p-3">₹{z.charge}</td>
                <td className="p-3">
                  <button
                    onClick={() => remove(z.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
