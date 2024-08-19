// routes/testRoutes.js

const express = require('express');
const router = express.Router();
const { createTest, getAllTests, getTestById, updateTest, deleteTest, 
        submitTest, startTest, checkTestAttempt, undoDeleteTest, 
        getAllDeletedTests, getTestResults, evaluateTest } = require('../controllers/testController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);


router.post('/', createTest);
router.get('/', getAllTests);
router.get('/deleted-tests', getAllDeletedTests); // New route for getting all deleted tests
router.get('/:id', getTestById);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);
router.get('/undo-delete/:id', undoDeleteTest); // New route for undoing delete
router.post('/:testId/submit', submitTest); // New route for submitting a test
router.post('/start', startTest); // New route for starting a test
router.get('/attempt/:testId', checkTestAttempt); // New route for checking test attempt
router.get('/:testId/results/', getTestResults); // New route for getting test results
router.get('/:testId/evaluate', evaluateTest); // New route for evaluating a test

module.exports = router;
