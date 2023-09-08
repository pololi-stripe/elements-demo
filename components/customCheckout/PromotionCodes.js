import React from "react";
import { useCustomCheckout } from "@stripe/react-stripe-js";

export default function PromotionCodes() {
  const { applyPromotionCode, removePromotionCode } = useCustomCheckout();
  const [draft, setDraft] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleChange = (e) => {
    setDraft(e.target.value);
  };
  const handleSubmit = () => {
    setLoading(true);
    applyPromotionCode(draft).then(() => {
      setDraft(draft);
      setLoading(false);
    });
  };
  const handleRemove = () => {
    removePromotionCode();
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={draft}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="px-4 py-2 text-white bg-blue-500 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply
        </button>
        <button
          onClick={handleRemove}
          className="px-4 py-2 text-white bg-red-500 rounded-lg"
        >
          Remove
        </button>
      </div>
      <p className="text-sm text-blue-500">
        Use <span className="font-bold">FIRST</span> to get 10% off
      </p>
    </div>
  );
}
