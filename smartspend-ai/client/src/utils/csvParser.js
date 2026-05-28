const splitCsvLine = (line) => {
  const values = [];
  let current = "";
  let insideQuotes = false;

  for (const char of line) {
    if (char === "\"") insideQuotes = !insideQuotes;
    else if (char === "," && !insideQuotes) {
      values.push(current.trim());
      current = "";
    } else current += char;
  }
  values.push(current.trim());
  return values;
};

const findColumn = (headers, names) => {
  return headers.findIndex((header) => names.some((name) => header.toLowerCase().includes(name)));
};

export const parseBankCsv = (text) => {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];

  const headers = splitCsvLine(lines[0]).map((header) => header.toLowerCase());
  const dateIndex = findColumn(headers, ["date", "txn"]);
  const descIndex = findColumn(headers, ["description", "details", "narration", "merchant"]);
  const amountIndex = findColumn(headers, ["amount", "debit", "credit", "withdrawal", "deposit"]);
  const debitIndex = findColumn(headers, ["debit", "withdrawal"]);
  const creditIndex = findColumn(headers, ["credit", "deposit"]);

  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const debit = debitIndex >= 0 ? Number(cols[debitIndex] || 0) : 0;
    const credit = creditIndex >= 0 ? Number(cols[creditIndex] || 0) : 0;
    const rawAmount = amountIndex >= 0 ? Number(cols[amountIndex]) : credit || -debit;
    const amount = credit || debit || Math.abs(rawAmount);

    return {
      date: cols[dateIndex] || new Date().toISOString(),
      title: cols[descIndex] || "Bank transaction",
      merchant: cols[descIndex] || "",
      amount,
      type: credit || rawAmount > 0 ? "income" : "expense"
    };
  });
};
