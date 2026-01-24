const {verifyToken} = require('../src/services/auth');

function isLoggedIn(req, res, next){
    const authheaders = req.headers.authorization;
    if(!authheaders) {
        return res.status(401).json({
            message : 'You are logged out'
        })
    }

    const authToken = authheaders.split('Bearer ')[1];

    try{

        const user = verifyToken(authToken);
        if(!user) {
            return res.status(401).json({
                message : 'You are logged out'
            })
        }
        req.user = user;
        next();
    }

    catch(error){
        return res.status(401).json({ message: 'You are logged out' });
    }


}

module.exports = isLoggedIn;