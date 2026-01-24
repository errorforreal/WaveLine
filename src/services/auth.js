const jwt = require('jsonwebtoken');


function generateToken(user){
    const payload = {
        email : user.email,
        _id : user._id,
        role : user.role
    }

    return jwt.sign(payload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
}

function verifyToken(token){
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken
}