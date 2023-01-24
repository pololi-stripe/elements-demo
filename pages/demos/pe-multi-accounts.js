import Head from "next/head";
import Layout from "../../components/layout";
import Select from "../../components/select";
import { useState } from "react";

const countryOptions = ["USA", "Mexico"];

export default function PaymentElementMultipleAccounts() {
  const [country, setCountry] = useState("");

  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">Payment Element + Multiple Accounts</h1>
      <h2 className="text-2xl mb-3">Country</h2>
      <Select
        selected={country}
        setSelect={setCountry}
        options={countryOptions}
      />
    </Layout>
  );
}
