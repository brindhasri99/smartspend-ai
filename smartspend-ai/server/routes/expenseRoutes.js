const express = require("express");
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  importExpenses,
  getSummary
} = require("../controllers/expenseController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.get("/", getExpenses);
router.post("/", createExpense);
router.post("/import", importExpenses);
router.get("/summary", getSummary);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
