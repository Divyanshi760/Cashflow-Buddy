const express = require("express");
const router = express.Router();
const controller = require("../controllers/expense.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { apiLimiter } = require("../middleware/rateLimiter.middleware");

router.post("/add", apiLimiter, verifyToken, controller.add);

module.exports = router;
