const User = require('../models/User');

const generateUserId = async (requestedId) => {
    // If no userId (school id) supplied due to being a non-member, then generate a unique one.
    let candidate;
    let exists = true;

    do {
        candidate = (Math.floor(10000000 + Math.random() * 90000000)).toString(); // returns an 8-digit number.
        exists = await User.exists({ 'credentials.userId': candidate });
    } while (exists);

    return candidate;
};

const register = async (req, res) => {
    const { userId, username, email, password } = req.body;

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

        if (existingUserId) {
            return res.status(400).json({ message: 'The userId is already in use. Please provide another one.' });
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

        const user = await User.findOne({ 'credentials.username': username });
        req.session.userid = user._id;
        req.session.remember = false;

        const userInfo = {
            username: newUser.credentials.username
        };

        res.status(201).json({ message: 'User registered successfully!', user: userInfo, success: true, userId: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user: ' + error.message });
    }
};

module.exports = { register };
