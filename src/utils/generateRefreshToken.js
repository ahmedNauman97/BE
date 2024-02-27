const jwt = require("jsonwebtoken");


const generateRefreshToken = (info) => jwt.sign(info, process.env.REFRESH_TOKEN_KEY, {
    expiresIn: '1h'
})

module.exports = generateRefreshToken