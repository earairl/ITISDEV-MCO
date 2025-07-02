const User = require('../models/User');
const { serverGetUser } = require('./user');
const bcrypt = require('bcrypt');

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': username });
        
        if (!user) {
            return res.status(400).json({ message: "Username doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.credentials.password); //compare plaintext password with hashed password
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const response = await serverGetUser(user._id);

        req.session.userid = user._id;
        req.session.remember = false;

        res.status(200).json({ message: 'Login successful', user: response.userInfo, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({ message: 'Session destroyed' });
    } catch (err) {
        console.error('Error destroying session: ', err);
        res.status(500).json({ error: err });
    }
};

module.exports = { loginUser, logoutUser };