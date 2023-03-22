import React from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import SubmitButton from "./submit-button";
import LoadingButton from "./loading-button";
import CurrencySelect from "./currency-select";

export default function LinkForm({ currency, setCurrency, addNewMessage }) {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          addNewMessage("Payment succeeded!");
          break;
        case "processing":
          addNewMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          addNewMessage("Your payment was not successful, please try again.");
          break;
        default:
          addNewMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const data = { currency };
    const res = await fetch("/api/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const { client_secret: clientSecret } = await res.json();

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      addNewMessage(error.message || "An unexpected error occurred.");
    } else {
      addNewMessage("Payment succeeded!");
    }

    setIsLoading(false);
  };

  const onCurrencyChange = (newCurrency) => {
    if (newCurrency === currency) {
      return;
    }

    if (newCurrency === "eur") {
      stripe.update(process.env.NEXT_PUBLIC_EU_STRIPE_PK);
      addNewMessage("call stripe.update() to use Europe account PK");
    } else {
      stripe.update(process.env.NEXT_PUBLIC_US_STRIPE_PK);
      addNewMessage("call stripe.update() to use United States account PK");
    }

    setCurrency(newCurrency);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <CurrencySelect currency={currency} setCurrency={onCurrencyChange} />
      <LinkAuthenticationElement
        id="link-authentication-element"
        onChange={(e) => setEmail(e.value.email)}
        className="mb-3"
      />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      {isLoading || !stripe || !elements ? <LoadingButton /> : <SubmitButton />}
    </form>
  );
}
