import { useState } from 'react';

export default function NewExpenseForm({ onAdd }) {
  const [title,setTitle] = useState('');
  const [amount,setAmount] = useState('');
  const [category,setCategory] = useState('');

  const handleAdd = () => {
    if (!title || !amount || !category) return;
    onAdd({ title, amount: Number(amount), category });
    setTitle(''); setAmount(''); setCategory('');
  }

  return (
    <div className="panel">
      <div className="panel-title">New Expense</div>
      <div className="field">
        <label>Title</label>
        <input placeholder="Lunch" value={title} onChange={e=>setTitle(e.target.value)}/>
      </div>
      <div className="field">
        <label>Amount (₹)</label>
        <input type="number" placeholder="0" value={amount} onChange={e=>setAmount(e.target.value)}/>
      </div>
      <div className="field">
        <label>Category</label>
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">Select category</option>
          <option>🍔 Food</option>
          <option>🚗 Transport</option>
          <option>🛍️ Shopping</option>
          <option>💊 Health</option>
          <option>🎬 Entertainment</option>
          <option>💡 Utilities</option>
          <option>📦 Other</option>
        </select>
      </div>
      <button className="add-btn" onClick={handleAdd}>+ Add Expense</button>
    </div>
  )
}
