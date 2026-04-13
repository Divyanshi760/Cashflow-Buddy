const express = require("express");
const router = express.Router();
const controller = require("../controllers/budget.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { apiLimiter } = require("../middleware/rateLimiter.middleware");

router.post("/init", apiLimiter, verifyToken, controller.init);
router.get("/overview", apiLimiter, verifyToken, controller.overview);
router.post("/reset", apiLimiter, verifyToken, controller.resetMonth);
router.post("/update-allowance", apiLimiter, verifyToken, controller.updateAllowance);
router.post("/month-start-date", apiLimiter, verifyToken, controller.updateMonthStartDate);
module.exports = router;
