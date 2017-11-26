const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const QuestionSchema = new Schema({
    minAge: Number,
    maxAge: Number,
    gender: String,
    question: String,
    tags: [String],
    createdAt: {type: Date, default: Date.now()},
    answer: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

QuestionModel = mongoose.model('Question', QuestionSchema);

module.exports = QuestionModel;