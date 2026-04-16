const redis = require('../config/redis');

const WINDOW = 15 * 60;
const RATE_LIMIT = 100;

const rateLimiter = async (req, res, next) => {
    try{

        const user = req.user._id;
        const key = `rate_limit:${user}`;

        const current = await redis.incr(key);

        if(current === 1){
            await  redis.expire(key, WINDOW);
        }

        if(current > RATE_LIMIT){
            return res.status(429).json({ status : 'Too many requests, try again later!!'});
        }

        next();
    }catch(err){
        console.log("Rate limitor error: ", err.message);
        next();
        
    }
}


module.exports = rateLimiter;
