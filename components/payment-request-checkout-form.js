import { useState, useEffect } from "react";
import {
  useStripe,
  PaymentRequestButtonElement,
} from "@stripe/react-stripe-js";
import CurrencySelect from "./currency-select";

export default function PaymentRequestCheckoutForm({
  currency,
  setCurrency,
  addNewMessage,
}) {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: currency,
        total: {
          label: "Demo total",
          amount: 1099,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  useEffect(() => {
    if (paymentRequest) {
      paymentRequest.off("paymentmethod");
      const data = { currency };
      paymentRequest.on("paymentmethod", async (ev) => {
        const response = await fetch("/api/create-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }).then((res) => res.json());
        if (response.error) {
          addNewMessage({ message: "Fail to create PaymentIntent" });
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
          ev.complete("fail");
        } else {
          ev.complete("success");
          if (paymentIntent.status === "requires_action") {
            const { error } = await stripe.confirmCardPayment(clientSecret);
            if (error) {
              addNewMessage({ message: "Fail to handle next_action" });
            } else {
              addNewMessage({
                message: "Payment succeeded after handling next_action",
              });
            }
          } else {
            addNewMessage({
              message: "Payment succeeded without handling next_action",
            });
          }
        }
      });
    }
  }, [paymentRequest, currency]);

  const onCurrencyChange = (newCurrency) => {
    if (newCurrency === currency) {
      return;
    }

    if (paymentRequest) {
      paymentRequest.update({ currency: newCurrency });
    }

    if (newCurrency === "eur") {
      stripe.update(process.env.NEXT_PUBLIC_EU_STRIPE_PK);
      addNewMessage({
        message: "call stripe.update() to use Europe account PK",
      });
    } else {
      stripe.update(process.env.NEXT_PUBLIC_US_STRIPE_PK);
      addNewMessage({
        message: "call stripe.update() to use United States account PK",
      });
    }

    paymentRequest.update({ currency: newCurrency });
    setCurrency(newCurrency);
  };

  if (paymentRequest) {
    return (
      <div className="checkout-page">
        <CurrencySelect currency={currency} setCurrency={onCurrencyChange} />
        <PaymentRequestButtonElement options={{ paymentRequest }} />
      </div>
    );
  }

  return <p>paymentRequest is NULL. So unable to render the button</p>;
}
