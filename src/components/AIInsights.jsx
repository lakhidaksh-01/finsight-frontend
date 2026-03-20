import { useEffect, useState } from "react";
import axios from "axios";

export default function AIInsights({ expenses, budget }) {
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

        // 🔹 Find top category
        const categoryMap = {};
        expenses.forEach((e) => {
          categoryMap[e.category] =
            (categoryMap[e.category] || 0) + e.amount;
        });

        const top = Object.entries(categoryMap).sort(
          (a, b) => b[1] - a[1]
        )[0];

        const hasBudget = budget && budget > 0;

        let riskLevel = "Moderate";

        // 🔥 Risk only if budget exists
        if (hasBudget) {
          if (predicted > budget) riskLevel = "High";
          else if (predicted > budget * 0.8) riskLevel = "Medium";
          else riskLevel = "Safe";
        }

       const generateInsight = () => {
  // ✅ Budget Mode
  if (hasBudget) {
    const utilization = Math.round((predicted / budget) * 100);
    const overshoot = Math.max(predicted - budget, 0);

    if (predicted > budget) {
      return `Hey, I took a look at your recent spending — and it seems like you might go a bit over your budget this month.

You're on track to spend around ₹${predicted}, which is about ₹${overshoot} more than your set limit. That’s roughly ${utilization}% of your budget.

A big chunk of this is coming from ${top?.[0]}. If you cut back a little there, it could really help you stay on track.`;
    }

    if (utilization > 80) {
      return `You're getting pretty close to your budget this month.

Right now, you're expected to spend around ₹${predicted}, which is about ${utilization}% of your limit. Most of your spending is going into ${top?.[0]}.

Nothing alarming yet — just a small adjustment there and you should be good.`;
    }

    return `Nice! Your spending looks well under control.

You're likely to spend around ₹${predicted} this month, which is comfortably within your budget (${utilization}% used).

${top?.[0]} is your top expense, but it’s not causing any issues. Keep it going like this.`;
  }

  // ✅ No Budget Mode (more conversational)
  return `Hey, I analyzed your recent spending.

It looks like you might spend around ₹${predicted} this month. Most of your money is going into ${top?.[0]} right now.

That’s not necessarily a problem, but keeping an eye on that category could help you stay more balanced.`;
};

        setTimeout(() => {
          setPrediction(predicted);
          setRisk(hasBudget ? riskLevel : "—");
          setTopCategory(top);
          setInsight(generateInsight());
          setLoading(false);
        }, 1200);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [expenses, budget]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f8fafc, #eef4ff)",
        color: "#1e293b",
        padding: "25px",
        borderRadius: "16px",
        marginTop: "20px",
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
              • Predicted Spend:{" "}
              <b style={{ color: "#0f172a" }}>₹{prediction}</b>
            </p>

            {budget && (
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
            )}

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