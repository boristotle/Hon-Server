const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    name: String,
    passwordHash: String,
    honestyCredits: Number,
    honestyFreebies: Number,
    age: Number,
    gender: String,
    tags: [String],
    email: String //set to unique
});

UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
