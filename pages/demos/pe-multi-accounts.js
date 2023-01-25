import Head from "next/head";
import Layout from "../../components/layout";
import Select from "../../components/select";
import { useState } from "react";
import MxCheckout from "../../components/mx-checkout";
import UsCheckout from "../../components/us-checkout";

const countryOptions = ["USA", "Mexico"];

export default function PaymentElementMultipleAccounts() {
  const [country, setCountry] = useState("USA");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const markPaymentComplete = () => setPaymentComplete(true);

  if (paymentComplete) {
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
        <div
          className="p-4 my-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
          role="alert"
        >
          Payment Succeed!
        </div>
      </Layout>
    );
  }

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
      {country === "Mexico" ? (
        <MxCheckout markPaymentComplete={markPaymentComplete} />
      ) : (
        <UsCheckout markPaymentComplete={markPaymentComplete} />
      )}
    </Layout>
  );
}
