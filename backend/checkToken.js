const jwt = require('jsonwebtoken')

async function checkToken(req, res, next){
    const token = req.headers.authorization.split(' ')[1];
    console.log(token)
    await jwt.verify(token, 'secret', (err, decoded) => {
        if (err){
            return res
                .status(500)
                .send({ message: 'Server error' + err})
        }

        if (Date.now() >= decoded.exp * 1000){
            return res
                .status(406)
                .send({ message: 'Token expired' })
        }
        req.id = decoded.id;
        console.log("user: " + req.id)
        next()
    })
}

module.exports = checkToken;