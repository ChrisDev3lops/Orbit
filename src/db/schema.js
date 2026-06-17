const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    displayName: String,
    accountId: String,
    created: { type: Date, default: Date.now }
});

module.exports = {
    User: mongoose.model('User', UserSchema)
};
