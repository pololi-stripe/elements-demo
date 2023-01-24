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
      <h1>Payment Element + Multiple Accounts</h1>
      <Select
        selected={country}
        setSelect={setCountry}
        options={countryOptions}
      />
    </Layout>
  );
}
