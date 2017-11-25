const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const QuestionSchema = new Schema({
    question: String,
    date: Date, //need to set default to now
    answer: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

QuestionModel = mongoose.model('Question', QuestionSchema);

module.exports = QuestionModel;