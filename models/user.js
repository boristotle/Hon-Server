const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    name: String,
    passwordHash: String,
    honestyCredits: Number,
    age: Number,
    gender: String,
    tags: [String],
    email: {type: String, unique: true },
    createdAt: {type: Date, default: Date.now()},
});

UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
