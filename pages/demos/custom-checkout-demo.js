import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CustomCheckoutProvider } from "@stripe/react-stripe-js";

import CustomCheckoutForm from "../../components/custom-checkout-form";
import Layout from "../../components/layout";
import Head from "next/head";
import TestModeBadge from "../../components/test-mode-badge";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_US_STRIPE_PK, {
  betas: ["custom_checkout_beta_1"],
});

export default function CustomCheckoutDemo() {
  const [clientSecret, setClientSecret] = React.useState("");

  React.useEffect(() => {
    // Create CheckoutSession as soon as the page loads
    fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    elementsOptions: {
      appearance,
    },
  };

  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">
        <TestModeBadge />
        Custom Checkout Demo
      </h1>
      {clientSecret && (
        <CustomCheckoutProvider options={options} stripe={stripePromise}>
          <CustomCheckoutForm />
        </CustomCheckoutProvider>
      )}
    </Layout>
  );
}
