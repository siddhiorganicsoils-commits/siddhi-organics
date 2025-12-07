import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabase";

export default function CustomerDetailsPopup({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    houseNo: "",
    street: "",
    city: "",
    state: "",
    district: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const [shippingCharge, setShippingCharge] = useState(null);
  const [localities, setLocalities] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [pincodeWarning, setPincodeWarning] = useState("");

  const nameInputRef = useRef(null);

  // Autofocus name field
  useEffect(() => {
    if (isOpen && nameInputRef.current) nameInputRef.current.focus();
  }, [isOpen]);

  // Reset popup on open
  useEffect(() => {
    if (isOpen) {
      setForm({
        name: "",
        mobile: "",
        email: "",
        houseNo: "",
        street: "",
        city: "",
        state: "",
        district: "",
        pincode: "",
      });
      setErrors({});
      setShippingCharge(null);
      setLocalities([]);
      setLoadingLocation(false);
      setPincodeWarning("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ---------------------------------------------------------
  // VALIDATION
  // ---------------------------------------------------------
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!/^[6-9]\d{9}$/.test(form.mobile))
      newErrors.mobile = "Enter valid 10-digit mobile number";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email))
      newErrors.email = "Enter valid email";

    if (!form.houseNo.trim()) newErrors.houseNo = "House number required";
    if (!form.street.trim()) newErrors.street = "Street/Area required";

    if (!form.city.trim()) newErrors.city = "Select locality";
    if (!form.state.trim()) newErrors.state = "State required";

    if (!/^[1-9][0-9]{5}$/.test(form.pincode))
      newErrors.pincode = "Enter valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------------------------------------
  // FETCH PINCODE DETAILS
  // ---------------------------------------------------------
  const fetchLocation = async (pin) => {
    setPincodeWarning("");
    setLocalities([]);
    setForm((prev) => ({ ...prev, city: "", state: "", district: "" }));

    try {
      setLoadingLocation(true);

      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      const data = await res.json();

      if (!data || data[0].Status !== "Success") {
        setPincodeWarning("⚠️ Invalid pincode — cannot fetch location.");
        return;
      }

      const offices = data[0].PostOffice;

      const localityNames = offices.map((o) => o.Name);
      const districts = [...new Set(offices.map((o) => o.District))];
      const states = [...new Set(offices.map((o) => o.State))];

      setLocalities(localityNames);

      setForm((prev) => ({
        ...prev,
        city: localityNames[0] || "",
        district: districts[0] || "",
        state: states[0] || "",
      }));
    } catch (err) {
      setPincodeWarning("⚠️ Unable to fetch location. Try again.");
    } finally {
      setLoadingLocation(false);
    }
  };

  // ---------------------------------------------------------
  // CHECK SHIPPING FROM SUPABASE
  // ---------------------------------------------------------
  const checkPincode = async (pin) => {
    const { data } = await supabase
      .from("shipping_zones")
      .select("*")
      .eq("pincode", pin)
      .maybeSingle();

    setShippingCharge(data ? data.charge : null);
  };

  // ---------------------------------------------------------
  // SUBMIT
  // ---------------------------------------------------------
  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ ...form, shippingCharge });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-xl font-bold mb-4 text-green-700">
          Enter Delivery Details
        </h2>

        <div className="space-y-3">
          {/* NAME */}
          <input
            ref={nameInputRef}
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border rounded w-full p-2"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          {/* MOBILE */}
          <input
            type="tel"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(e) =>
              setForm({ ...form, mobile: e.target.value.slice(0, 10) })
            }
            className="border rounded w-full p-2"
            maxLength={10}
          />
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded w-full p-2"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          {/* HOUSE NO */}
          <input
            type="text"
            placeholder="House / Flat No."
            value={form.houseNo}
            onChange={(e) => setForm({ ...form, houseNo: e.target.value })}
            className="border rounded w-full p-2"
          />
          {errors.houseNo && <p className="text-red-500 text-sm">{errors.houseNo}</p>}

          {/* STREET */}
          <input
            type="text"
            placeholder="Street / Area"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            className="border rounded w-full p-2"
          />
          {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}

          {/* PINCODE */}
          <div className="relative">
            <input
              type="text"
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => {
                const pin = e.target.value.replace(/\D/g, "").slice(0, 6);
                setForm({ ...form, pincode: pin });

                if (pin.length === 6) {
                  fetchLocation(pin);
                  checkPincode(pin);
                } else {
                  setLocalities([]);
                  setShippingCharge(null);
                  setPincodeWarning("");
                }
              }}
              className="border rounded w-full p-2 pr-10"
              maxLength={6}
            />

            {/* CENTERED LOADER */}
            {loadingLocation && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode}</p>
            )}

            {pincodeWarning && (
              <p className="text-orange-600 text-sm">{pincodeWarning}</p>
            )}

            {shippingCharge !== null && (
              <p className="mt-2 p-2 bg-green-50 border rounded text-sm">
                Shipping charge: ₹{shippingCharge}
              </p>
            )}
          </div>

          {/* LOCALITY DROPDOWN */}
          {localities.length > 0 && (
            <div>
              <select
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
                className="border rounded w-full p-2"
              >
                {localities.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>
          )}

          {/* DISTRICT + STATE */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="District"
              value={form.district}
              readOnly
              className="border rounded w-full p-2 bg-gray-100"
            />
            <input
              type="text"
              placeholder="State"
              value={form.state}
              readOnly
              className="border rounded w-full p-2 bg-gray-100"
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Continue to WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
