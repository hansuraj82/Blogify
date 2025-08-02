require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.JWTSECRET;

function generateTokenForUser(user) {
    const payload = {
        _id: user._id,
        email: user.email,
        profile: user.profile,
        role: user.role
    };

    const token = jwt.sign(payload,secret);
    return token;
}

function verifyToken(token) {
    const user = jwt.verify(token,secret);
    return user;
}

module.exports = {
    generateTokenForUser,
    verifyToken
}