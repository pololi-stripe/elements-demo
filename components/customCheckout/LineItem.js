export default function LineItem(props) {
  const { amount, currency, name, description, className } = props;

  return (
    <div className={className}>
      <div className="flex flex-row space-x-5">
        <div className="w-20">
          {currency} {amount}
        </div>
        <div className="max-w-xs">
          <div>{name}</div>
          <div className="text-xs text-gray-600">{description}</div>
        </div>
      </div>
    </div>
  );
}
