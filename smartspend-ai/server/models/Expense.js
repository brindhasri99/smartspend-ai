const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    merchant: { type: String, trim: true, default: "" },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["income", "expense"], default: "expense" },
    category: { type: String, default: "Other" },
    date: { type: Date, default: Date.now },
    note: { type: String, default: "" },
    source: {
      type: String,
      enum: ["manual", "ai", "csv", "receipt"],
      default: "manual"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
