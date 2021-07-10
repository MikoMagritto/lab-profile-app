const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const router = express.Router();
const User = require('../models/User.model');


// POST route => to create a new user


router.post('/auth/signup', (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(400).json({ message: 'Provide username and password' });
        return;
    }

    if (password.length < 7) {
        res.status(400).json({ message: 'Please make your password at least 8 characters long for security purposes.' });
        return;
    }

    User.findOne({ username })
        .then(foundUser => {
            if (foundUser) {
                res.status(400).json({ message: 'Username taken. Choose another one.' });
                return;
            }


        })

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const aNewUser = new User({
        username: username,
        password: hashPass
    });

    aNewUser.save()
        .then(() => {
            req.session.CurrentUser = aNewUser

            res.status(200).json(aNewUser)
                .catch(err => {
                    res.status(400).json({ message: 'Saving User to database went wrong' });
                })
                ;
        }).catch(err => {
            res.status(500).json({ message: "Username check went bad" })
        })
        ;

});



router.post('/auth/login', (req, res, next) => {
    const { username, password, campus, course } = req.body;
    User.create({
        username,
        password,
        campus,
        course,

    })
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.json(err);
        });
});


module.exports = router;