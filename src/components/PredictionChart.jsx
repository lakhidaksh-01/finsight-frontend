import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";

export default function PredictionChart({ expenses }) {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="empty3">
        <div className="empty3-text">No expenses yet</div>
        <div className="empty3-subtext">
          Add your first expense to see spending breakdown by category
        </div>
      </div>
    );
  }

  let cumulative = 0;

  const data = expenses.map((e, i) => {
    cumulative += e.amount;
    return {
      day: i + 1,
      actual: cumulative
    };
  });

  return (
    <div className="panel">
      <h3 className="panel-title">Spending Trend 📈</h3>

      <LineChart width={400} height={150} data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="actual" />
      </LineChart>
    </div>
  );
}