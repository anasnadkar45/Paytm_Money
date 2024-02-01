const express = require('express');
const zod = require("zod");
const { User } = require('../db');
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require('../config')
const router = express.Router();

const signupBody = zod.object({
    username: zod.string().email(),
    firstName : zod.string(),
    lastName : zod.string(),
    password : zod.string(),
})

router.post('/signup', async(req, res) => {
    const {success} = signupBody.safeParse(req.body);
    
    if(!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if(existingUser){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const newUser = await User.create({
        username : req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password
    })

    const userId = newUser._id;
    console.log('JWT_SECRET:', JWT_SECRET);

    const token = jwt.sign({
        userId
    },JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: token
    })
})

module.exports = router;