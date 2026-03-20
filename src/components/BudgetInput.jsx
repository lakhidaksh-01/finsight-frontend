import { useEffect, useState } from "react";

export default function BudgetInput({ onBudgetChange }) {
  const [value, setValue] = useState("");

  // Load saved budget
  useEffect(() => {
    const saved = localStorage.getItem("budget");
    if (saved) {
      setValue(saved);
      onBudgetChange(Number(saved));
    }
  }, []);

  const handleSave = () => {
    if (!value) return;

    localStorage.setItem("budget", value);
    onBudgetChange(Number(value));
  };

  return (
    <div className="panel">
      <h3 className="panel-title">
        Set Monthly Budget (Optional)
      </h3>
      <div className="field">
      <input
        type="number"
        placeholder="Enter your budget"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={handleSave} className="add-btn">
        Save
      </button>
      </div>
    </div>
  );
}