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

}, { timestamps: true });

var Note = new mongoose.Schema({
    author_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        max: 200,
        required: true,
    }
}, { timestamps: true });

var user = mongoose.model('Users', User);
var note = mongoose.model('Notes', Note);

module.exports = {
    User: user,
    Note: note
}