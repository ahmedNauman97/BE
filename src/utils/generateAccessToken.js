const jwt = require("jsonwebtoken");


const generateAccessToken = (info) => jwt.sign(info, process.env.ACCESS_TOKEN_KEY, {
    expiresIn: '1h'
})

module.exports = generateAccessToken