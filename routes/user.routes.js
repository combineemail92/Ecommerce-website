const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");

const dotenv = require("dotenv");
dotenv.config();


// register router

router.post('/register', async(req,res) => {
    try{
        const {name , email , password} = req.body;
        const existingUser = await User.findOne({$or:[{email:email},{name:name}]});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
        });
        res.status(201).json(user);

    }catch(err){
        res.status(500).json({message: err.message});
    }
})


// login

router.post("/login", async (req, res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token = jwt.sign(
            {id:user._id , name:user.name},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        );
        res.json({message:"Login successful",token});
    }catch(err){
        res.status(500).json({message: err.message});
    }
   
})


// get all Users
router.get("/",auth,async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// get single user
router.get("/:id",async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


// Update a user 

router.put("/:id",auth ,async (req, res) => {
    try {
       const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// Delete a user    

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.json({message: "User deleted successfully"},user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


module.exports = router;