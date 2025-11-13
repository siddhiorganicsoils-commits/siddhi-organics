import React, { useEffect } from "react";

export default function Toast({ show, message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => onClose(), 1800);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
      }`}
    >
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-sm font-medium">
        {message}
      </div>
    </div>
  );
}
