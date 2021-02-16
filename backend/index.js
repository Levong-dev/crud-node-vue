const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Vars
const { PORT, URI, SALT } = require('./config');
const { User, Note } = require('./models');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/ping', (req, res, next) => {
    return res.send('pong');
})

app.post('/register', (req, res, next) => {
    const { name, email, password } = req.body;

    const match = await User.findOne({ email: email });
    if (match) { return res.status(406).send({ message: "Email already in use" }) }

    const hash = await bcrypt.hashSync(password, SALT);

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

    await bcrypt.compareSync(password, match.password).then(result => {
        if (!result) { return res.status(500).send({ message: "Some error" }); }
        return res.status(200).send({ message: "Logged in" })
    });
})

app.post('/create', async (req, res, next) => {
    const { id, title, body } = req.body;

    await Note.create({
        author_id: id,
        title: title,
        body: body
    }, (err, data) => {
        if (err) { return res.status(500).send({ message: "Some error" }); }
        return res
            .status(200)
            .send({
                title: data.title,
                body: data.body,
                created_date: data.createdAt
            })
    })

});

app.delete('/delete/:id', async (req, res, next) => {
    const { id } = req.params;

    await Note.findByIdAndDelete(id, (err) => {
        if (err) { return res.status(500).send({ message: "Some error" }); }
        return res.status(200).send({ message: 'Deleted' })
    })
})

app.put('/update/:id', async (req, res, next) => {
    await Note.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body
    }, { new: true }, (err, data) => {
        if (err) { return res.status(500).send({ message: "Some error" }); }
        return res
            .status(200)
            .send({
                title: data.title,
                body: data.body,
                created_date: data.createdAt
            })
    })
})

app.get('/notes/:id', async (req, res, next) => {
    await Note.find({ author_id: req.params.id }, (err, data) => {
        if (err) { return res.status(500).send({ message: "Some error" }); }
        return res.status(200).send(data)
    })
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
