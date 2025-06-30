const User = require('../models/User');
const { serverGetUser } = require('./user');

function checkPassword(inputPassword, userPassword) {
    if (inputPassword === userPassword) 
        return true;
    return false;
}

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': username });
        
        if (!user) {
            return res.status(400).json({ message: "Username doesn't exist" });
        }

        if (!checkPassword(password, user.credentials.password)) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        const response = await serverGetUser(user._id);

        res.status(200).json({ message: 'Login successful', user: response.userInfo });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = (req, res) => {
};

module.exports = { loginUser, logoutUser };