import { useCustomCheckout } from "@stripe/react-stripe-js";

export default function CustomerDetails() {
  const { phoneNumber, updatePhoneNumber, email, updateEmail } =
    useCustomCheckout();

  const handlePhoneNumberChange = (event) => {
    updatePhoneNumber(event.target.value);
  };

  const handleEmailChange = (event) => {
    updateEmail(event.target.value);
  };

  return (
    <>
      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <input
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          autoComplete="off"
          className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          onChange={handlePhoneNumberChange}
          value={phoneNumber || ""}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="mt-1 p-2 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          onChange={handleEmailChange}
          value={email || ""}
        />
      </div>
    </>
  );
}
