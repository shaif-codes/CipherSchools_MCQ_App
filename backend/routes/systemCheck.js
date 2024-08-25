const express = require('express');
const router = express.Router();
const { systemCheck, verifySystemCheck } = require('../controllers/systemCheck');

// System check route
router.post('/system-check', systemCheck);
router.post('/verify-system-check', verifySystemCheck);

module.exports = router;