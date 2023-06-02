import Head from "next/head";
import { useState, useEffect } from "react";
import Layout from "../../components/layout";
import TestModeBadge from "../../components/test-mode-badge";
import { loadStripe } from "@stripe/stripe-js";

const stripe = await loadStripe(process.env.NEXT_PUBLIC_US_STRIPE_PK);

export default function PaymentRequestApiDemo() {
  const [paymentRequest, setPaymentRequest] = useState(null);
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Demo total",
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        console.log("result", result);
        if (result) {
          setPaymentRequest(pr);
        }
      });

      pr.on("paymentmethod", async (ev) => {
        const response = await fetch("/api/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currency: "usd" }),
        }).then((res) => res.json());
        if (response.error) {
          console.log("error", response.error);
          return;
        }
        // Confirm the PaymentIntent without handling potential next actions (yet).
        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(
            response.client_secret,
            { payment_method: ev.paymentMethod.id },
            { handleActions: false }
          );

        if (confirmError) {
          // Report to the browser that the payment failed, prompting it to
          // re-show the payment interface, or show an error message and close
          // the payment interface.
          ev.complete("fail");
        } else {
          // Report to the browser that the confirmation was successful, prompting
          // it to close the browser payment method collection interface.
          ev.complete("success");
          // Check if the PaymentIntent requires any actions and if so let Stripe.js
          // handle the flow. If using an API version older than "2019-02-11"
          // instead check for: `paymentIntent.status === "requires_source_action"`.
          if (paymentIntent.status === "requires_action") {
            // Let Stripe.js handle the rest of the payment flow.
            const { error } = await stripe.confirmCardPayment(clientSecret);
            if (error) {
              // The payment failed -- ask your customer for a new payment method.
            } else {
              // The payment has succeeded.
            }
          } else {
            // The payment has succeeded.
          }
        }
      });
    }
  }, [stripe]);

  const handleClick = () => {
    if (paymentRequest) {
      paymentRequest.show();
    } else {
      console.log("no payment request");
    }
  };

  return (
    <Layout>
      <Head>
        <title>Demo</title>
      </Head>
      <h1 className="text-3xl mb-6">
        <TestModeBadge />
        Payment Request API Demo
      </h1>
      <button
        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 my-5"
        onClick={handleClick}
      >
        Pay Now
      </button>
    </Layout>
  );
}
