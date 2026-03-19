export default function StatsRow({ expenses }) {

  // total money spent
  const total = expenses.reduce((t, e) => t + e.amount, 0);

  // calculate category totals
  const categoryTotals = {};
  expenses.forEach(e => {
    if (categoryTotals[e.category]) {
  categoryTotals[e.category] = categoryTotals[e.category] + e.amount;
} else {
  categoryTotals[e.category] = e.amount;
}
  });

  // find highest spending category
  let topCategory = "—";
  let max = 0;

  for (let cat in categoryTotals) {
    if (categoryTotals[cat] > max) {
      max = categoryTotals[cat];
      topCategory = cat;
    }
  }

  const format = n => "₹" + n.toLocaleString("en-IN");

  return (
    <div className="stats-row">

      <div className="stat-card primary">
        <div>Total Spent</div>
        <br />
        <div>{format(total)}</div>
      </div>

      <div className="stat-card">
        <div>Transactions</div>
        <br />
        <div>{expenses.length}</div>
      </div>

      <div className="stat-card">
        <div>Top Category</div>
        <br />
        <div>{topCategory}</div>
      </div>

    </div>
  );
}
