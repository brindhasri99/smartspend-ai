import { useEffect, useMemo, useState } from "react";
import { FiDownload, FiEdit2, FiSearch, FiTrash2 } from "react-icons/fi";
import api from "../api/httpClient";
import ExpenseForm from "../components/ExpenseForm";
import { useToast } from "../context/ToastContext";
import { categories, money } from "../utils/format";

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filters, setFilters] = useState({ search: "", type: "all", category: "All" });
  const [loading, setLoading] = useState(true);
  const { notify } = useToast();

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.type !== "all") params.set("type", filters.type);
    if (filters.category !== "All") params.set("category", filters.category);
    return params.toString();
  }, [filters]);

  const loadItems = async () => {
    setLoading(true);
    const { data } = await api.get(`/expenses${query ? `?${query}` : ""}`);
    setItems(Array.isArray(data) ? data : data.items || []);
    setLoading(false);
  };

  useEffect(() => {
    loadItems();
  }, [query]);

  const saveExpense = async (form) => {
    if (editing) {
      await api.put(`/expenses/${editing._id}`, form);
      setEditing(null);
      notify("Transaction updated");
    } else {
      await api.post("/expenses", { ...form, source: "manual" });
      notify("Transaction added");
    }
    loadItems();
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    notify("Transaction deleted");
    loadItems();
  };

  const exportCsv = () => {
    const header = ["Date", "Title", "Merchant", "Category", "Type", "Amount"];
    const rows = items.map((item) => [
      new Date(item.date).toLocaleDateString(),
      item.title,
      item.merchant || "",
      item.category,
      item.type,
      item.amount
    ]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "smartspend-transactions.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <ExpenseForm initialData={editing} onSubmit={saveExpense} onCancel={() => setEditing(null)} />

      <div className="panel">
        <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">Ledger</p>
            <h2 className="mt-1 text-xl font-semibold text-white light:text-slate-950">Transactions</h2>
          </div>
          <button className="btn-light" onClick={exportCsv} disabled={!items.length}>
            <FiDownload />
            Export CSV
          </button>
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-[1fr_150px_170px]">
          <label className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <input
              className="form-input pl-9"
              placeholder="Search merchant, title, note"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </label>
          <select className="form-input" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="form-input" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option>All</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-md border border-white/10">
          <div className="hidden grid-cols-[1.2fr_1fr_120px_130px_96px] gap-3 border-b border-white/10 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.16em] text-slate-500 md:grid">
            <span>Transaction</span>
            <span>Category</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Actions</span>
          </div>

          {loading && <div className="p-4"><div className="skeleton h-20" /></div>}

          {!loading && items.map((item) => (
            <div key={item._id} className="grid gap-3 border-b border-white/10 px-4 py-4 last:border-0 md:grid-cols-[1.2fr_1fr_120px_130px_96px] md:items-center">
              <div className="min-w-0">
                <p className="truncate font-medium text-white light:text-slate-950">{item.title}</p>
                <p className="truncate text-xs text-slate-500">{item.merchant || "No merchant"} / {item.source}</p>
              </div>
              <div><span className="badge">{item.category}</span></div>
              <p className="text-sm text-slate-400">{new Date(item.date).toLocaleDateString()}</p>
              <p className={item.type === "income" ? "text-right font-semibold text-emerald-300" : "text-right font-semibold text-red-300"}>
                {item.type === "income" ? "+" : "-"}{money(item.amount)}
              </p>
              <div className="flex justify-end gap-2">
                <button className="btn-light px-2.5" onClick={() => setEditing(item)} aria-label="Edit transaction">
                  <FiEdit2 />
                </button>
                <button className="btn-light px-2.5" onClick={() => deleteExpense(item._id)} aria-label="Delete transaction">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}

          {!loading && items.length === 0 && (
            <div className="p-10 text-center">
              <p className="text-lg font-semibold text-white light:text-slate-950">No transactions found</p>
              <p className="mt-2 text-sm text-slate-500">Adjust your filters or add a transaction to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
