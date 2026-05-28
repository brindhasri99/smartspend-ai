import { useState } from "react";
import { createWorker } from "tesseract.js";
import api from "../api/httpClient";
import ExpenseForm from "../components/ExpenseForm";
import { readReceiptFields } from "../utils/receiptParser";

export default function ReceiptScanner() {
  const [preview, setPreview] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const scanReceipt = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);
    setSaved(false);

    const worker = await createWorker("eng");
    const result = await worker.recognize(file);
    await worker.terminate();

    setExtractedText(result.data.text);
    setFormData(readReceiptFields(result.data.text));
    setLoading(false);
  };

  const saveReceipt = async (form) => {
    await api.post("/expenses", { ...form, source: "receipt" });
    setSaved(true);
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold">Receipt Scanner</h2>
          <p className="text-sm text-slate-500">OCR runs in the browser using Tesseract.js.</p>
        </div>

        <div className="glass-card p-5">
          <input className="form-input" type="file" accept="image/*" onChange={scanReceipt} />
          {loading && <p className="mt-3 text-sm text-slate-500">Scanning receipt...</p>}
          {preview && (
            <img
              src={preview}
              alt="Receipt preview"
              className="mt-4 max-h-80 rounded-lg border border-slate-200 object-contain dark:border-slate-800"
            />
          )}
        </div>

        <div className="glass-card p-5">
          <h3 className="mb-2 font-semibold">Extracted Text</h3>
          <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            {extractedText || "Upload a receipt image to see OCR output."}
          </pre>
        </div>
      </div>

      <div>
        <ExpenseForm initialData={formData} onSubmit={saveReceipt} />
        {saved && (
          <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            Receipt transaction saved.
          </p>
        )}
      </div>
    </div>
  );
}
