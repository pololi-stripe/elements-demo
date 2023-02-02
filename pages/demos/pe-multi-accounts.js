import Head from "next/head";
import { useState } from "react";
import Layout from "../../components/layout";
import TestModeBadge from "../../components/test-mode-badge";
import CheckoutForm, { countryInEurope } from "../../components/checkout-form";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const PaymentComplete = ({ messages }) => {
  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">
        <TestModeBadge />
        Payment Element + Multiple Accounts
      </h1>

      <div
        className="p-4 my-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
        role="alert"
      >
        Payment Succeed!
      </div>

      <div className="bg-slate-200 rounded-md my-5 p-5">
        {messages.map((m) => (
          <p key={`msg-${m.id}`} className="text-slate-600">
            {m.id}: {m.message}
          </p>
        ))}
      </div>
    </Layout>
  );
};

const stripe = loadStripe(process.env.NEXT_PUBLIC_US_STRIPE_PK, {
  betas: ["elements_enable_deferred_intent_beta_1"],
});

let nextId = 0;

export default function PaymentElementMultipleAccounts() {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [publicKey, setPublicKey] = useState(
    process.env.NEXT_PUBLIC_US_STRIPE_PK
  );
  const [messages, setMessages] = useState([
    {
      id: nextId,
      message: "default to use United States account PK",
    },
  ]);

  const handleAddressUpdate = (newAddress) => {
    if (countryInEurope(newAddress.country)) {
      if (publicKey !== process.env.NEXT_PUBLIC_EU_STRIPE_PK) {
        setPublicKey(process.env.NEXT_PUBLIC_EU_STRIPE_PK);
        stripe._apiKey = process.env.NEXT_PUBLIC_EU_STRIPE_PK;

        nextId = nextId + 1;
        setMessages([
          ...messages,
          {
            id: nextId,
            message: "change to use Europe account PK",
          },
        ]);
      }
    } else {
      if (publicKey !== process.env.NEXT_PUBLIC_US_STRIPE_PK) {
        setPublicKey(process.env.NEXT_PUBLIC_US_STRIPE_PK);
        stripe._apiKey = process.env.NEXT_PUBLIC_US_STRIPE_PK;

        nextId = nextId + 1;
        setMessages([
          ...messages,
          {
            id: nextId,
            message: "change to use United States account PK",
          },
        ]);
      }
      if (currency !== "usd") {
        setCurrency("usd");
      }
    }
  };

  const options = {
    mode: "payment",
    amount: 1099,
    currency: currency,
    appearance: { theme: "stripe" },
    public_key: publicKey,
  };

  if (paymentComplete) {
    return <PaymentComplete messages={messages} />;
  }

  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">
        <TestModeBadge />
        PE + Multiple Accounts
      </h1>
      <Elements options={options} stripe={stripe}>
        <CheckoutForm
          handleAddressUpdate={handleAddressUpdate}
          currency={currency}
          setCurrency={setCurrency}
          setPaymentComplete={setPaymentComplete}
        />
      </Elements>
      <div className="bg-slate-200 rounded-md my-5 p-5">
        {messages.map((m) => (
          <p key={`msg-${m.id}`} className="text-slate-600">
            {m.id}: {m.message}
          </p>
        ))}
      </div>
    </Layout>
  );
}
