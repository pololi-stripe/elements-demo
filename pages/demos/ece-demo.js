import Head from "next/head";
import { useState } from "react";
import Layout from "../../components/layout";
import TestModeBadge from "../../components/test-mode-badge";
import { loadStripe } from "@stripe/stripe-js";
import {
  ExpressCheckoutElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripe = loadStripe(process.env.NEXT_PUBLIC_US_STRIPE_PK);

const DEFAULT_LINE_ITEMS = [
  {
    name: "Sample item",
    amount: 1000,
  },
  {
    name: "Tax",
    amount: 100,
  },
];

const SHIPPING_RATES = [
  {
    id: "free-shipping",
    displayName: "Free shipping",
    amount: 0,
    deliveryEstimate: {
      maximum: { unit: "day", value: 7 },
      minimum: { unit: "day", value: 5 },
    },
  },
  {
    id: "premium-shipping",
    displayName: "Premium shipping",
    amount: 1000,
    deliveryEstimate: {
      maximum: { unit: "day", value: 3 },
      minimum: { unit: "day", value: 1 },
    },
  },
];

const totalAmount = (lineItems) => {
  return lineItems.reduce((accu, curr) => accu + curr.amount, 0);
};

const ChecoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState();

  const eceOptions = {
    wallets: {
      applePay: "always",
      googlePay: "always",
    },
  };

  const onReady = (event) => {
    console.log("onReady", event);

    if (!event.availablePaymentMethods) {
      setErrorMessage("No payment methods available");
    }
  };

  const onClick = (event) => {
    console.log("onClick", event);
    const config = {
      allowedShippingCountries: ["US", "CA"],
      billingAddressRequired: true,
      business: { name: "Polo Business" },
      emailRequired: true,
      lineItems: DEFAULT_LINE_ITEMS,
      phoneNumberRequired: true,
      shippingAddressRequired: true,
      shippingRates: SHIPPING_RATES,
    };

    elements.update({ amount: totalAmount(DEFAULT_LINE_ITEMS) });
    event.resolve(config);
  };

  const onConfirm = async (event) => {
    console.log("onConfirm", event);

    if (!stripe) {
      return;
    }

    console.log("CALL elements.submit");
    const { error: submitError } = elements.submit();
    if (submitError) {
      console.log("ERROR elements.submit", submitError);
      setErrorMessage(submitError.message);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      elements,
      params: {
        billing_details: event.billingDetails,
      },
    });

    if (error) {
      console.log("ERROR stripe.createPaymentMethod", error);
      setErrorMessage(error.message);
      return;
    }

    const res = await fetch("/api/create-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "payment",
        currency: "usd",
        paymentMethodId: paymentMethod.id,
      }),
    });
    const { client_secret: clientSecret } = await res.json();

    const { error: confirmError } = await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        return_url: window.location.origin,
      },
    });

    if (confirmError) {
      console.log("ERROR stripe.confirmPayment", confirmError);
      setErrorMessage(confirmError.message);
      return;
    }
  };

  const onShippingAddressChange = (event) => {
    console.log("onShippingAddressChange", event);
    elements.update({ amount: totalAmount(DEFAULT_LINE_ITEMS) });
    event.resolve({
      lineItems: DEFAULT_LINE_ITEMS,
    });
  };

  const onShippingRateChange = (event) => {
    console.log("onShippingRateChange", event);
    let updatedLineItems = DEFAULT_LINE_ITEMS;
    switch (event.shippingRate.id) {
      case "free-shipping":
        break;
      case "premium-shipping":
        updatedLineItems = [
          ...DEFAULT_LINE_ITEMS,
          {
            name: "Premium shipping",
            amount: 1000,
          },
        ];
        break;
      default:
        break;
    }

    elements.update({ amount: totalAmount(updatedLineItems) });

    event.resolve({
      lineItems: updatedLineItems,
    });
  };

  const onCancel = () => {
    elements.update({ amount: totalAmount(DEFAULT_LINE_ITEMS) });
  };

  return (
    <div id="checkout-page">
      <ExpressCheckoutElement
        options={eceOptions}
        onReady={onReady}
        onClick={onClick}
        onConfirm={onConfirm}
        onShippingAddressChange={onShippingAddressChange}
        onShippingRateChange={onShippingRateChange}
        onCancel={onCancel}
      />
      {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
};

export default function EceDemo() {
  const elementsOptions = {
    mode: "payment",
    amount: 1099,
    currency: "usd",
    appearance: { theme: "stripe" },
    paymentMethodCreation: "manual",
  };

  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">
        <TestModeBadge />
        ECE Demo
      </h1>
      <Elements options={elementsOptions} stripe={stripe}>
        <ChecoutPage />
      </Elements>
    </Layout>
  );
}
