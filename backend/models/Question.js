const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
    marks: { type: Number, required: true },
    correctOption: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Question', questionSchema);