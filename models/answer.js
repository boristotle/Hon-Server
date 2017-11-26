const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const AnswerSchema = new Schema({
    answer: String,
    date: Date,
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

AnswerModel = mongoose.model('Answer', AnswerSchema);

module.exports = AnswerModel;