import { useEffect, useState } from "react";
import { FiCheck, FiX } from "react-icons/fi";
import { categories } from "../utils/format";

const emptyForm = {
  title: "",
  merchant: "",
  amount: "",
  type: "expense",
  category: "Food",
  date: new Date().toISOString().slice(0, 10),
  note: ""
};

export default function ExpenseForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initialData ? { ...emptyForm, ...initialData, date: initialData.date?.slice(0, 10) } : emptyForm);
  }, [initialData]);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      setForm(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="panel">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Capture</p>
        <h3 className="mt-1 font-semibold text-white light:text-slate-950">
          {initialData ? "Edit Transaction" : "Add Transaction"}
        </h3>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input className="form-input" name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input className="form-input" name="merchant" placeholder="Merchant" value={form.merchant} onChange={handleChange} />
        <input className="form-input" name="amount" min="0" step="0.01" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <select className="form-input" name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <select className="form-input" name="category" value={form.category} onChange={handleChange}>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
        <input className="form-input" name="date" type="date" value={form.date} onChange={handleChange} />
        <textarea className="form-input md:col-span-2" rows="3" name="note" placeholder="Note" value={form.note} onChange={handleChange} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn-primary" type="submit" disabled={saving}>
          <FiCheck />
          {saving ? "Saving" : initialData ? "Save Changes" : "Add Transaction"}
        </button>
        {onCancel && (
          <button className="btn-light" type="button" onClick={onCancel}>
            <FiX />
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
