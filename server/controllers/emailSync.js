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

        const existingMember = await Member.findOne({
            email: newEmail,
            idNum: { $ne: idNum }
        });

        if (existingMember) {
            return {
                existingEmail: true,
                isMember: true,
                success: false,
                message: 'Email already exists.'
            };
        }

        member.email = newEmail;
        await member.save();
        return {
            existingEmail: false,
            isMember: true,
            success: true,
            message: 'Member email updated successfully.'
        };
    } catch (error) {
        console.error('Error syncing email to member:', error);
        return {
            isMember: false,
            success: false,
            message: 'Error updating member email',
            error
        };
    }
};

const getUsername = async (memberId) => {
    try {
        const user = await User.findOne({ 'credentials.userId': memberId });
        return user ? user.credentials.username : null;
    } catch (error) {
        console.error(`Error finding user by memberId ${memberId}:`, error);
        return null;
    }
};

module.exports = { updateUserEmail, updateMemberEmail, getUsername };