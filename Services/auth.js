const secretKey = "sarang";
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const verifyJWTCookie = (req,res,next) => {
    const token = req.cookies.jwt;
    if(!token) res.status(401).json({error:"Unauthorized to the following page..."});
    jwt.verify(token, (err, decodedInfo)=>{
        if(err){
            return res.status(401).json({error:"Invalid Token"});
        }
        req.userData = decodedInfo;
        next();
    })
}

const createJWTCookie = async (req, res, next) => {
    console.log(1);
        const { email, password } = req.body;
    
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email}, secretKey, { expiresIn: "7d" });
    
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7*24*60*60*1000,
            path:"/",
        });
        // res.cookie("jwt", token, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: "lax",
        //     maxAge: 7*24*60*60*1000,
        //     path:"/",
        // });

        res.json({userName:user.username});
        next();
}

module.exports = {verifyJWTCookie, createJWTCookie};