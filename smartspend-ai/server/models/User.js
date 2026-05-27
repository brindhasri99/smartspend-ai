const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    monthlyBudget: { type: Number, default: 50000 },
    currency: { type: String, default: "INR" },
    preferences: {
      theme: { type: String, enum: ["dark", "light"], default: "dark" },
      alerts: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
