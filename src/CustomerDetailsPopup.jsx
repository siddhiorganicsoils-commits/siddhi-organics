import React, { useEffect, useRef, useState } from "react";

export default function CustomerDetailsPopup({ isOpen, onClose, onSubmit }) {
  const nameRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    houseNo: "",
    street: "",
    pincode: "",
    city: "",
    state: "",
  });

  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [loadingPin, setLoadingPin] = useState(false);
  const [pinInfo, setPinInfo] = useState("");

  useEffect(() => {
    if (isOpen && nameRef.current) nameRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: "",
        mobile: "",
        email: "",
        houseNo: "",
        street: "",
        pincode: "",
        city: "",
        state: "",
      });
      setErrors({});
      setCities([]);
      setPinInfo("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ---------------- VALIDATION ----------------
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile))
      e.mobile = "Enter valid 10-digit mobile number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
      e.email = "Invalid email";
    if (!form.houseNo.trim()) e.houseNo = "House number required";
    if (!form.street.trim()) e.street = "Street / Area required";
    if (!/^[1-9]\d{5}$/.test(form.pincode)) e.pincode = "Invalid pincode";
    if (!form.city.trim()) e.city = "City required";
    if (!form.state.trim()) e.state = "State required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------------- PINCODE LOOKUP ----------------
  const fetchLocation = async (pin) => {
    setCities([]);
    setPinInfo("");
    setForm((p) => ({ ...p, city: "", state: "" }));

    if (!/^[1-9]\d{5}$/.test(pin)) return;

    try {
      setLoadingPin(true);
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (data?.[0]?.Status !== "Success") {
        setPinInfo("Location not found. Please enter manually.");
        return;
      }

      const offices = data[0].PostOffice || [];
      const uniqueCities = [...new Set(offices.map((o) => o.Name))];
      const state = offices[0]?.State || "";

      setCities(uniqueCities);
      setForm((p) => ({
        ...p,
        city: uniqueCities[0] || "",
        state,
      }));
    } catch {
      setPinInfo("Unable to fetch location. Please enter manually.");
    } finally {
      setLoadingPin(false);
    }
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-green-700 mb-4">
          Enter Delivery Details
        </h2>

        <div className="space-y-3">
          <input
            ref={nameRef}
            className="border rounded w-full p-2"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            className="border rounded w-full p-2"
            placeholder="Mobile Number"
            value={form.mobile}
            maxLength={10}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })
            }
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile}</p>
          )}

          <input
            className="border rounded w-full p-2"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="border rounded w-full p-2"
            placeholder="House / Flat No."
            value={form.houseNo}
            onChange={(e) => setForm({ ...form, houseNo: e.target.value })}
          />

          <input
            className="border rounded w-full p-2"
            placeholder="Street / Area"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
          />

          <input
            className="border rounded w-full p-2"
            placeholder="Pincode"
            value={form.pincode}
            maxLength={6}
            onChange={(e) => {
              const pin = e.target.value.replace(/\D/g, "");
              setForm({ ...form, pincode: pin });
              if (pin.length === 6) fetchLocation(pin);
            }}
          />
          {errors.pincode && (
            <p className="text-red-500 text-sm">{errors.pincode}</p>
          )}
          {pinInfo && <p className="text-orange-600 text-sm">{pinInfo}</p>}

          {cities.length > 0 && (
            <select
              className="border rounded w-full p-2"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            >
              {cities.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input
              className="border rounded p-2"
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              className="border rounded p-2"
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Continue to WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
