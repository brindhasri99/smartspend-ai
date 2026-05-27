const Expense = require("../models/Expense");
const { guessCategory } = require("../utils/expenseParser");

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
const dayKey = (date) => date.toISOString().slice(0, 10);

const monthLabel = (date) => date.toLocaleString("en-US", { month: "short" });

const buildExpenseQuery = (req) => {
  const { search, category, type, from, to } = req.query;
  const query = { user: req.user._id };

  if (type && ["income", "expense"].includes(type)) query.type = type;
  if (category && category !== "All") query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { merchant: { $regex: search, $options: "i" } },
      { note: { $regex: search, $options: "i" } }
    ];
  }
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  return query;
};

exports.getExpenses = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 100), 1), 200);
    const query = buildExpenseQuery(req);
    const [expenses, total] = await Promise.all([
      Expense.find(query).sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Expense.countDocuments(query)
    ]);

    res.json({ items: expenses, total, page, pages: Math.ceil(total / limit) || 1 });
  } catch (error) {
    next(error);
  }
};

exports.createExpense = async (req, res, next) => {
  try {
    const amount = Math.abs(Number(req.body.amount));
    if (!req.body.title || !amount) {
      return res.status(400).json({ message: "Title and amount are required" });
    }

    const data = {
      ...req.body,
      amount,
      user: req.user._id,
      category: req.body.category || guessCategory(req.body.title || req.body.merchant || "")
    };

    const expense = await Expense.create(data);
    res.status(201).json(expense);
  } catch (error) {
    next(error);
  }
};

exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const payload = { ...req.body };
    if (payload.amount !== undefined) payload.amount = Math.abs(Number(payload.amount));
    Object.assign(expense, payload);
    const updated = await expense.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!expense) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    next(error);
  }
};

exports.importExpenses = async (req, res, next) => {
  try {
    const rows = Array.isArray(req.body.transactions) ? req.body.transactions : [];
    const cleaned = rows
      .filter((item) => item.amount && item.title)
      .map((item) => ({
        user: req.user._id,
        title: item.title,
        merchant: item.merchant || item.title,
        amount: Math.abs(Number(item.amount)),
        type: item.type || (Number(item.amount) < 0 ? "expense" : "income"),
        category: item.category || guessCategory(item.title),
        date: item.date ? new Date(item.date) : new Date(),
        source: "csv"
      }));

    const saved = await Expense.insertMany(cleaned);
    res.status(201).json({ count: saved.length, transactions: saved });
  } catch (error) {
    next(error);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 }).lean();
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1, 1));
    const lastMonthEnd = endOfMonth(lastMonthStart);

    const inRange = (item, start, end) => {
      const date = new Date(item.date);
      return date >= start && date <= end;
    };

    const sumByType = (items, type) =>
      items.filter((item) => item.type === type).reduce((sum, item) => sum + item.amount, 0);

    const thisMonth = expenses.filter((item) => inRange(item, monthStart, monthEnd));
    const lastMonth = expenses.filter((item) => inRange(item, lastMonthStart, lastMonthEnd));
    const income = sumByType(thisMonth, "income");
    const spending = sumByType(thisMonth, "expense");
    const lastSpending = sumByType(lastMonth, "expense");
    const savings = income - spending;
    const budget = req.user.monthlyBudget || 0;

    const byCategoryMap = {};
    thisMonth.filter((item) => item.type === "expense").forEach((item) => {
      byCategoryMap[item.category] = (byCategoryMap[item.category] || 0) + item.amount;
    });

    const monthlyMap = {};
    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      monthlyMap[key] = { month: monthLabel(date), income: 0, expense: 0, savings: 0 };
    }

    expenses.forEach((item) => {
      const date = new Date(item.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyMap[key]) return;
      monthlyMap[key][item.type] += item.amount;
    });

    const monthly = Object.values(monthlyMap).map((item) => ({
      ...item,
      savings: item.income - item.expense
    }));

    const weeklyMap = {};
    for (let index = 6; index >= 0; index -= 1) {
      const date = new Date(now);
      date.setDate(now.getDate() - index);
      weeklyMap[dayKey(date)] = {
        day: date.toLocaleString("en-US", { weekday: "short" }),
        expense: 0
      };
    }
    expenses.filter((item) => item.type === "expense").forEach((item) => {
      const key = dayKey(new Date(item.date));
      if (weeklyMap[key]) weeklyMap[key].expense += item.amount;
    });

    const categoryEntries = Object.entries(byCategoryMap).sort((a, b) => b[1] - a[1]);
    const topCategory = categoryEntries[0];
    const trendDelta = lastSpending ? Math.round(((spending - lastSpending) / lastSpending) * 100) : 0;
    const budgetUsed = budget ? Math.round((spending / budget) * 100) : 0;

    const insights = [
      topCategory
        ? `${topCategory[0]} is your largest spending area this month.`
        : "Add a few transactions to unlock category insights.",
      budget
        ? `You have used ${budgetUsed}% of your monthly budget.`
        : "Set a monthly budget to activate overspending alerts.",
      trendDelta > 0
        ? `Spending is ${trendDelta}% higher than last month.`
        : `Spending is ${Math.abs(trendDelta)}% lower than last month.`
    ];

    res.json({
      income,
      spending,
      balance: income - spending,
      savings,
      budget,
      budgetUsed,
      transactionCount: thisMonth.length,
      trendDelta,
      byCategory: categoryEntries.map(([name, value]) => ({ name, value })),
      monthly,
      weekly: Object.values(weeklyMap),
      recent: expenses.slice(0, 8),
      insights,
      alerts: budget && spending > budget ? ["You are over your monthly budget."] : []
    });
  } catch (error) {
    next(error);
  }
};
