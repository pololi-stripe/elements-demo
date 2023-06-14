import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import SubmitButton from "./submit-button";
import LoadingButton from "./loading-button";

export default function PendingAmountCheckoutForm({ elementsOptions }) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const handleError = (error) => {
    setIsLoading(false);
    setErrorMessage(error.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      handleError(submitError);
      return;
    }

    const data = {
      currency: elementsOptions.currency,
      mode: elementsOptions.mode,
    };

    const res = await fetch("/api/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const { client_secret: clientSecret } = await res.json();

    const confirmInput = {
      elements,
      clientSecret,
      confirmParams: { return_url: window.location.origin },
    };
    const { error } =
      elementsOptions.mode === "setup"
        ? await stripe.confirmSetup(confirmInput)
        : await stripe.confirmPayment(confirmInput);

    if (error) {
      handleError(error);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <div id="checkout-page">
      <form id="payment-form" onSubmit={handleSubmit}>
        <h2 className="text-xl mb-3 mt-3">Payment Element form</h2>
        <PaymentElement />
        {isLoading || !stripe || !elements ? (
          <LoadingButton />
        ) : (
          <SubmitButton />
        )}

        {errorMessage && (
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
}
