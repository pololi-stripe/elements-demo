import Head from "next/head";
import Layout from "../../components/layout";
import Select from "../../components/select";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";

const countryOptions = ["USA", "Mexico"];

const usStripe = loadStripe(process.env.NEXT_PUBLIC_US_STRIPE_PK, {
  betas: ["elements_enable_deferred_intent_beta_1"],
});
const mxStripe = loadStripe(process.env.NEXT_PUBLIC_MX_STRIPE_PK, {
  betas: ["elements_enable_deferred_intent_beta_1"],
});

const Checkout = ({ country }) => {
  const stripe = country === "Mexico" ? mxStripe : usStripe;
  const options = {
    mode: "payment",
    amount: 1099,
    currency: country === "Mexico" ? "mxn" : "usd",
    appearance: { theme: "stripe" },
  };

  return (
    <div>
      <Elements options={options} stripe={stripe}>
        <form>
          <h2 className="text-xl mb-3 mt-3">Billing</h2>
          <AddressElement
            options={{
              mode: "billing",
              defaultValues: {
                address: { country: country === "Mexico" ? "MX" : "US" },
              },
              display: { name: "organization" },
            }}
          />
          <h2 className="text-xl mb-3 mt-3">Payment</h2>
          <PaymentElement />
        </form>
      </Elements>
    </div>
  );
};

export default function PaymentElementMultipleAccounts() {
  const [country, setCountry] = useState("USA");

  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">Payment Element + Multiple Accounts</h1>
      <div
        className="bg-orange-300 rounded-lg py-3 px-3 mb-4 text-base text-gray-800"
        role="alert"
      >
        TEST MODE
      </div>
      <h2 className="text-2xl mb-3">Country</h2>
      <Select
        selected={country}
        setSelect={setCountry}
        options={countryOptions}
      />
      <Checkout country={country} />
    </Layout>
  );
}
