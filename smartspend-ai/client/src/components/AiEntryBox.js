import { useState } from "react";
import { FiEdit3, FiSend } from "react-icons/fi";
import api from "../api/httpClient";
import { useToast } from "../context/ToastContext";

export default function AiEntryBox({ onCreated }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  const submit = async (event) => {
    event.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/ai/create", { text });
      onCreated(data);
      setText("");
      notify("Transaction saved");
    } catch (error) {
      notify(error.response?.data?.message || "AI entry failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="panel">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
          <FiEdit3 />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Quick add</h3>
          <p className="text-sm text-slate-500">Example: "Paid 850 for Uber yesterday"</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="form-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a transaction quickly"
        />
        <button className="btn-primary whitespace-nowrap" disabled={loading}>
          <FiSend />
          {loading ? "Analyzing" : "Add"}
        </button>
      </div>
    </form>
  );
}
