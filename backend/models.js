const mongoose = require('mongoose');

var User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }

}, {timestamps: true});

var user = mongoose.model('Users', User);

module.exports = {
    User: user,
}