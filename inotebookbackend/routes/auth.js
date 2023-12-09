const express = require('express')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const fetchuser = require('../middleware/fetchuser')
const { body,validationResult } = require('express-validator')

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

// ROUTE 1:
//      Create a User using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/createuser',[
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be of at least 6 characters').isLength({ min: 6 }),
    body('password', 'Password must be of at most 20 characters').isLength({ max: 20 })
], async(req,res)=>{
    try{

        let success=false
        
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            success=false
            return res.status(400).json({ success, errors: errors })
        }
    
        // Check whether the user with this email exists already
        let user = await User.findOne({ email: req.body.email })
        if(user){
            success=false
            return res.status(200).json({ success, errors: 'Sorry a user with this email already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password,salt)
        // Create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken=jwt.sign(data, JWT_SECRET)

        success=true
        res.json({ success, authToken })
    }
    catch(error){
        console.error(error.message);
        // res.status(500).send("Internal Server Error")
        let success=false
        res.status(500).json({ success, errors: "Internal Server Error" })
    }
})

// ROUTE 2:
//      Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
    body('email', 'Please Enter a valid email').isEmail(),
    body('password', 'Password is too short').isLength({min: 6}),
    body('password', 'Password is too long').isLength({max: 20})
], async (req,res)=>{
    try{

        let success=false
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            success=false
            return res.status(400).json({ success, errors: errors.array() })
        }
    
        const {email,password} = req.body
    
        // Check whether the user with this email exists already
        let user = await User.findOne({ email })
        if(!user){
            success=false
            return res.status(200).json({ success, errors: 'Please try again with correct credentials' })
        }
        
        const passwordCompare = await bcrypt.compare(password,user.password)

        if(!passwordCompare){
            success=false
            return res.status(200).json({ success, errors: 'Please try again with correct credentials' })
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken=jwt.sign(data, JWT_SECRET)

        // res.json(user)
        success = true
        res.json({ success, authToken })
    }
    catch(error){
        console.error(error.message);
        let success=false
        res.status(500).json({ success, errors: "Internal Server Error" })
    }
})

// ROUTE 3:
//      Get Logged in User Details using: POST "/api/auth/getuser". login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    }
    catch(error){
        console.error(error.message)
        let success=false
        res.status(500).json({ success, errors: "Internal Server Error" })
    }
})


module.exports = router