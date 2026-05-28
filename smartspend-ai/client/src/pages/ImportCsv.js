import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import api from "../api/httpClient";
import { useToast } from "../context/ToastContext";
import { parseBankCsv } from "../utils/csvParser";
import { money } from "../utils/format";

export default function ImportCsv() {
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const { notify } = useToast();

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const text = await file.text();
    setRows(parseBankCsv(text));
    setMessage("");
  };

  const uploadRows = async () => {
    const { data } = await api.post("/expenses/import", { transactions: rows });
    setMessage(`${data.count} transactions imported`);
    notify(`${data.count} transactions imported`);
    setRows([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="badge mb-3 border-cyan-300/30 text-cyan-200">Bulk import</p>
        <h2 className="text-3xl font-semibold tracking-tight text-white light:text-slate-950">CSV Import</h2>
        <p className="mt-2 text-sm text-slate-400">Upload a bank statement CSV and review parsed rows before saving to MongoDB.</p>
      </div>

      <div className="panel">
        <div className="mb-4 flex items-center gap-3">
          <FiUploadCloud className="h-5 w-5 text-cyan-300" />
          <h3 className="font-semibold text-white light:text-slate-950">Statement file</h3>
        </div>
        <input className="form-input" type="file" accept=".csv" onChange={handleFile} />
        {rows.length > 0 && (
          <button className="btn-primary mt-4" onClick={uploadRows}>
            Import {rows.length} Transactions
          </button>
        )}
        {message && <p className="mt-3 text-sm text-emerald-600">{message}</p>}
      </div>

      <div className="panel">
        <h3 className="mb-3 font-semibold text-white light:text-slate-950">Preview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-2">Date</th>
                <th>Title</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((row, index) => (
                <tr
                  key={`${row.title}-${index}`}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                >
                  <td className="py-2">{row.date}</td>
                  <td className="font-medium">{row.title}</td>
                  <td>{row.type}</td>
                  <td className="text-right">{money(row.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="py-4 text-sm text-slate-500">No CSV selected.</p>}
        </div>
      </div>
    </div>
  );
}
