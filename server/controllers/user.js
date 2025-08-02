const User = require('../models/User');
const { serverLeaveMatches } = require('../utils//matchUtils');
const { serverGetMemberInfo } = require('./member');
const { updateMemberEmail } = require('./emailSync');

const serverGetUser = async (userId) => {
    try {
        const user = await User.findById(userId).populate('currentlyQueued matchHistory');
        const userInfo = {
            username: user.credentials.username,
            email: user.credentials.email,
            attendanceRate: user.attendanceRate, 
            penalties: user.penalties,
            currentlyQueued: user.currentlyQueued,
            matchHistory: user.matchHistory,
        };

        const result = await serverGetMemberInfo(user.credentials.userId);

        if (result && result.memberInfo) {
            userInfo.position = result.memberInfo.position;
            userInfo.dateJoined = result.memberInfo.dateJoined;
            userInfo.idNum = result.memberInfo.idNum;
        } else {
            userInfo.position = 'non-member'
            userInfo.idNum = null
        }

        return { success: true, userInfo };
    } catch (error) {
        console.log('Error in getting user (server side): ', error);
        return { success: false };
    }
};

const getUser = async (req, res) => {
    const { username } = req.query;
    try {
        const user = await User.findOne({ 'credentials.username': username });
        if (!user) 
            res.status(404).json({ message: 'User not found' });

        const result = await serverGetUser(user._id);
        if (result.success) 
            res.status(200).json({ userInfo: result.userInfo });
        else 
            res.status(500).json({ message: 'Error in getting user: ' });
    } catch (error) {
        console.log('Error in getting user (client side): ', error);
        res.status(500).json({ message: 'Error in getting user: ', error });
    }
};

const updateEmail = async (req, res) => {
    const { username, newEmail } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': username });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const currentEmail = user.credentials.email;
        if (currentEmail === newEmail) {
            return res.status(200).json({ message: 'No changes made. Email is the same.' });
        }

        const existingUser = await User.findOne({
            'credentials.email': newEmail,
            'credentials.username': { $ne: username }
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        user.credentials.email = newEmail;
        const isMember = await updateMemberEmail(user.credentials.userId, newEmail);
        if (isMember.success) {
            console.log("Email updated successfully (Member Schema).");
        } else if (isMember.existingEmail){
            return res.status(409).json({ message: 'Email already exists.' });
        }

        await user.save();
        return res.status(200).json({ message: 'Email updated successfully!' });

    } catch (error) {
        console.error('Error updating email:', error);
        return res.status(500).json({ message: 'Error editing email', error });
    }
};

const deleteUser = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const user = await User.findOne({ 'credentials.username': username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.credentials.userId = `[deleted]_${user._id}`;
        user.credentials.username = `[deleted]_${user._id}`;
        user.credentials.email = `[deleted]_${user._id}`;
        user.credentials.password = user._id;
        user.deleted = true;
        
        await serverLeaveMatches(user._id)

        user.currentlyQueued = [];
        await user.save();

        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = { serverGetUser, getUser, updateEmail, deleteUser };