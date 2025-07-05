const User = require('../models/User');
const { serverGetMemberInfo } = require('./member');

const serverGetUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        const userInfo = {
            username: user.credentials.username,
            email: user.credentials.email,
            attendanceRate: user.attendanceRate, 
            penalties: user.penalties
        };

        console.log('user info: ', user);

        const result = await serverGetMemberInfo(user.credentials.userId);
        console.log('user info: ', result.memberInfo);
        if (result && result.memberInfo) {
            userInfo.position = result.memberInfo.position;
            userInfo.dateJoined = result.memberInfo.dateJoined;
            userInfo.idNum = result.memberInfo.idNum;
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

        user.credentials.email = newEmail;
        await user.save();
        
        res.status(200).json({ message: 'Email updated successfully!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error editing email', error });
    }
};

const deleteUser = async(req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ 'credentials.username': username });

        user.credentials.username = `[deleted]_${user._id}`;
        user.credentials.email = null;
        user.credentials.password = null;
        user.deleted = true;

        await user.save();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

module.exports = { serverGetUser, getUser, updateEmail, deleteUser };