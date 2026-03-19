import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function ChartPanel({ expenses }) {

  // store category totals
  const categoryTotals = {};

  // calculate total for each category
  expenses.forEach((item) => {
    if (!categoryTotals[item.category]) {
      categoryTotals[item.category] = 0;
    }
    categoryTotals[item.category] += item.amount;
  });

  // convert object to array for recharts
  const data = Object.keys(categoryTotals).map((cat) => ({
    category: cat,
    amount: categoryTotals[cat],
  }));

  // if no expenses
if (data.length === 0) {
  return (
    <div className="empty">
      <div className="empty-text">No expenses yet</div>
      <div className="empty-subtext">Add your first expense to see spending breakdown by category</div>
    </div>
  );
}

  return (
    <div className="panel">
      <div className="panel-title">Spending by Category</div>

      <BarChart width={400} height={150} data={data}>
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="amount" fill="#5b4fcf" />
      </BarChart>

    </div>
  );
}
