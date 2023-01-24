import styles from "./select.module.css";

export default function Select({ selected, setSelect, options }) {
  return (
    <select
      className={styles.select}
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
