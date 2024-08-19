const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// Apply authentication middleware
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.delete('/profile', deleteProfile);

module.exports = router;
