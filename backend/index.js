const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Vars
const { PORT, URI, SALT } = require('./config');
const { User } = require('./models');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/ping', (req, res, next) => {
    return res.send('pong');
})

app.post('/register', async (req, res, next) => {
    const { name, email, password } = req.body;

    const match = await User.findOne({ email: email });
    if (match) { return res.status(406).send({ message: "Email already in use" }) }

    const hash = await bcrypt.hash(password, SALT);

    var new_user = new User({
        name: name,
        email: email,
        password: hash
    });

    await new_user.save((err, user) => {
        if (err) { return res.status(500).send({ message: "Some error on saving" }); }

        return res
            .status(200)
            .send(user)
    })
})

app.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    const match = await User.findOne({ email: email });
    if (!match) { return res.status(406).send({ message: "Some error" }); }

    await bcrypt.compare(password, match.password).then(result => {
        if (!result) { return res.status(500).send({ message: "Some error" }); }
        return res.status(200).send({ message: "Logged in" })
    });
})


// Server Start
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err) => {
    if (err) return console.log(`${err}`);
    app.listen(PORT, (err) => {
        if (err) return console.log(`${err}`);
        return console.log(`Server running on ${PORT}`);
    });
})
