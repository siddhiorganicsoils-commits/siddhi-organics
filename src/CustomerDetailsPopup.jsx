import React, { useState, useEffect, useRef } from "react";

export default function CustomerDetailsPopup({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

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
        pincode: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile))
      newErrors.mobile = "Enter valid 10-digit mobile number";
    if (form.email && !/^[\\w.%+-]+@[\\w.-]+\\.[A-Za-z]{2,}$/.test(form.email))
      newErrors.email = "Enter valid email";

    if (!form.houseNo.trim()) newErrors.houseNo = "House number required";
    if (!form.street.trim()) newErrors.street = "Street/Area required";
    if (!form.city.trim()) newErrors.city = "City required";
    if (!form.state.trim()) newErrors.state = "State required";
    if (!/^[1-9][0-9]{5}$/.test(form.pincode))
      newErrors.pincode = "Enter valid 6-digit pincode";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
      onClose();
      setForm({
        name: "",
        mobile: "",
        email: "",
        houseNo: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
      });
    }
  };
  const fetchLocation = async (pin) => {
  if (!/^[1-9][0-9]{5}$/.test(pin)) return;
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    const data = await res.json();
    if (data && data[0].PostOffice && data[0].PostOffice.length > 0) {
      const info = data[0].PostOffice[0];
      setForm((prev) => ({
        ...prev,
        city: info.District,
        state: info.State,
      }));
      setErrors((prev) => {
        const { city, state, ...rest } = prev;
        return rest;
      });
    }
  } catch (err) {
    console.error("Error fetching location:", err);
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 animate-fadeIn relative">
        <h2 className="text-xl font-bold mb-4 text-green-700">
          Enter Delivery Details
        </h2>

        <div className="space-y-3">
          <div>
            <input
              ref={nameInputRef}
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border rounded w-full p-2"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Mobile Number"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="border rounded w-full p-2"
              maxLength={10}
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm">{errors.mobile}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email (optional)"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border rounded w-full p-2"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="House / Flat No."
              value={form.houseNo}
              onChange={(e) => setForm({ ...form, houseNo: e.target.value })}
              className="border rounded w-full p-2"
            />
            {errors.houseNo && (
              <p className="text-red-500 text-sm">{errors.houseNo}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Street / Area"
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="border rounded w-full p-2"
            />
            {errors.street && (
              <p className="text-red-500 text-sm">{errors.street}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <input
                type="text"
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="border rounded w-full p-2"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city}</p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="border rounded w-full p-2"
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Pincode"
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
              onBlur={(e) => fetchLocation(e.target.value)}
              className="border rounded w-full p-2"
              maxLength={6}
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm">{errors.pincode}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => {
              setForm({
                name: "",
                mobile: "",
                email: "",
                houseNo: "",
                street: "",
                city: "",
                state: "",
                pincode: "",
              });
              onClose();
            }}
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
