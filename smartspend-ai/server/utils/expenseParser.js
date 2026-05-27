const { GoogleGenerativeAI } = require("@google/generative-ai");

const categoryWords = {
  Food: ["food", "lunch", "dinner", "breakfast", "restaurant", "zomato", "swiggy", "groceries", "grocery"],
  Travel: ["uber", "ola", "ride", "metro", "bus", "train", "petrol", "fuel", "cab"],
  Shopping: ["amazon", "flipkart", "shopping", "clothes", "shoes", "mall"],
  Bills: ["electricity", "wifi", "internet", "mobile", "rent", "bill", "recharge"],
  Health: ["doctor", "medicine", "medical", "pharmacy", "hospital"],
  Salary: ["salary", "credited", "stipend", "freelance", "income"]
};

const guessCategory = (text = "") => {
  const lower = text.toLowerCase();
  for (const [category, words] of Object.entries(categoryWords)) {
    if (words.some((word) => lower.includes(word))) return category;
  }
  return "Other";
};

const localParse = (text) => {
  const amountMatch = text.match(/(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d{1,2})?)/i);
  const amount = amountMatch ? Number(amountMatch[1]) : 0;
  const lower = text.toLowerCase();
  const type = ["salary", "credited", "received", "income", "stipend"].some((word) => lower.includes(word))
    ? "income"
    : "expense";
  const category = guessCategory(text);
  const merchantWords = text
    .replace(amountMatch ? amountMatch[0] : "", "")
    .replace(/spent|paid|on|for|cost|credited|received|salary|rs|inr|₹/gi, "")
    .trim();

  return {
    title: merchantWords || (type === "income" ? "Income" : "Expense"),
    merchant: merchantWords || "",
    amount,
    type,
    category,
    date: new Date()
  };
};

const parseTextExpense = async (text) => {
  if (!process.env.GEMINI_API_KEY) {
    return localParse(text);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
Convert this expense sentence into JSON only.
Fields: title, merchant, amount, type(income or expense), category, date.
Sentence: "${text}"
Use today's date if date is missing.
`;
    const result = await model.generateContent(prompt);
    const raw = result.response.text().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(raw);
    return {
      ...localParse(text),
      ...parsed,
      amount: Number(parsed.amount || localParse(text).amount)
    };
  } catch (error) {
    return localParse(text);
  }
};

const makeInsights = (expenses) => {
  const now = new Date();
  const thisMonth = expenses.filter((item) => {
    const date = new Date(item.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const lastMonth = expenses.filter((item) => {
    const date = new Date(item.date);
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return date.getMonth() === last.getMonth() && date.getFullYear() === last.getFullYear();
  });

  const categoryTotals = {};
  thisMonth
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  const thisTotal = thisMonth.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);
  const lastTotal = lastMonth.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0);

  const insights = [];
  if (topCategory) {
    insights.push(`You spent the most on ${topCategory[0]} this month.`);
    if (["Food", "Shopping"].includes(topCategory[0])) {
      insights.push(`Reducing ${topCategory[0].toLowerCase()} expenses may help save money.`);
    }
  }
  if (lastTotal > 0) {
    const difference = Math.round(thisTotal - lastTotal);
    insights.push(
      difference > 0
        ? `Your spending is up by ₹${difference} compared to last month.`
        : `Your spending is lower than last month by ₹${Math.abs(difference)}.`
    );
  }
  if (thisTotal === 0) insights.push("Add a few transactions to get better spending insights.");

  return insights;
};

module.exports = { guessCategory, parseTextExpense, makeInsights };
