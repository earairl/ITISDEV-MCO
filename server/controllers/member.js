const Member = require('../models/Member');
const logAudit = require('../utils/auditLogger');

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

const updatePosition = async (req, res) => {
    const { idNum, position } = req.body;
    const editor = req.session.user;

    try {
        const member = await Member.findOne({ idNum });
        if (!member) {
            return res.status(404).json({ message: 'Member not found.' });
        }

        if(member.position !== position) {
            await logAudit({
                editor,
                action: "updatePosition",
                field: "position",
                oldValue: member.position,
                newValue: position
            })
        }
        member.position = position;
        await member.save();
        res.status(200).json({ message: 'Position updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating position: ' + error.message });
    }
}

const updateMember = async (req, res) => {
    const { idNum, newFirstName, newLastName,
        newCollege, newPosition, newDateJoined,
        newLastMatchJoined, isActive } = req.body;

    const editor = req.session?.username || 'test-user';
    const changes = [];
    
    try {
        const member = await Member.findOne({ idNum });
        const parsedNewDateJoined = new Date(newDateJoined);
        const parsedNewLastMatchJoined = new Date(newLastMatchJoined);

        if (!member) {
            return res.status(404).json({ message: 'Member not found.' });
        }

        let updated = false;

        if (newFirstName && member.firstName !== newFirstName) {
            changes.push({ field: "firstName", oldValue: member.firstName, newValue: newFirstName });
            member.firstName = newFirstName;
            updated = true;
        }

        if (newLastName && member.lastName !== newLastName) {
            changes.push({ field: "lastName", oldValue: member.lastName, newValue: newLastName });
            member.lastName = newLastName;
            updated = true;
        }

        if (newCollege && member.college !== newCollege) {
            changes.push({ field: "college", oldValue: member.college, newValue: newCollege });
            member.college = newCollege;
            updated = true;
        }

        if (newPosition && ['member', 'officer'].includes(newPosition) && member.position !== newPosition) {
            changes.push({ field: "position", oldValue: member.position, newValue: newPosition });
            member.position = newPosition;
            updated = true;
        }

        if (newDateJoined && member.dateJoined.getTime() !== parsedNewDateJoined.getTime()) {
            changes.push({ field: "dateJoined", oldValue: member.dateJoined, newValue: newDateJoined });
            member.dateJoined = new Date(newDateJoined);
            updated = true;
        }

        if (newLastMatchJoined && member.lastMatchJoined.getTime() !== parsedNewLastMatchJoined.getTime()) {
            changes.push({ field: "lastMatchJoined", oldValue: member.lastMatchJoined, newValue: newLastMatchJoined });
            member.lastMatchJoined = new Date(newLastMatchJoined);
            updated = true;
        }

        if (typeof isActive === "boolean" && member.isActive !== isActive) {
            changes.push({ field: "isActive", oldValue: member.isActive, newValue: isActive });
            member.isActive = isActive;
            updated = true;
        }

        if (!updated) {
            return res.status(400).json({ message: 'No valid or changed data was provided.' });
        }

        await member.save();

        await logAudit({
            editor,
            action: "updateMember",
            changes
        });

        res.status(200).json({ message: 'Member updated successfully' });
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ message: 'Server error', error });
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

module.exports = { addMember, serverGetMemberInfo, getMemberInfo, getMembers, updatePosition, updateMember, removeMember};