const Submission = require('../models/Submission');
const Test = require('../models/Test');
const User = require('../models/User');
const Question = require('../models/Question');
const { sendEmail } = require('./emailService');
const fs = require('fs');
const path = require('path');

const evaluateTestsAndSendEmails = async () => {
  // Function to generate the email template
  const generateEmailTemplate = (data) => {
    const emailTemplatePath = path.join(__dirname, '../emailTemplates/resultEmail.html');
    let template = fs.readFileSync(emailTemplatePath, 'utf8');
    template = template
      .replace('{{userName}}', data.userName)
      .replace('{{testTitle}}', data.testTitle)
      .replace('{{dateCompleted}}', data.dateCompleted)
      .replace('{{score}}', data.score)
      .replace('{{totalMarks}}', data.totalMarks)
      .replace('{{personalizedMessage}}', data.personalizedMessage);
    
      return template;
  };

  const pendingSubmissions = await Submission.find({ evaluatedAt: null });
  if (pendingSubmissions.length === 0) {
    console.log('No pending submissions found');
    return;
  }

  for (let submission of pendingSubmissions) {
    const test = await Test.findById(submission.testId);

    // Calculate the score
    let score = 0;
    for (let selection of submission.selections) {
      const question = await Question.findById(selection.questionId);
      if (question && question.correctOption === selection.option) {
        score += question.marks;
      }
    }

    // Update the submission with the calculated score and evaluation time
    submission.score = score;
    const totalMarks = test.questions.reduce((total, question) => total + question.marks, 0);
    submission.evaluatedAt = new Date();
    await submission.save();

    // Get the user details
    const user = await User.findById(submission.userId);

    const data = {
      userName: user.name,
      testTitle: test.title,
      dateCompleted: submission.evaluatedAt.toDateString(),
      score,
      totalMarks,
      personalizedMessage: score === totalMarks ? "Exceptional work!" : score > totalMarks * 0.7 ? "Great job! Keep up the good work." : score > totalMarks * 0.5 ? "Good effort! With a bit more practice, you can achieve even higher scores." : "Don't be discouraged. Consider reviewing the material and trying again."
    };
    // Send the score via email
    const subject = `Your Score for ${test.title}`;


    const htmlTemplate = generateEmailTemplate(data);

    await sendEmail(user.email, subject, htmlTemplate);
    console.log(`Email sent to ${user.email} for test ${test.title}`);
  }
};

module.exports = {
  evaluateTestsAndSendEmails,
};
