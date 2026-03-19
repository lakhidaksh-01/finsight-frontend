export default function ExpenseList({ expenses, onDelete, onClearAll }) {
  if (!expenses.length) return  (
    <div className="empty2">
      <div className="empty2-text">No expenses yet</div>
      <div className="empty2-subtext">Add your first expense to see spending breakdown by category</div>
    </div>
  );

  return (
    <div className="full-panel">
      <div className="list-head">
        <div className="panel-title">Recent Transactions</div>
        <div>
          <span>{expenses.length} entries</span>
          <button className="clear-btn" onClick={onClearAll}>
            Clear All
          </button>
        </div>
      </div>
      <div className="list-scroll">
        {expenses.map(e=>(
          <div key={e._id} className="expense-item">
            <div className="e-left">
              <div className="e-icon">{e.category[0]}</div>
              <div>
                <div className="e-title">{e.title}</div>
                <div className="e-cat">{e.category.replace(/^\S+\s/,'')}</div>
              </div>
            </div>
            <div className="e-right">
              <span className="e-amt">₹{e.amount}</span>
              <button className="del-btn" onClick={()=>onDelete(e._id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
