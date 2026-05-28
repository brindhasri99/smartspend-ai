const moneyPattern = /(?:rs\.?|inr|₹)?\s?(\d{2,6}(?:\.\d{1,2})?)/gi;
const datePattern = /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/;

export const readReceiptFields = (text) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const amounts = [];
  let match;
  while ((match = moneyPattern.exec(text))) {
    amounts.push(Number(match[1]));
  }

  const merchant = lines.find((line) => !/\d{2,6}(?:\.\d{1,2})?/.test(line) && line.length > 2) || "Receipt";
  const total = amounts.length ? Math.max(...amounts) : "";
  const dateMatch = text.match(datePattern);

  return {
    title: merchant,
    merchant,
    amount: total,
    date: dateMatch ? dateMatch[1] : new Date().toISOString().slice(0, 10),
    category: "Food",
    type: "expense",
    source: "receipt"
  };
};
