require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.clientLink || "http://localhost:3000",
    credentials: true,
}));
const MONGODB_LINK = process.env.MONGODB_LINK || "mongodb://127.0.0.1:27017/BlogX"; 
mongoose.connect(MONGODB_LINK).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));

const User = require("./models/User");
const { createJWTCookie } = require('./Services/auth');
const Blog = require('./models/Blog');

const secretKey = process.env.secretKey || "sarang";

app.post("/user/signup", async (req, res) => {
    const { email, password , name , username} = req.body;
    if (!email || !password || !name || !username) return res.status(400).json({ error: "All fields are required" });
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, name , username });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "User already exists or server error" });
    }
});

app.post("/user/login", createJWTCookie, async (req, res) => {

});

app.get("/cookie", async (req, res)=>{
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json({error:"Cookie is not found"});
        try{
            const decoded = jwt.verify(token, secretKey);
            const user = await User.findOne({email:decoded.email});
            if(!user) return res.status(401).json({error:"User not found"});
            return res.json({username:user.username, name: user.name, email: user.email});
        }
        catch{
            return res.status(401).json({error:"Invalid Token"});
        }
});

app.post("/user/logout", (req, res) => {
    res.clearCookie("jwt");
    res.json({ message: "Logged out successfully" });
});

app.post("/user/blog", async (req, res)=> {
    const {author, content, title, bgColor, description} = req.body;
    try{
        await Blog.create({ title, content, author, bgColor, description});       
        return res.status(201).json({success:"Blog is created"});
    } catch(error){
        return res.status(400).json({error:"Blog is not created"});
    }
});

app.get('/blogs', async (req, res) => {
    try {
      const blogs = await Blog.find({})
      return res.json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      return res.status(500).send('Server error');
    }
});

app.get('/singleblog', async (req, res)=> {
    try{
        const {author, date} = req.query;
        const blog = await Blog.findOne({author:author, createdAt: date});
        return res.json(blog);
    }
    catch{
        return res.status(404).json({error:"Blog is not Found"});
    }
});

app.get('/author/blogs', async (req, res)=> {
    try{
        const {author} = req.query;
        const blog = await Blog.find({author:author});
        return res.json(blog);
    }
    catch{
        return res.status(404).json({error:"Blog is not Found"});
    }
});
const port = process.env.PORT;
app.listen(port, () => console.log("Server started"));