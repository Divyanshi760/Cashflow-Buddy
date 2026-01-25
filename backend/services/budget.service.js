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

  let remaining = amount;

  // 1️ Use current week first
  const currentWeek = weeks[weekIndex];
  const usedFromCurrent = Math.min(currentWeek.balance, remaining);
  currentWeek.balance -= usedFromCurrent;
  currentWeek.spent += usedFromCurrent;
  remaining -= usedFromCurrent;

  // 2️ Pull from PREVIOUS weeks (backward)
  for (let i = weekIndex - 1; i >= 0 && remaining > 0; i--) {
    const prevWeek = weeks[i];
    const used = Math.min(prevWeek.balance, remaining);
    prevWeek.balance -= used;
    prevWeek.spent += used;
    remaining -= used;
  }

  // 3️ Pull from NEXT weeks (forward)
  for (let i = weekIndex + 1; i < weeks.length && remaining > 0; i++) {
    const nextWeek = weeks[i];
    const used = Math.min(nextWeek.balance, remaining);
    nextWeek.balance -= used;
    nextWeek.allocated -= used; // important: reduce future allowance
    remaining -= used;
  }

  if (remaining > 0) {
    budget.isOverdrawn = true;
  }

  return budget;
}


// -------- EXPORTS (THIS IS THE KEY FIX) --------
module.exports = {
  initBudget,
  applyExpenseToWeeklyBudget
};
