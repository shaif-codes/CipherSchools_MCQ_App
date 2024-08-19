const cron = require('node-cron');
const { evaluateTestsAndSendEmails } = require('../services/testEvaluationService');

// Define the cron job to run every hour
cron.schedule('0 * * * *', async () => {
  console.log('Cron Job: Evaluating tests and sending emails...');
  try {
    await evaluateTestsAndSendEmails();
  } catch (error) {
    console.error('Error during cron job:', error);
  }
});
