const redis = require('../../config/redis');

const addOnlineUser = async (userId) => {
    await redis.sadd("online_users", userId);
}

const removeOnlineUser = async (userId) => {
    await redis.srem("online_users", userId);
}

const getOnlineUsers = async () => {
    return await redis.smembers("online_users");
}

const isUserOnline = async (userId) => {
    return await redis.ismember("online_users", userId);
}

module.exports = {
    addOnlineUser,
    removeOnlineUser,
    getOnlineUsers,
    isUserOnline
}