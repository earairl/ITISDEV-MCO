const User = require('../models/User');

const generateUserId = async (requestedId) => {
    // no userId (school id) supplied due to being a non-member, then generate a unique one.
    let candidate;
    let exists = true;

    do {
        candidate = (Math.floor(10000000 + Math.random() * 90000000)).toString(); // returns an 8-digit number.
        exists = await User.exists({ 'credentials.userId': candidate });
    } while (exists);

    return candidate;
};

const register = async (req, res) => {
    const { userId, username, email, password, confirmPassword } = req.body;

    try {
        let finalUserId;
        const existingUser = await User.findOne({ 'credentials.username': username });
        const idAlreadyUsed = await User.exists({ 'credentials.userId': userId });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        if (password != confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match. Please ensure both fields are identical.' });
        }

        if (idAlreadyUsed) {
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

        res.status(201).json({ message: 'User registered successfully!', user: userInfo });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user: ' + error.message });
    }
};

module.exports = { register };