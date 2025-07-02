const Member = require('../models/Member');

const addMember = async (req, res) => {
    const { idNum, firstName, lastName, college, position, dateJoined } = req.body;

    try {
        const existingMember = await User.findOne({ 'credentials.idNum': idNum });
        
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

        res.status(201).json({ message: 'Member registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user: ' + error.message });
    }
};

module.exports = { addMember };