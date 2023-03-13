import {
  PayButtonElement,
  PaymentElement,
  AddressElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import React from "react";
import SubmitButton from "./submit-button";
import LoadingButton from "./loading-button";
import { countries } from "countries-list";
import CurrencySelect from "./currency-select";

export const countryInEurope = (country) => {
  return countries[country] && countries[country]["continent"] === "EU";
};

export default function CheckoutForm({
  currency,
  setCurrency,
  setPaymentComplete,
  addNewMessage,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [address, setAddress] = React.useState({});

  const handleAddressUpdate = (newAddress) => {
    if (newAddress.country === address.country) {
      return;
    }

    if (countryInEurope(newAddress.country)) {
      stripe.update(process.env.NEXT_PUBLIC_EU_STRIPE_PK);
      addNewMessage({
        message: "call stripe.update() to use Europe account PK",
      });
    } else {
      stripe.update(process.env.NEXT_PUBLIC_US_STRIPE_PK);
      addNewMessage({
        message: "call stripe.update() to use United States account PK",
      });

      if (currency !== "usd") {
        setCurrency("usd");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
    });

    if (error) {
      setIsLoading(false);
      setMessage(error.message);
      return;
    }

    const data = {
      country: address.country || "US",
      currency: currency,
      payment_method_id: paymentMethod.id,
    };

    const response = await fetch("/api/create-confirm-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());

    setIsLoading(false);
    if (response.error) {
      setMessage("Payment Failed!");
    } else if (response.status === "requires_action") {
      const { error: errorAction } = await stripe.handleNextAction({
        clientSecret: response.client_secret,
      });

      if (errorAction) {
        setMessage(errorAction);
      } else {
        setPaymentComplete(true);
      }
    } else {
      setPaymentComplete(true);
    }
  };

  return (
    <div id="checkout-page">
      <PayButtonElement
        onConfirm={handleSubmit}
        options={{ wallets: { googlePay: "always" } }}
      />
      <form id="payment-form" onSubmit={handleSubmit}>
        <h2 className="text-xl mb-3 mt-3">1. Organization info</h2>
        {countryInEurope(address.country) && (
          <CurrencySelect currency={currency} setCurrency={setCurrency} />
        )}
        <AddressElement
          options={{
            mode: "billing",
            display: { name: "organization" },
          }}
          onChange={(e) => {
            setAddress(e.value.address);
            handleAddressUpdate(e.value.address);
          }}
        />

        <h2 className="text-xl mb-3 mt-3">2. Payment method</h2>
        <PaymentElement />
        {isLoading || !stripe || !elements ? (
          <LoadingButton />
        ) : (
          <SubmitButton />
        )}

        {message && (
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
