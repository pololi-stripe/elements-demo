import Head from "next/head";
import { useState } from "react";
import Layout from "../../components/layout";
import TestModeBadge from "../../components/test-mode-badge";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import LinkForm from "../../components/link-form";

const stripe = loadStripe(process.env.NEXT_PUBLIC_US_STRIPE_PK, {
  betas: ["enable_stripe_update_api_key_beta_0"],
});

export default function LinkDemo() {
  const [currency, setCurrency] = useState("usd");
  const [messages, setMessages] = useState([
    {
      message: "default to use United States account PK",
    },
  ]);

  const addNewMessage = (newMessage) => {
    setMessages([...messages, { message: newMessage }]);
  };

  const options = {
    mode: "payment",
    amount: 1099,
    currency: currency,
    appearance: { theme: "stripe" },
  };

  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">
        <TestModeBadge />
        Link Demo + Multi Accounts
      </h1>
      <Elements options={options} stripe={stripe}>
        <LinkForm
          currency={currency}
          setCurrency={setCurrency}
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
