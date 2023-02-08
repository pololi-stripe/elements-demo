export default function CurrencySelect({ currency, setCurrency }) {
  return (
    <div className="my-4">
      <h3 className="mb-2">Currency</h3>
      <div className="flex items-center mb-2">
        <input
          checked={currency === "usd"}
          onChange={() => setCurrency("usd")}
          id="default-radio-1"
          type="radio"
          value="usd"
          name="default-radio"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          USD
        </label>
      </div>
      <div className="flex items-center">
        <input
          checked={currency === "eur"}
          onChange={() => setCurrency("eur")}
          id="default-radio-2"
          type="radio"
          value=""
          name="default-radio"
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
        />
        <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
          EUR
        </label>
      </div>
    </div>
  );
}
