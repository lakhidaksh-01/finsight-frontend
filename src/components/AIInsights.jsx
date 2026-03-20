import { useEffect, useState } from "react";
import axios from "axios";

export default function AIInsights({ expenses, budget = 30000 }) {
  const [prediction, setPrediction] = useState(null);
  const [risk, setRisk] = useState("");
  const [topCategory, setTopCategory] = useState(null);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!expenses.length) return;

    setLoading(true);

    axios
      .post("https://finsight-backend-oa0q.onrender.com/api/predict", expenses)
      .then((res) => {
        const predicted = res.data.predicted_spending;

        const categoryMap = {};
        expenses.forEach((e) => {
          categoryMap[e.category] =
            (categoryMap[e.category] || 0) + e.amount;
        });

        const top = Object.entries(categoryMap).sort(
          (a, b) => b[1] - a[1]
        )[0];

        let riskLevel =
          predicted > budget
            ? "High"
            : predicted > budget * 0.8
            ? "Medium"
            : "Safe";

        const generateInsight = () => {
          if (predicted > budget) {
            return `I've analyzed your recent spending patterns. You're likely to spend around ₹${predicted} this month, which exceeds your budget of ₹${budget}. 

The main reason is your ${top?.[0]} expenses, which are significantly higher than other categories.

If this trend continues, you may overshoot your budget. I’d strongly suggest reducing spending in this area immediately.`;
          }

          if (predicted > budget * 0.8) {
            return `You're approaching your budget with a predicted spend of ₹${predicted}. 

Most of your money is going into ${top?.[0]}. A small adjustment here could help you stay within your ₹${budget} budget.

You're close — just need a little control.`;
          }

          return `Good news — your spending looks healthy. You're expected to spend around ₹${predicted}, which is well within your ₹${budget} budget.

Your top expense category is ${top?.[0]}, but it's still under control. Keep maintaining this balance.`;
        };

        setTimeout(() => {
          setPrediction(predicted);
          setRisk(riskLevel);
          setTopCategory(top);
          setInsight(generateInsight());
          setLoading(false);
        }, 1500);
      })
      .catch((err) => console.log(err));
  }, [expenses, budget]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f8fafc, #eef4ff)",
        color: "#1e293b",
        padding: "25px",
        borderRadius: "16px",
        marginTop: "20px",
        position: "relative",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow:
          "0 10px 25px rgba(0, 0, 0, 0.05), inset 0 0 10px rgba(59,130,246,0.05)",
      }}
    >
      

      <h2
        style={{
          fontSize: "20px",
          marginBottom: "15px",
          color: "#2563eb",
          letterSpacing: "0.5px",
          fontWeight: "600",
        }}
      >
        AI Financial Advisor 🤖
      </h2>

      {loading ? (
        <div
          style={{
            fontStyle: "italic",
            color: "#64748b",
            animation: "pulse 1.5s infinite",
          }}
        >
          <p>Analyzing your financial behavior...</p>
          <p>Detecting spending patterns...</p>
          <p>Generating smart insights...</p>
        </div>
      ) : (
        <>
          {/* 💬 AI MESSAGE */}
          <div
            style={{
              background: "#ffffff",
              padding: "15px",
              borderRadius: "12px",
              lineHeight: "1.6",
              borderLeft: "4px solid #3b82f6",
              whiteSpace: "pre-line",
              boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
            }}
          >
            <p>
              <strong style={{ color: "#2563eb" }}>AI:</strong> {insight}
            </p>
          </div>

          {/* 📊 EXTRA DATA */}
          <div
            style={{
              marginTop: "15px",
              fontSize: "14px",
              color: "#475569",
            }}
          >
            <p>
              • Predicted Spend: <b style={{ color: "#0f172a" }}>₹{prediction}</b>
            </p>
            <p>
              • Risk Level:{" "}
              <b
                style={{
                  color:
                    risk === "High"
                      ? "#dc2626"
                      : risk === "Medium"
                      ? "#f59e0b"
                      : "#16a34a",
                }}
              >
                {risk}
              </b>
            </p>
            {topCategory && (
              <p>
                • Main Expense:{" "}
                <b style={{ color: "#0f172a" }}>{topCategory[0]}</b>
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}