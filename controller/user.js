const User = require('../models/user');
const bcrypt = require('bcrypt');
const {generateToken} = require('../src/services/auth');

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
            error : 'Email already exists'
        });
        
        
    }
}

module.exports = {
    handleLogin,
    handleSignup
}