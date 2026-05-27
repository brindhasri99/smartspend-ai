const express = require("express");
const { parseExpenseText, createFromText, getInsights } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.post("/parse", parseExpenseText);
router.post("/create", createFromText);
router.get("/insights", getInsights);

module.exports = router;
