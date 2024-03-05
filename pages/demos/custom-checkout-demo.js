import React from "react";
// import { loadStripe } from "@stripe/stripe-js";
import { CustomCheckoutProvider } from "@stripe/react-stripe-js";

import CustomCheckoutForm from "../../components/custom-checkout-form";
import Layout from "../../components/layout";
import Head from "next/head";
import TestModeBadge from "../../components/test-mode-badge";

const stripePromise = Stripe(process.env.NEXT_PUBLIC_US_STRIPE_PK, {
  betas: ["custom_checkout_beta_2"],
});

const PaymentComplete = () => {
  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">
        <TestModeBadge />
        Custom Checkout Demo
      </h1>

      <div
        className="p-4 my-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
        role="alert"
      >
        Payment Succeed!
      </div>
    </Layout>
  );
};

export default function CustomCheckoutDemo() {
  const [clientSecret, setClientSecret] = React.useState("");
  const [paymentComplete, setPaymentComplete] = React.useState(false);

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

  if (paymentComplete) {
    return <PaymentComplete />;
  }

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
          <CustomCheckoutForm setPaymentComplete={setPaymentComplete} />
        </CustomCheckoutProvider>
      )}
    </Layout>
  );
}
