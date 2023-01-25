import Head from "next/head";
import Layout from "../../components/layout";
import Select from "../../components/select";
import { Elements, AddressElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const countryOptions = ["USA", "Mexico"];

export default function AddressAlone() {
  const [country, setCountry] = useState("USA");
  const stripe = loadStripe(process.env.NEXT_PUBLIC_MX_STRIPE_PK, {
    betas: ["elements_enable_deferred_intent_beta_1"],
  });

  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">Address</h1>
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
      {/* <AddressElement options={{ mode: "billing" }} /> */}

      <Elements stripe={stripe}>
        <AddressElement options={{ mode: "billing" }} />
      </Elements>
    </Layout>
  );
}
