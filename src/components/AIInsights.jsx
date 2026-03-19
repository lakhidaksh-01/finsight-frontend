import { useEffect, useState } from "react";
import axios from "axios";

export default function AIInsights({ expenses, budget = 30000 }) {
  const [prediction, setPrediction] = useState(null);
  const [risk, setRisk] = useState("");
  const [topCategory, setTopCategory] = useState(null);
  const [warning, setWarning] = useState("");
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    if (!expenses.length) return;

    // -----------------------------
    // 1️⃣ CALL BACKEND (ML)
    // -----------------------------
    axios.post("https://finsight-backend-oa0q.onrender.com/api/predict", expenses)
      .then(res => {
        const predicted = res.data.predicted_spending;
        setPrediction(predicted);

        // -----------------------------
        // 2️⃣ BUDGET RISK
        // -----------------------------
        let riskLevel =
          predicted > budget
            ? "High Risk 🚨"
            : predicted > budget * 0.8
            ? "Medium Risk ⚠️"
            : "Safe ✅";

        setRisk(riskLevel);

        // -----------------------------
        // 3️⃣ TOP CATEGORY
        // -----------------------------
        const categoryMap = {};

        expenses.forEach(e => {
          categoryMap[e.category] =
            (categoryMap[e.category] || 0) + e.amount;
        });

        const top = Object.entries(categoryMap)
          .sort((a, b) => b[1] - a[1])[0];

        setTopCategory(top);

        // -----------------------------
        // 4️⃣ WARNING
        // -----------------------------
        let warn = "";

        if (predicted > budget) {
          warn = "You may exceed your budget this month 🚨";
        } else if (predicted > budget * 0.8) {
          warn = "You are close to your budget limit ⚠️";
        } else {
          warn = "Your spending is under control ✅";
        }

        setWarning(warn);

        // -----------------------------
        // 5️⃣ SUGGESTION
        // -----------------------------
        if (top) {
          setSuggestion(
            `Try reducing ${top[0]} expenses to save more 💡`
          );
        }
      })
      .catch(err => console.log(err));

  }, [expenses, budget]);

  const itemStyle = {
  marginBottom: "10px",
  lineHeight: "1.6",
  fontSize: "14px",
  color: "#cfd8ff"
};

const highlight = {
  color: "#00ffff",
  fontWeight: "600"
  
};
  return (
    <div style={{
  background: "linear-gradient(135deg, #0f0f0f, #1a1a2e)",
  color: "#e6f1ff",
  padding: "25px",
  borderRadius: "16px",
  marginTop: "20px",
  position: "relative",
  overflow: "hidden",
  border: "1px solid rgba(0,255,255,0.2)",
  boxShadow: "0 0 25px rgba(0,255,255,0.15), inset 0 0 20px rgba(0,255,255,0.05)"
}}>
  
  {/* glowing animated border */}
  <div style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(120deg, transparent, rgba(0,255,255,0.2), transparent)",
    animation: "scan 4s linear infinite"
  }}></div>

  <h2 style={{
    fontSize: "20px",
    marginBottom: "15px",
    color: "#00ffff",
    letterSpacing: "1px",
  }}>
    AI Insights 🤖
  </h2>

  {!prediction ? (
    <p style={{
      fontStyle: "italic",
      color: "#aaa",
      animation: "pulse 1.5s infinite"
    }}>
      Analyzing your data...
    </p>
  ) : (
    <>
      <p style={itemStyle}>• Predicted Monthly Spending: <span style={highlight}>₹{prediction}</span></p>
      <p style={itemStyle}>• Overspending Risk: <span style={highlight}>{risk}</span></p>

      {topCategory && (
        <p style={itemStyle}>
          • Top Category: <span style={highlight}>{topCategory[0]}</span> (₹{topCategory[1]})
        </p>
      )}

      <p style={itemStyle}>• {warning}</p>
      <p style={itemStyle}>• {suggestion}</p>
    </>
  )}
</div>
  );
}