const User = require('../models/User');

const signupUser = async (req, res) => {
    const { userId, username, email, password, confirmPassword } = req.body;

    try {
        const existingUser = await User.findOne({ 'credentials.username': username });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        if (password != confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match. Please ensure both fields are identical.' });
        }

        const newUser = new User({
            credentials: {
                userId : userId,
                username: username,
                email: email,
                password: password
            }
        });
        await newUser.save();

        const userInfo = {
            username: newUser.credentials.username
        };

        res.status(201).json({ message: 'User registered successfully!', user: userInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user: ' + error.message });
    }
};

module.exports = { register };