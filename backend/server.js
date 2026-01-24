const express = require("express");
const cors = require("cors");

const budgetRoutes = require("./routes/budget.routes");
const expenseRoutes = require("./routes/expense.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/budget", budgetRoutes);
app.use("/expense", expenseRoutes);

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
