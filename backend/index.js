const express = require('express');
const app = express();

const mongoose = require('mongoose');

// Port
const { PORT } = require('./config');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Server Start
mongoose.connect('mongodb://127.0.0.1:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) return console.log(`${err}`);
    app.listen(PORT, (err) => {
        if (err) return console.log(`${err}`);
        return console.log(`Server running on ${PORT}`);
    });
})
