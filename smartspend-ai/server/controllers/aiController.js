const Expense = require("../models/Expense");
const { parseTextExpense, makeInsights } = require("../utils/expenseParser");

exports.parseExpenseText = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Please enter a sentence" });
  }

  try {
    const parsed = await parseTextExpense(text);
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ message: "Could not parse text" });
  }
};

exports.createFromText = async (req, res) => {
  const { text } = req.body;

  try {
    const parsed = await parseTextExpense(text);
    const expense = await Expense.create({
      user: req.user._id,
      ...parsed,
      source: "ai"
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: "Could not create AI transaction" });
  }
};

exports.getInsights = async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
  res.json({ insights: makeInsights(expenses) });
};
