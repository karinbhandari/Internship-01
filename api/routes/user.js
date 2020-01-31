const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")


router.post("/signup", (req, res, next) => {

    const plainPassword = req.body.password

    User
        .find({email: req.body.email})
        .exec()
        .then(user => {
            if(user.length >= 1) {
                res.status(409).json({
                    message: "User already exists!",
                    email: req.body.email
                })
            }else{
                bcrypt.hash(plainPassword, 10)
                    .then(hash => {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        })
                        user
                            .save()
                            .then(result => {
                                res.status(201).json({
                                    message:  `${req.body.email} Sucessfully Signed Up!`
                                })
                                console.log("User Sucessfully signed up!")
                            })
                            .catch(err => {
                                res.status(500).json({
                                    message: "Sign up failed!",
                                    error: err.message
                                })
                                console.log("User sign up failed => ", err.message)
                            })
                    })
                    .catch(err => {
                        console.log("[*ERROR*] Couldn't hash the password => ", err.message)
                    })
            }
        })
        .catch(err => {
            console.log("Error while searching for existing email => ", err.message)
        })
})

router.post('/login', (req, res, next) => {
    User
        .findOne({email: req.body.email})
        .exec()
        .then(user => {
            if(user){
                bcrypt
                    .compare(req.body.password, user.password)
                    .then(result => {
                        if(result){
                            const token = jwt.sign({
                                    email: user.email,
                                    userId: user._id
                                },
                                    process.env.JWT_KEY
                                ,
                                    {
                                        expiresIn: "1d"
                                    }
                                )
                            res.status(200).json({
                                message: "Auth Sucessful!",
                                token: token
                            })
                            console.log("Auth Sucessful")
                        }else{
                            res.status(401).json({
                                message: "Incorrect Password!"
                            })
                            console.log("Incorrect Password")
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: "Error while validating password!",
                            error: err.message
                        })
                        console.log("Error while validating password!")
                    })
            }else{
                res.status(401).json({
                    message: "Email doesn't match, Auth failed!"
                })
                console.log("Email doesn't match, Auth failed!")
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error while login user!",
                error: err.message
            })
            console.log(err.message)
        })
})

router.delete("/delete/:email", (req, res, next) => {
    User
        .deleteMany({email: req.params.email})
        .then(user => {
            res.status(201).json({
                message: "User deleted sucessfully",
                email: user.email
            })
            console.log("User deleted sucessfully!")
        })
        .catch(err => {
            res.status(500).json({
                message: "Couldn't delete the user!",
                error: err.message
            })
            console.log("Couldn't delete the user!")
        })
})

module.exports = router;
