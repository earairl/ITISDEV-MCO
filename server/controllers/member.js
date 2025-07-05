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

const serverGetMemberInfo = async (idNum) => {
    try {
        console.log('member id: ', idNum);
        const member = await Member.findOne({ 'idNum': idNum });

        console.log('member info: ', member);

        const memberInfo = member
        ? {
            idNum: member.idNum,
            firstName: member.firstName,
            lastName: member.lastName,
            college: member.college,
            position: member.position, 
            dateJoined: member.dateJoined,
            lastMatchJoined: member.lastMatchJoined,
            isActive: member.isActive
        } 
        : null;

        return { success: true, memberInfo };
    } catch (error) {
        console.log('Error in getting member info (server side): ', error);
        return { success: false };
    }
}

const getMemberInfo = async (req, res) => {
    const { idNum } = req.body;
    try {
        const result = await serverGetMemberInfo(idNum);
        if (result.success) 
            res.status(200).json({ memberInfo: result.memberInfo });
        else 
            res.status(500).json({ message: 'Error in getting member: ' });
    } catch (error) {
        console.log('Error in getting member (client side): ', error);
        res.status(500).json({ message: 'Error in getting member (client side): ', error });
    }
};

const getMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const setMemberInactive = async(req, res) => {
    const { idNum } = req.body;

    try {
        const member = await Member.findOne({ 'idNum': idNum });
        member.isActive = false;
        await member.save();
        res.status(200).json({ message: 'Member set to inactive successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to set the member as inactive:', error });
    }
};

const updatePosition = async (req, res) => {
    const { idNum, position } = req.body;
    try {
        const member = await Member.findOne({ idNum });
        if (!member) {
            return res.status(404).json({ message: 'Member not found.' });
        }
        member.position = position;
        await member.save();
        res.status(200).json({ message: 'Position updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating position: ' + error.message });
    }
}

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

module.exports = { addMember, serverGetMemberInfo, getMemberInfo, getMembers, setMemberInactive, updatePosition, removeMember};