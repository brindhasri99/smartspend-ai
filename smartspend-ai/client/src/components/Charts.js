import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { money } from "../utils/format";

const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#64748b", "#f97316"];

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  color: "#0f172a"
};

export function ChartShell({ title, eyebrow, children }) {
  return (
    <div className="panel">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{eyebrow}</p>
          <h3 className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
      </div>
      <div className="h-72">{children}</div>
    </div>
  );
}

export function CategoryPie({ data }) {
  return (
    <ChartShell title="Category Split" eyebrow="Where money went">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={94} paddingAngle={3}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => money(value)} contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function MonthlyChart({ data }) {
  return (
    <ChartShell title="Income vs Expense" eyebrow="Monthly view">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="income" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.32} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="expense" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="#fb7185" stopOpacity={0.36} />
              <stop offset="95%" stopColor="#fb7185" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => money(value)} contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#income)" strokeWidth={2.5} />
          <Area type="monotone" dataKey="expense" stroke="#fb7185" fill="url(#expense)" strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function WeeklySpendingChart({ data }) {
  return (
    <ChartShell title="Weekly Spending" eyebrow="Last 7 days">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => money(value)} contentStyle={tooltipStyle} />
          <Bar dataKey="expense" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}

export function SavingsTrendChart({ data }) {
  return (
    <ChartShell title="Savings Trend" eyebrow="Month by month">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(148, 163, 184, 0.14)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => money(value)} contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartShell>
  );
}
