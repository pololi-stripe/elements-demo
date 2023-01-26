import Head from "next/head";
import { useState } from "react";
import Layout from "../../components/layout";
import TestModeBadge from "../../components/test-mode-badge";
import CheckoutForm, { countryInEurope } from "../../components/checkout-form";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const PaymentComplete = () => {
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
    </Layout>
  );
};

const useEuAccount = (currency) => currency === "EUR";

const usStripe = loadStripe(process.env.NEXT_PUBLIC_US_STRIPE_PK, {
  betas: ["elements_enable_deferred_intent_beta_1"],
});

const euStripe = loadStripe(process.env.NEXT_PUBLIC_EU_STRIPE_PK, {
  betas: ["elements_enable_deferred_intent_beta_1"],
});

export default function PaymentElementMultipleAccounts() {
  const [paymentComplete, setPaymentComplete] = useState(false);

  if (paymentComplete) {
    return <PaymentComplete />;
  }

  const [currency, setCurrency] = useState("usd");
  const [address, setAddress] = useState({});
  const options = {
    mode: "payment",
    amount: 1099,
    currency: currency,
    appearance: { theme: "stripe" },
  };

  const handleAddressUpdate = (newAddress) => {
    setAddress(newAddress);
    if (!countryInEurope(newAddress.country)) {
      setCurrency("usd");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">
        <TestModeBadge />
        PE + Multiple Accounts
      </h1>
      {useEuAccount(currency) ? (
        <Elements options={options} stripe={euStripe}>
          <CheckoutForm
            address={address}
            handleAddressUpdate={handleAddressUpdate}
            currency={currency}
            setCurrency={setCurrency}
            setPaymentComplete={setPaymentComplete}
          />
        </Elements>
      ) : (
        <Elements options={options} stripe={usStripe}>
          <CheckoutForm
            address={address}
            handleAddressUpdate={handleAddressUpdate}
            currency={currency}
            setCurrency={setCurrency}
            setPaymentComplete={setPaymentComplete}
          />
        </Elements>
      )}
    </Layout>
  );
}
