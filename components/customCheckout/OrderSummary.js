import LineItem from "./LineItem";
import { useCustomCheckout } from "@stripe/react-stripe-js";

export default function OrderSummary() {
  const { currency, lineItems, taxAmounts, discountAmounts, total } =
    useCustomCheckout();

  return (
    <div className="space-y-4">
      {lineItems.map((li) => (
        <LineItem
          key={li.id}
          amount={li.amount}
          currency={currency}
          name={li.name}
          description={li.description}
          className="py-2 px-4 rounded-lg bg-gray-100"
        />
      ))}
      <div className="font-semibold text-lg py-2">Tax</div>
      {taxAmounts && taxAmounts.length > 0 ? (
        taxAmounts.map((tax) => (
          <LineItem
            amount={tax.amount}
            currency={currency}
            name={tax.displayName}
            className="py-2 px-4 rounded-lg bg-gray-100"
          />
        ))
      ) : (
        <div className="py-2 text-gray-500">No tax</div>
      )}
      <div className="font-semibold text-lg py-2">Discounts</div>
      {discountAmounts && discountAmounts.length > 0 ? (
        discountAmounts.map((discount) => (
          <LineItem
            amount={discount.amount}
            currency={currency}
            name={discount.displayName}
            className="py-2 px-4 rounded-lg bg-gray-100"
          />
        ))
      ) : (
        <div className="py-2 text-gray-500">No discounts</div>
      )}
      <div className="font-semibold text-lg py-2">Subtotal</div>
      <div className="py-2 px-4 rounded-md bg-gray-200">
        {currency} {total.subtotal}
      </div>
      <div className="font-semibold text-lg py-2">Total</div>
      <div className="py-2 px-4 rounded-md bg-gray-200">
        {currency} {total.total}
      </div>
    </div>
  );
}
