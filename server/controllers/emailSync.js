const User = require('../models/User');
const Member = require('../models/Member');

const updateUserEmail = async (idNum, newEmail) => {
    try {
        const user = await User.findOne({ 'credentials.userId': idNum });
        if (!user) return { isUser: false };

        user.credentials.email = newEmail;
        await user.save();
        return { isUser: true };
    } catch (error) {
        console.error('Error syncing email to user:', error);
        return { success: false, message: 'Error updating user email', error };
    }
};

const updateMemberEmail = async (idNum, newEmail) => {
    try {
        const member = await Member.findOne({ idNum });
        if (!member) return { isMember: false };

        member.email = newEmail;
        await member.save();
        return { isMember: true };
    } catch (error) {
        console.error('Error syncing email to member:', error);
        return { success: false, message: 'Error updating member email', error };
    }
};

module.exports = { updateUserEmail, updateMemberEmail };