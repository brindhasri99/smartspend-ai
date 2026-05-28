import { useEffect, useState } from "react";
import { FiCreditCard, FiDollarSign, FiInfo, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import api from "../api/httpClient";
import AiEntryBox from "../components/AiEntryBox";
import { CategoryPie, MonthlyChart, SavingsTrendChart, WeeklySpendingChart } from "../components/Charts";
import StatCard from "../components/StatCard";
import { money } from "../utils/format";

const initialSummary = { byCategory: [], monthly: [], weekly: [], recent: [], insights: [], alerts: [] };

const SkeletonDashboard = () => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="panel">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton mt-5 h-8 w-32" />
          <div className="skeleton mt-4 h-4 w-40" />
        </div>
      ))}
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="skeleton h-80" />
      <div className="skeleton h-80" />
    </div>
  </div>
);

export default function Dashboard() {
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(true);

  const loadSummary = async () => {
    const { data } = await api.get("/expenses/summary");
    setSummary({ ...initialSummary, ...data });
    setLoading(false);
  };

  useEffect(() => {
    loadSummary();
  }, []);

  if (loading) return <SkeletonDashboard />;

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="badge mb-3">Monthly overview</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">
            Dashboard
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            A simple view of your income, expenses, savings, and recent transactions.
          </p>
        </div>
        <div className="glass-card px-4 py-3">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Budget used</p>
          <div className="mt-2 h-2 w-52 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(summary.budgetUsed || 0, 100)}%` }} />
          </div>
        </div>
      </section>

      {summary.alerts?.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {summary.alerts[0]}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Balance" value={money(summary.balance)} hint="Income minus expenses" icon={FiCreditCard} tone="neutral" />
        <StatCard label="Total Income" value={money(summary.income)} hint="This month" icon={FiTrendingUp} tone="income" trend={8} />
        <StatCard label="Total Expenses" value={money(summary.spending)} hint="This month" icon={FiTrendingDown} tone="expense" trend={summary.trendDelta || 0} />
        <StatCard label="Monthly Savings" value={money(summary.savings)} hint={`${summary.transactionCount || 0} transactions`} icon={FiDollarSign} tone="savings" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <AiEntryBox onCreated={loadSummary} />
        <div className="panel">
          <div className="mb-4 flex items-center gap-3">
            <FiInfo className="text-emerald-600" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Helpful notes</h3>
          </div>
          <div className="space-y-3">
            {(summary.insights || []).map((text) => (
              <p key={text} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <MonthlyChart data={summary.monthly || []} />
        <CategoryPie data={summary.byCategory || []} />
        <WeeklySpendingChart data={summary.weekly || []} />
        <SavingsTrendChart data={summary.monthly || []} />
      </div>

      <div className="panel">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Activity</p>
            <h3 className="mt-1 font-semibold text-slate-900 dark:text-slate-100">Recent transactions</h3>
          </div>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {(summary.recent || []).map((item) => (
            <div key={item._id} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
                <p className="text-xs text-slate-500">
                  {item.category} / {new Date(item.date).toLocaleDateString()}
                </p>
              </div>
              <p className={item.type === "income" ? "font-semibold text-emerald-600" : "font-semibold text-red-600"}>
                {item.type === "income" ? "+" : "-"}{money(item.amount)}
              </p>
            </div>
          ))}
          {summary.recent?.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No transactions yet. Add one manually or with AI.</p>
          )}
        </div>
      </div>
    </div>
  );
}
