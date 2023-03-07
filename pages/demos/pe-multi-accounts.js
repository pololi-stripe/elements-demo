import Head from "next/head";
import { useState } from "react";
import Layout from "../../components/layout";
import TestModeBadge from "../../components/test-mode-badge";
import CheckoutForm from "../../components/checkout-form";
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
        {messages.map((value, index) => (
          <p key={`msg-${index}`} className="text-slate-600">
            {index}: {value.message}
          </p>
        ))}
      </div>
    </Layout>
  );
};

const stripe = loadStripe(process.env.NEXT_PUBLIC_US_STRIPE_PK, {
  betas: [
    "elements_enable_deferred_intent_beta_1",
    "enable_stripe_update_api_key_beta_0",
  ],
});

export default function PaymentElementMultipleAccounts() {
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [messages, setMessages] = useState([
    {
      message: "default to use United States account PK",
    },
  ]);

  const addNewMessage = (newMessage) => {
    setMessages([...messages, newMessage]);
  };

  const options = {
    mode: "payment",
    amount: 1099,
    currency: currency,
    appearance: { theme: "stripe" },
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
          currency={currency}
          setCurrency={setCurrency}
          setPaymentComplete={setPaymentComplete}
          addNewMessage={addNewMessage}
        />
      </Elements>
      <div className="bg-slate-200 rounded-md my-5 p-5">
        {messages.map((value, index) => (
          <p key={`msg-${index}`} className="text-slate-600">
            {index}: {value.message}
          </p>
        ))}
      </div>
    </Layout>
  );
}
