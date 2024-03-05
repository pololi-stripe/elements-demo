import React from "react";

import { AddressElement, PaymentElement } from "@stripe/react-stripe-js";
import CustomerDetails from "./customCheckout/CustomerDetails";
import OrderSummary from "./customCheckout/OrderSummary";
import PromotionCodes from "./customCheckout/PromotionCodes";
import PayButton from "./customCheckout/PayButton";

const CheckoutPage = ({ setPaymentComplete }) => {
  return (
    <div>
      {/* <ExpressCheckoutElement /> */}
      <h1 className="text-3xl font-bold text-gray-800 py-4">
        Customer details
      </h1>
      <CustomerDetails />
      <h1 className="text-3xl font-bold text-gray-800 py-4">Order summary</h1>
      <OrderSummary />
      <h1 className="text-3xl font-bold text-gray-800 py-4">Promotion codes</h1>
      <PromotionCodes />
      <h1 className="text-3xl font-bold text-gray-800 py-4">
        Shipping address
      </h1>
      <AddressElement options={{ mode: "shipping" }} />
      <h1 className="text-3xl font-bold text-gray-800 py-4">Billing address</h1>
      <AddressElement options={{ mode: "billing" }} />
      <h1 className="text-3xl font-bold text-gray-800 py-4">Payment Details</h1>
      <PaymentElement />
      <PayButton setPaymentComplete={setPaymentComplete} />
    </div>
  );
};

export default CheckoutPage;
