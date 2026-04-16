const User = require('../models/user');
const bcrypt = require('bcrypt');
const {generateToken, verifyToken} = require('../src/services/auth');
const {addOnlineUser, removeOnlineUser} = require('../src/services/onlineUser.service');

async function handleLogin(req,res){
    const {email , password} = req.body;

    try{
            const user = await User.findOne({email});
            if(!user){
                return res.status(401).json({
                    error : 'Invalid username or password'
                })
            }
            const isUserValid = await bcrypt.compare(password, user.passwordHash);
            if(!isUserValid){
                return res.status(401).json({
                    error : 'Invalid username or password'
                });
            }

            await addOnlineUser(user._id.toString());

            const loginToken = generateToken(user);
            
            return res.status(200).json({
                loginToken : loginToken
            })
        }

        catch(error){
            console.log(error);
            
            return res.status(500).json({
                error : 'Internal server error'
            })
        }
    
}

async function handleSignup(req,res){
    const {name , email, password} = req.body;
    const passwordHash = await bcrypt.hash(password,10);

    try{
        const user = await User.create({
            name,
            email,
            passwordHash
        })

        return res.status(200).json({
            message : 'success'
        });
    }
    catch(err){
        console.log(err);
        
        return res.status(400).json({
            message : 'Email already exists'
        });
        
        
    }
}

async function handleLogout(req,res){
    const authheader = req.headers.authorization;
    
    const token = authheader.split('Bearer ')[1];
    const user = verifyToken(token);
    
    if(!user){
        return res.status(401).json({ message : "Invalid token" } );
    }

    await removeOnlineUser(user._id.toString());

    return res.status(200).json({ message : "Logged out successfully"})
}

module.exports = {
    handleLogin,
    handleSignup,
    handleLogout
}