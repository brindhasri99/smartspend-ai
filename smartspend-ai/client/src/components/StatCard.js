import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";
import { cn } from "../utils/format";

export default function StatCard({ label, value, hint, icon: Icon, tone = "neutral", trend }) {
  const positive = Number(trend || 0) >= 0;

  return (
    <div className="panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              tone === "income" && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
              tone === "expense" && "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-300",
              tone === "savings" && "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
              tone === "neutral" && "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        {hint && <p className="text-sm text-slate-500">{hint}</p>}
        {trend !== undefined && (
          <span className={positive ? "badge" : "badge border-red-100 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"}>
            {positive ? <FiArrowUpRight /> : <FiArrowDownRight />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}
