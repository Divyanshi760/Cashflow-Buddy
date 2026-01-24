const budgetService = require("../services/budget.service");
const budgetRepository = require("../repository/budget.repository");

const { calculateBurnRate } = require("../services/burnRate.service");
const { predictRunOutDate } = require("../services/prediction.service");
const { shouldSuggestFreeze } = require("../services/freeze.service");


// -------- INIT BUDGET --------
exports.init = (req, res) => {
  const { allowance, weeklyAllocations } = req.body;

  try {
    const data = budgetService.initBudget(allowance, weeklyAllocations);

    budgetRepository.saveBudget(data);

    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// -------- OVERVIEW / SUMMARY --------
exports.overview = (req, res) => {
  const budget = budgetRepository.getBudget();

  if (!budget) {
    return res.status(404).json({ error: "No budget found" });
  }

  res.json({
    budget,
    burnRate: calculateBurnRate(budget),
    prediction: predictRunOutDate(budget),
    suggestFreeze: shouldSuggestFreeze(budget.expenses)
  });
};
