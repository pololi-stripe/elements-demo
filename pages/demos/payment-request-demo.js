import Head from "next/head";
import { useState } from "react";
import Layout from "../../components/layout";
import TestModeBadge from "../../components/test-mode-badge";
import PaymentRequestCheckoutForm from "../../components/payment-request-checkout-form";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripe = loadStripe(process.env.NEXT_PUBLIC_US_STRIPE_PK, {
  betas: [
    "enable_stripe_update_api_key_beta_0",
    "payment_request_button_two_button_beta_1",
  ],
});

export default function PaymentRequestDemo() {
  const [messages, setMessages] = useState([
    {
      message: "default to use United States account PK",
    },
  ]);
  const [currency, setCurrency] = useState("usd");

  const addNewMessage = (newMessage) => {
    setMessages([...messages, newMessage]);
  };

  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">
        <TestModeBadge />
        Payment Request Button
      </h1>
      <Elements stripe={stripe}>
        <PaymentRequestCheckoutForm
          addNewMessage={addNewMessage}
          currency={currency}
          setCurrency={setCurrency}
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
