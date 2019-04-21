const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('./../../middleware/auth');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../../models/User');

router.post('/', (req, res) => {
    // Get data from request
    const { email, password } = req.body;

    // Check if all fields have data
    if (!email || !password) return res.status(400).json({ msg: 'Please enter all fields' });

    // Search db for user
    User.findOne({ email })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User does not exist' });

            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })

                    jwt.sign(
                        { id: user._id },
                        process.env.JWT_SECRET,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;
                            res.json({
                                token,
                                user: {
                                    _id: user._id,
                                    name: user.name,
                                    email: user.email,
                                }
                            });
                        }
                    )
                })
        });
});

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user));
});

module.exports = router;
