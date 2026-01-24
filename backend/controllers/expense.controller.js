const expenseService = require("../services/expense.service");

exports.add = (req, res) => {
  try {
    const { amount, category, weekIndex } = req.body;

    if (!amount || !category || weekIndex === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = expenseService.addExpense(
      Number(amount),
      category,
      weekIndex
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
