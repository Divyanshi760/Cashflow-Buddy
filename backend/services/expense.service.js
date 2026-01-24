const budgetRepository = require("../repository/budget.repository");
const { applyExpenseToWeeklyBudget } = require("./budget.service");

const ALLOWED_CATEGORIES = ["food", "transport", "fun", "other"];

function addExpense(amount, category, weekIndex) {
  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw new Error("Invalid expense category");
  }

  const budget = budgetRepository.getBudget();
  if (!budget) {
    throw new Error("Budget not initialized");
  }

  // Apply weekly snowball logic
  const updatedBudget = applyExpenseToWeeklyBudget(
    budget,
    amount,
    weekIndex
  );

  // Save expense entry
  updatedBudget.expenses.push({
    amount,
    category,
    weekIndex,
    date: new Date()
  });

  // Update category totals
  updatedBudget.categoryTotals[category] += amount;

  budgetRepository.saveBudget(updatedBudget);
  return updatedBudget;
}

module.exports = { addExpense };
