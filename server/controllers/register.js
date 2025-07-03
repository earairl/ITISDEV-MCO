const User = require('../models/User');
const { serverGetUser } = require('./user');
const { serverGetMemberInfo } = require('./member');

const generateUserId = async (requestedId) => {
    // If no userId (school id) supplied due to being a non-member, then generate a unique one.
    let candidate;
    let exists = true;

    do {
        candidate = (Math.floor(20000000 + Math.random() * 80000000)).toString(); // 8-digit number between 20000000 and 99999999
        exists = await User.exists({ 'credentials.userId': candidate });
    } while (exists);

    return candidate;
};

const register = async (req, res) => {
    const { userId, username, email, password, activeIdInp } = req.body;

    try {
        let finalUserId;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email validation regex
        const existingUsername = await User.findOne({ 'credentials.username': username });
        const existingEmail = await User.findOne({ 'credentials.email': email });
        const existingUserId = await User.exists({ 'credentials.userId': userId });
        
        if (existingUsername) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        if (!emailRegex.test(email)) { //if email does not match regex pattern, return status.
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (existingEmail) {
            return res.status(400).json({ message: 'Email already taken.' });
        }

        if (activeIdInp) {
            const result = await serverGetMemberInfo(userId);
            if (result && !result.memberInfo) {
                return res.status(400).json({ message: 'ID number is not registered. Please contact your officers for clarifications.' });
            }
        }

        if (existingUserId) {
            return res.status(400).json({ message: 'The ID number is already in use. Please provide another one.' });
        }

        finalUserId = userId;
        if (!userId){
            finalUserId = await generateUserId(userId);
        }

        const newUser = new User({
            credentials: {
                userId : finalUserId,
                username: username,
                email: email,
                password: password
            }
        });
        
        await newUser.save(); // password is hashed automatically by the pre-save hook in User model

        const response = await serverGetUser(newUser._id);
        req.session.userid = newUser._id;
        req.session.remember = false;

        res.status(201).json({ message: 'User registered successfully!', user: response.userInfo, success: true });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user: ' + error.message });
    }
};

module.exports = { register };
