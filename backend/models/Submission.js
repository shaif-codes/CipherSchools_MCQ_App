// models/Submission.js

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    selections: [{
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
      option: { type: String, required: true },
      savedAt: { type: Date, default: Date.now }
    }],
    score: { type: Number, default: 0 },  
    evaluatedAt: { type: Date, default: null },          
    endedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
  
module.exports = mongoose.model('Submission', submissionSchema);
