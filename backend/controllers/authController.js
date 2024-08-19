// Desc: Controller for handling user authentication
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    console.log(req.body);
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Send the JWT token as a cookie
        res.cookie('token', token, {
            httpOnly: true, // Ensures the cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
            sameSite: 'Strict', // Prevents the cookie from being sent with cross-site requests
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        
        // Return success response
        res.status(200).json({ 
            message: 'Login successful', 
            token, 
            user: {name: user.name, email: user.email } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// controllers/authController.js

exports.logout = async (req, res) => {
    console.log("Inside logout");
    try {
        // Clear the JWT cookie
        res.clearCookie('token', {
            httpOnly: true, // Ensures the cookie is not accessible via JavaScript
            secure: process.env.NODE_ENV === 'production', // Ensures the cookie is sent over HTTPS in production
            sameSite: 'Strict', // Prevents the cookie from being sent with cross-site requests
        });

        return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

