import { useCustomCheckout } from "@stripe/react-stripe-js";

export default function ({ setPaymentComplete }) {
  const { confirm, canConfirm, confirmationRequirements } = useCustomCheckout();
  const handleConfirm = async () => {
    await confirm();
    setPaymentComplete(true);
  };

  return (
    <div className="space-y-2 mt-5">
      <button
        disabled={!canConfirm}
        onClick={handleConfirm}
        className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition duration-200 ease-in-out   
                ${
                  !canConfirm
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
      >
        Pay
      </button>
      {confirmationRequirements.length > 0 && (
        <div className="p-4 border-l-4 border-yellow-500 bg-yellow-100 text-yellow-700 rounded">
          Missing: {confirmationRequirements.join(", ")}
        </div>
      )}
    </div>
  );
}
