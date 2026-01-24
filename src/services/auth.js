const jwt = require('jsonwebtoken');
const {jwtSecret, jwtExpiresIn} = require('../config/env');

function generateToken(user){
    const payload = {
        email : user.email,
        _id : user._id,
        role : user.role
    }

    return jwt.sign(payload,jwtSecret, {
        expiresIn : jwtExpiresIn || '1d'
    });
}

function verifyToken(token){
    return jwt.verify(token, jwtSecret);
}

module.exports = {
    generateToken,
    verifyToken
}