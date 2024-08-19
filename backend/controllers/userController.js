// controllers/userController.js
const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        const email = req.user.email; // Extract email from the JWT payload
        const user = await User.findOne({ email }).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body; // Extract name and email from the request body
        const currentEmail = req.user.email; // Extract the current email from the JWT payload

        if (!name && !email) {
            return res.status(400).json({ message: 'Name or email must be provided' });
        }

        // Prepare the update object
        const updateFields = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;

        // Check if email is being updated
        if (email) {
            // Ensure new email is not already taken
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already in use' });
            }
        }

        // Update user profile
        const updatedUser = await User.findOneAndUpdate(
            { email: currentEmail }, // Find user by current email
            updateFields, // Fields to update
            { new: true, runValidators: true } // Return updated user and run validators
        ).select('-password'); // Exclude password from response

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.deleteProfile = async (req, res) => {
    try {
        const email = req.user.email; // Extract email from the JWT payload
        
        // Delete user profile
        const deletedUser = await User.findOneAndDelete({ email });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};