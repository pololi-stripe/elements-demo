import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkout-form";

export default function MxCheckout({ markPaymentComplete }) {
  const stripe = loadStripe(process.env.NEXT_PUBLIC_MX_STRIPE_PK, {
    betas: ["elements_enable_deferred_intent_beta_1"],
  });

  const options = {
    mode: "payment",
    amount: 1099,
    currency: "mxn",
    appearance: { theme: "stripe" },
  };

  return (
    <div>
      <Elements options={options} stripe={stripe}>
        <CheckoutForm country="MX" markPaymentComplete={markPaymentComplete} />
      </Elements>
    </div>
  );
}
