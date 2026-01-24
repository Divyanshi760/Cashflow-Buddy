// -------- INIT BUDGET --------
function initBudget(allowance, weeklyAllocations) {
  if (!allowance || allowance <= 0) {
    throw new Error("Invalid allowance");
  }

  const weeklyAmount = Math.floor(allowance / 4);

  const weeks = Array.from({ length: 4 }, (_, i) => ({
    week: i,
    allocated: weeklyAllocations?.[i] ?? weeklyAmount,
    spent: 0,
    balance: weeklyAllocations?.[i] ?? weeklyAmount
  }));

  return {
    allowance,
    weeks,
    expenses: [],
    categoryTotals: {
      food: 0,
      transport: 0,
      fun: 0,
      other: 0
    },
    isOverdrawn: false
  };
}


// -------- APPLY EXPENSE + SNOWBALL --------
function applyExpenseToWeeklyBudget(budget, amount, weekIndex) {
  const weeks = budget.weeks;

  if (!weeks[weekIndex]) {
    throw new Error("Invalid week index");
  }

  weeks[weekIndex].spent += amount;
  weeks[weekIndex].balance -= amount;

  if (weeks[weekIndex].balance < 0) {
    let deficit = Math.abs(weeks[weekIndex].balance);
    weeks[weekIndex].balance = 0;

    for (let i = weekIndex + 1; i < weeks.length && deficit > 0; i++) {
      const deduction = Math.min(deficit, weeks[i].balance);
      weeks[i].balance -= deduction;
      weeks[i].allocated -= deduction;
      deficit -= deduction;
    }

    budget.isOverdrawn = true;
  }

  return budget;
}


// -------- EXPORTS (THIS IS THE KEY FIX) --------
module.exports = {
  initBudget,
  applyExpenseToWeeklyBudget
};
