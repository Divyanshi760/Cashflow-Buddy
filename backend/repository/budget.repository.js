let budget = null;

function saveBudget(data) {
  budget = data;
  return budget;
}

function getBudget() {
  return budget;
}

function clearBudget() {
  budget = null;
}

module.exports = {
  saveBudget,
  getBudget,
  clearBudget
};
