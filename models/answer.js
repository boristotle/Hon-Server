const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AnswerSchema = new Schema({
    answer: String,
    date: Date
});

AnswerModel = mongoose.model('Answer', AnswerSchema);

module.exports = AnswerModel;