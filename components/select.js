import styles from "./select.module.css";

export default function Select({ selected, setSelect, options }) {
  return (
    <select
      className="w-1/2 px-4 py-3 rounded"
      value={selected}
      onChange={(e) => setSelect(e.target.value)}
    >
      <option value="" disabled hidden>
        Select...
      </option>
      {options.map((value) => (
        <option value={value} key={value}>
          {value}
        </option>
      ))}
    </select>
  );
}
