const expenseService = require("../services/expense.service");

exports.add = async (req, res) => {
  try {
    const { amount, category, weekIndex, note } = req.body;

    if (amount == null || !category || weekIndex === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const parsedAmount = Number(amount);
    const parsedWeekIndex = Number(weekIndex);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number." });
    }

    if (!Number.isInteger(parsedWeekIndex) || parsedWeekIndex < 0 || parsedWeekIndex > 3) {
      return res.status(400).json({ error: "Invalid week index." });
    }

    const result = await expenseService.addExpense(
      req.userId,
      parsedAmount,
      category,
      parsedWeekIndex,
      note || ''
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
