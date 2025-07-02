const Member = require('../models/Member');

const addMember = async (req, res) => {
    const { idNum, firstName, lastName, college, position, dateJoined } = req.body;

    try {
        const existingMember = await Member.findOne({ 'idNum': idNum });
        
        if (existingMember) {
            return res.status(400).json({ message: 'ID number already taken.' });
        }

        if (!['member', 'officer'].includes(position.toLowerCase())) {
            return res.status(400).json({ message: 'The chosen position must either be a member or an officer.' });
        }

        const newMember = new Member({
            idNum : idNum,
            firstName: firstName,
            lastName: lastName,
            college: college,
            position: position, 
            dateJoined: dateJoined
        });
        await newMember.save();

        res.status(201).json({ message: 'Member added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding member: ' + error.message });
    }
};

const getMemberInfo = async (req, res) => {
    const { idNum } = req.body;
    try {
        const member = await Member.findOne({ 'idNum': idNum });
        const memberInfo = {
            idNum : member.idNum,
            firstName: member.firstName,
            lastName: member.lastName,
            college: member.college,
            position: member.position, 
            dateJoined: member.dateJoined,
            lastMatchJoined: member.lastMatchJoined,
            isActive: member.isActive
        };

        res.status(200).json({ memberInfo: memberInfo });
    } catch (error) {
        console.log('Error in getting member info: ', error);
        res.status(500).json({ message: 'Error in getting member info: ', error });
    }
};

const setMemberInactive = async(req, res) => {
    const { idNum } = req.body;

    try {
        const member = await Member.findOne({ 'idNum': idNum });
        member.isActive = false;
        await member.save();
        res.status(200).json({ message: 'Member set as inactive successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error setting member as inactive', error });
    }
};

const removeMember = async (req, res) => {
    const { idNum } = req.body;         

    try {
        const deletedMember = await Member.findOneAndDelete({ idNum });

        if (!deletedMember) {
            return res.status(404).json({ message: 'Member not found.' });
        }

        res.status(200).json({ message: 'Member removed successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error removing member: ' + error.message });
    }
};

module.exports = { addMember, getMemberInfo, setMemberInactive, removeMember };