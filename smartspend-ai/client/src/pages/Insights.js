import { useEffect, useState } from "react";
import { FiAlertCircle, FiCpu, FiTarget, FiTrendingUp } from "react-icons/fi";
import api from "../api/httpClient";

const icons = [FiCpu, FiTarget, FiTrendingUp, FiAlertCircle];

export default function Insights() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/ai/insights").then(({ data }) => {
      setInsights(data.insights || []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="badge mb-3 border-cyan-300/30 text-cyan-200">Advisor</p>
        <h2 className="text-3xl font-semibold tracking-tight text-white light:text-slate-950">AI Insights</h2>
        <p className="mt-2 text-sm text-slate-400">Pattern detection, overspending alerts, and budget suggestions from your transaction history.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading && [0, 1, 2, 3].map((item) => <div key={item} className="skeleton h-36" />)}
        {!loading && insights.map((text, index) => {
          const Icon = icons[index % icons.length];
          return (
            <div key={text} className="panel">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
                <Icon />
              </div>
              <p className="text-sm font-semibold text-cyan-200">Insight {index + 1}</p>
              <p className="mt-2 text-slate-300 light:text-slate-600">{text}</p>
            </div>
          );
        })}
        {!loading && insights.length === 0 && (
          <div className="panel md:col-span-2">
            <p className="font-semibold text-white light:text-slate-950">No insights yet</p>
            <p className="mt-2 text-sm text-slate-500">Add transactions to activate your AI finance advisor.</p>
          </div>
        )}
      </div>
    </div>
  );
}
