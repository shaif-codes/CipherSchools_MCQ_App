const Test = require('../models/Test');
const Question = require('../models/Question');
const Submission = require('../models/Submission');
const mongoose = require('mongoose');


exports.createTest = async (req, res) => {
    try {
        const { title, description, questions } = req.body;
        const userId = req.user.userId; // Get userId from the JWT token

        // Create a new test
        const newTest = new Test({
            title,
            description,
            createdBy: userId // Set the creator of the test
        });

        await newTest.save();

        // Save each question with the testId
        const savedQuestions = await Promise.all(
            questions.map(async (question) => {
                const newQuestion = new Question({
                    ...question,
                    testId: newTest._id, // Assign the testId to the question
                    _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for the question
                });
                return await newQuestion.save();
            })
        );

        // Update the test document with the saved question IDs
        newTest.questions = savedQuestions.map((q) => q._id);
        await newTest.save();

        res.status(201).json({ message: 'Test created successfully', test: newTest });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllTests = async (req, res) => {
    try {
        const tests = await Test.find({ isDeleted: false }).populate('questions');
        if (!tests) {
            return res.status(404).json({ message: 'No tests found' });
        }
        res.status(200).json(tests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const test = await Test.findById(id).populate('questions');
        if (!test || test.isDeleted) {
            return res.status(404).json({ message: 'Test not found' });
        }
        res.status(200).json(test);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, questions } = req.body;
        const userId = req.user.userId; // Extract userId from JWT token
        
        console.log("id", id);
        console.log("title", title);
        console.log("description", description);
        console.log("questions", questions);
        console.log("userId", userId);
        // Find the test by ID
        const test = await Test.findById(id);
        if (!test || test.isDeleted) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if the current user is the creator of the test
        // if (test.createdBy.toString() !== userId.toString()) {
        //     return res.status(403).json({ message: 'You are not authorized to update this test' });
        // }

        // Update the test fields
        test.title = title || test.title;
        test.description = description || test.description;

        // If questions are provided, update them
        if (questions && questions.length > 0) {
            const updatedQuestions = await Promise.all(
                questions.map(async (question) => {
                    if (question._id) {
                        // Find the existing question by _id
                        const existingQuestion = await Question.findById(question._id);
                        if (existingQuestion) {
                            // Update the existing question
                            existingQuestion.question = question.question || existingQuestion.question;
                            existingQuestion.options = question.options || existingQuestion.options;
                            existingQuestion.marks = question.marks || existingQuestion.marks;
                            existingQuestion.correctOption = question.correctOption || existingQuestion.correctOption;
                            existingQuestion.updatedAt = Date.now();
                            return await existingQuestion.save();
                        } else {
                            // If the question ID doesn't exist, create a new question
                            const newQuestion = new Question({
                                ...question,
                                testId: test._id,
                                _id: new mongoose.Types.ObjectId(),
                            });
                            return await newQuestion.save();
                        }
                    } else {
                        // Create new questions if no _id is provided
                        const newQuestion = new Question({
                            ...question,
                            testId: test._id,
                            _id: new mongoose.Types.ObjectId(),
                        });
                        return await newQuestion.save();
                    }
                })
            );

            // Update the test document with the updated question IDs
            test.questions = updatedQuestions.map((q) => q._id);
        }

        // Save the updated test
        await test.save();

        res.status(200).json({ message: 'Test updated successfully', test });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId; // Get userId from the JWT token

        // Find the test by ID
        const test = await Test.findById(id);
        if (!test || test.isDeleted) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if the current user is the creator of the test
        // if (test.createdBy.toString() !== userId.toString()) {
        //     return res.status(403).json({ message: 'You are not authorized to delete this test' });
        // }

        // Mark the test and associated questions as deleted
        test.questions.forEach(async (questionId) => {
            await Question.findByIdAndUpdate(questionId, { isDeleted: true });
        });
        test.isDeleted = true;
        await test.save();

        await Question.updateMany({ testId: id }, { isDeleted: true });

        res.status(200).json({ message: 'Test deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getAllDeletedTests = async (req, res) => {
    console.log("I am here at getAllDeletedTests");
    try {
        // Find all tests where isDeleted is true
        const deletedTests = await Test.find({ isDeleted: true }).populate('questions');

        // If no deleted tests are found
        if (!deletedTests || deletedTests.length === 0) {
            return res.status(404).json({ message: 'No deleted tests found' });
        }

        // Respond with the list of deleted tests
        res.status(200).json(deletedTests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.undoDeleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const test = await Test.findById(id);
        if (!test || !test.isDeleted) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if the current user is the creator of the test
        // if (test.createdBy.toString() !== userId.toString()) {
        //     return res.status(403).json({ message: 'You are not authorized to undo delete this test' });
        // }

        // Mark the test and associated questions as not deleted
        test.questions.forEach(async (questionId) => {
            await Question.findByIdAndUpdate(questionId, { isDeleted: false });
        });
        test.isDeleted = false;
        await test.save();

        // await Question.updateMany({ testId: id }, { isDeleted: false });

        res.status(200).json({ message: 'Test deletion undone successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    
    }
}


exports.startTest = async (req, res) => {
    const { testId } = req.params;
    const userId = req.user.userId;

    try {
        const test = await Test.findById(testId);

        if (!test || test.isDeleted) {
            return res.status(404).json({ message: 'Test not found' });
        }

        const currentTime = new Date();

        if (currentTime < test.startTime || currentTime > test.endTime) {
            return res.status(400).json({ message: 'Test is not available at this time.' });
        }

        // If valid, proceed to start the test
        res.status(200).json({ message: 'Test started successfully', testId: test._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



exports.submitTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const { selections } = req.body;
        const userId = req.user.userId;
        // console.log("testId", testId);
        // console.log("selections", selections);
        // console.log("userId", userId);

        // Find the test and submission
        const test = await Test.findById(testId);
        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        // Check if the user has already submitted the test
        const existingSubmission = await Submission.findOne({ userId, testId });
        if (existingSubmission) {
            return res.status(400).json({ message: 'You have already submitted this test' });
        }

        // Get the current time
        const currentTime = new Date();

        // Check if the current time is within the test's end time
        if (currentTime > test.testEndTime) {
            return res.status(400).json({ message: 'The test submission time has expired' });
        }

        // Create the submission
        const submission = new Submission({
            userId,
            testId,
            selections,
            submittedAt: currentTime,
        });

        // Save the submission
        await submission.save();

        res.status(200).json({ message: 'Test submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.checkTestAttempt = async (req, res) => {
    try {
        const { testId } = req.params;
        const userId = req.user.userId;

        const existingSubmission = await Submission.findOne({ userId, testId });
        if (existingSubmission) {
            return res.status(200).json({ attempted: true });
        } else {
            return res.status(200).json({ attempted: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// exports.getTestResults = async (req, res) => {
//     try {
//         const { testId } = req.params;
//         const userId = req.user.userId;

//         const submission = await Submission.findOne({ userId, testId });
//         if (!submission) {
//             return res.status(404).json({ message: 'No results found for this test' });
//         }

//         res.status(200).json({ results: submission.answers });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// Get Test Results
exports.getTestResults = async (req, res) => {
    try {
        const { testId } = req.params;
        const userId = req.user.userId; // Extract userId from JWT token

        // Find the submission for the user and the test
        const submission = await Submission.findOne({ testId, userId }).populate('testId').populate('userId');
        if (!submission) {
            return res.status(404).json({ message: 'No submission found for this test and user.' });
        }

        const test = await Test.findById(testId).populate('questions');
        console.log(submission);
        // Calculate the score based on the correct answers
        let score = 0;
        for (const selection of submission.selections) {
            const question = await Question.findById(selection.questionId);
            console.log("question: ", question);
            if (question && selection.option === question.correctOption) {
                score += question.marks;
            }
        }
        submission.score = score;
        await submission.save();
        // Prepare the results data
        const results = {
            test: submission.testId.title,
            user: submission.userId.name,
            score: score,
            totalMarks: test.questions.reduce((acc, q) => acc + q.marks, 0),
            details: submission.selections.map(selection => ({
                question: selection.questionId.question,
                selectedOption: selection.option,
                correctOption: selection.questionId.correctOption,
                isCorrect: selection.option === selection.questionId.correctOption,
                marksAwarded: selection.option === selection.questionId.correctOption ? selection.questionId.marks : 0,
            })),
        };

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Manually Trigger Test Evaluation
exports.evaluateTest = async (req, res) => {
    try {
        const { testId } = req.params;
        const userId = req.user.userId; // Extract userId from JWT token

        // Find the submission for the user and the test
        const submission = await Submission.findOne({ testId, userId }).populate('testId').populate('userId');
        if (!submission) {
            return res.status(404).json({ message: 'No submission found for this test and user.' });
        }

        // Calculate the score based on the correct answers
        let score = 0;
        for (const selection of submission.selections) {
            const question = await Question.findById(selection.questionId);
            if (question && selection.option === question.correctOption) {
                score += question.marks;
            }
        }

        // Update the submission with the evaluation results
        submission.score = score;
        submission.evaluatedAt = new Date();
        await submission.save();

        res.status(200).json({ message: 'Test evaluated successfully', score: score });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

