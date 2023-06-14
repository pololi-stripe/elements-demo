import Head from "next/head";
import { useState } from "react";
import Layout from "../../components/layout";
import TestModeBadge from "../../components/test-mode-badge";
import PendingAmountCheckoutForm from "../../components/pending-amount-checkout-form";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripe = loadStripe(process.env.NEXT_PUBLIC_US_STRIPE_PK, {
  betas: ["deferred_intent_pe_optional_amount_beta_0"],
});

const ELEMENTS_CONFIG = {
  option0: {
    mode: "payment",
    currency: "usd",
    appearance: { theme: "stripe" },
  },
  option1: {
    mode: "setup",
    currency: "usd",
    appearance: { theme: "stripe" },
  },
  option2: {
    mode: "payment",
    amount: 1099,
    currency: "usd",
    appearance: { theme: "stripe" },
    // payment_method_types: ["card", "affirm"],
  },
  option3: {
    mode: "payment",
    amount: null,
    currency: "usd",
    appearance: { theme: "stripe" },
  },
};

export default function PaymentElementPendingAmount() {
  const [option, setOption] = useState("option0");
  const elementOptions = ELEMENTS_CONFIG[option];

  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">
        <TestModeBadge />
        PE + Unknown Amount Upfront
      </h1>
      <div>
        <h2 className="text-xl mb-3 mt-3">Options for Payment Element</h2>
        <label>
          <input
            type="radio"
            value="option0"
            checked={option === "option0"}
            onChange={() => setOption(event.target.value)}
            className="mr-2 mb-1"
          />
          mode="payment", amount not set
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="option1"
            checked={option === "option1"}
            onChange={() => setOption(event.target.value)}
            className="mr-2 mb-1"
          />
          mode="setup", amount not set
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="option2"
            checked={option === "option2"}
            onChange={() => setOption(event.target.value)}
            className="mr-2 mb-1"
          />
          mode="payment", amount=1099
        </label>
        <br />
        <label>
          <input
            type="radio"
            value="option3"
            checked={option === "option3"}
            onChange={() => setOption(event.target.value)}
            className="mr-2 mb-1"
          />
          mode="payment", amount=null
        </label>
      </div>
      <Elements options={elementOptions} stripe={stripe}>
        <PendingAmountCheckoutForm elementsOptions={elementOptions} />
      </Elements>
    </Layout>
  );
}
