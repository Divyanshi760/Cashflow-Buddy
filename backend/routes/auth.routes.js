const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimiter.middleware');

router.post('/google', authLimiter, controller.googleLogin);

module.exports = router;
