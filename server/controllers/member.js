const Member = require('../models/Member');
const User = require('../models/User');
const { updateUserEmail, getUsername } = require('./emailSync');
const logAudit = require('../utils/auditLogger');
const ExcelJS = require("exceljs");
const { createNotification } = require('../services/notifications');

const addMember = async (req, res) => {
    try {
        const {
            idNum, firstName, lastName, contactNo, email, fbLink, telegram,
            college, position, dateJoined
        } = req.body;

        if (!idNum || !firstName || !lastName || !contactNo || !email || !fbLink || !college) {
            return res.status(400).json({ message: 'Please fill out all required fields.' });
        }

        if (position && !['member', 'officer'].includes(position)) {
            return res.status(400).json({ message: 'Invalid position value.' });
        }

        const existing = await Member.findOne({ idNum });
        if (existing) {
            return res.status(409).json({ message: 'A member with this ID number already exists.' });
        }

        const newMember = new Member({
            idNum,
            firstName,
            lastName,
            contactNo,
            email,
            fbLink,
            telegram,
            college,
            position: position || 'member',
            dateJoined: dateJoined ? new Date(dateJoined) : new Date(),
        });

        await newMember.save();
        res.status(201).json({ message: 'Member successfully added.' });
    } catch (error) {
        console.error('Add Member Error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

const serverGetMemberInfo = async (idNum) => {
    try {
        const member = await Member.findOne({ 'idNum': idNum });

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

        const enrichedMembers = await Promise.all(
            members.map(async (member) => {
                const memberObj = member.toObject();
                const username = await getUsername(member.idNum);
                if (username) {
                    memberObj.username = username;
                }
                return memberObj;
            })
        );

        res.json(enrichedMembers);
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

        const oldPosition = member.position;

        if(member.position !== position) {
            await logAudit({
                editor,
                action: "updatePosition",
                changes: [{
                    field: "position",
                    oldValue: member.position,
                    newValue: position
                }]
            })

            const user = await User.findOne({ 'credentials.userId': idNum });
            if (user) {
                const isPromotion = (oldPosition === 'member' && position === 'officer');
                const isDemotion = (oldPosition === 'officer' && position === 'member');
                
                let title, message;
                
                if (isPromotion) {
                    title = 'Congratulations! You\'ve been promoted!';
                    message = `You have been promoted from ${oldPosition} to ${position}. Welcome to the officer team!`;
                } else if (isDemotion) {
                    title = 'Position Updated';
                    message = `Your position has been changed from ${oldPosition} to ${position}.`;
                } else {
                    title = 'Position Updated';
                    message = `Your position has been updated from ${oldPosition} to ${position}.`;
                }

                await createNotification(
                    user._id,
                    'position_change',
                    title,
                    message,
                    { 
                        oldPosition,
                        newPosition: position,
                        isPromotion,
                        isDemotion
                    }
                );
            }
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
        newLastMatchJoined, isActive,
        newContactNo, newEmail, newFbLink, newTelegram
    } = req.body;

    const editor = req.session?.username || 'test-user';
    const changes = [];
    
    try {
        const member = await Member.findOne({ idNum });
        const parsedNewDateJoined = new Date(newDateJoined);
        const parsedNewLastMatchJoined = new Date(newLastMatchJoined);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!member) {
            return res.status(404).json({ message: 'Member not found.' });
        }

        let updated = false;

        if (newPosition && ['member', 'officer'].includes(newPosition) && member.position !== newPosition) {
            changes.push({ field: "position", oldValue: member.position, newValue: newPosition });
            
            // Add notification logic for position change
            const user = await User.findOne({ 'credentials.userId': idNum });
            if (user) {
                const isPromotion = (member.position === 'member' && newPosition === 'officer');
                const isDemotion = (member.position === 'officer' && newPosition === 'member');
                
                let title, message;
                
                if (isPromotion) {
                    title = 'Congratulations! You\'ve been promoted!';
                    message = `You have been promoted from ${member.position} to ${newPosition}. Welcome to the officer team!`;
                } else if (isDemotion) {
                    title = 'Position Updated';
                    message = `Your position has been changed from ${member.position} to ${newPosition}.`;
                } else {
                    title = 'Position Updated';
                    message = `Your position has been updated from ${member.position} to ${newPosition}.`;
                }

                await createNotification(
                    user._id,
                    'position_change',
                    title,
                    message,
                    { 
                        oldPosition: member.position,
                        newPosition,
                        isPromotion,
                        isDemotion
                    }
                );
            }
            
            member.position = newPosition;
            updated = true;
        }
        
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

        if (newContactNo && member.contactNo !== newContactNo) {
            changes.push({ field: "contactNo", oldValue: member.contactNo, newValue: newContactNo });
            member.contactNo = newContactNo;
            updated = true;
        }

        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (newEmail && member.email !== newEmail) {
            changes.push({ field: "email", oldValue: member.email, newValue: newEmail });
            member.email = newEmail;

            const isUser = await updateUserEmail(idNum, newEmail);
            if(isUser.isUser)
                console.log("Email updated successfully (User Schema).");
            updated = true;
        }

        if (newFbLink && member.fbLink !== newFbLink) {
            changes.push({ field: "fbLink", oldValue: member.fbLink, newValue: newFbLink });
            member.fbLink = newFbLink;
            updated = true;
        }

        if (newTelegram !== undefined && member.telegram !== newTelegram) {
            changes.push({ field: "telegram", oldValue: member.telegram, newValue: newTelegram });
            member.telegram = newTelegram;
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

const importMembers = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        const worksheet = workbook.worksheets[0]; 
        // get all rows from excel sheet as array of arrays, remove first header row, remove any empty rows
        const rows = worksheet.getSheetValues().slice(2).filter(row => {
            return row && row.some(cell => cell !== null && cell !== undefined && cell !== "");
        });

        //normalizes excel js format into plain string 
        const getValue = (cell) => {
            if (!cell) return "";

            const value = cell.value ?? cell; 

            if (typeof value !== "object") return String(value);

            if (Array.isArray(value.richText)) {
                return value.richText.map(rt => rt.text || "").join("");
            }

            if (value.text) return value.text;
            if (value.result !== undefined) return String(value.result); 
            if (value.hyperlink && value.text) return value.text;

            return "";
        };

        const created = [];
        const skipped = [];

        for (const row of rows) {
            if (!row) continue;

            const idNum = getValue(row[1]);
            const firstName = getValue(row[2]);
            const lastName = getValue(row[3]);
            const college = getValue(row[4]);
            const position = getValue(row[5]);
            let contactNo = getValue(row[6]);
            if (/^[9]\d{9}$/.test(contactNo)) {
                contactNo = "0" + contactNo;
            }
            const email = getValue(row[7]);   
            const fbLink = getValue(row[8]);  
            const telegram = getValue(row[9]);
            const dateJoined = row[10]; 
            const lastMatchJoined = row[11];
            const status = getValue(row[12]);

            if (!idNum || !firstName || !lastName || !college || !position || !fbLink || !email || !contactNo) {
                if (idNum) { 
                    skipped.push({ idNum, reason: "Missing required fields." });
                }
                continue;
            }

            if (!['member', 'officer'].includes(position)) {
                skipped.push({ idNum, reason: "Invalid position value." });
                continue;
            }

            const exists = await Member.findOne({ idNum });
            if (exists) {
                skipped.push({ idNum, reason: 'ID number already exists.' });
                continue;
            }

            // convert status to boolean
            const isActive = status?.toLowerCase() === "active";

            const newMember = new Member({
                idNum,
                firstName,
                lastName,
                contactNo,
                email,
                fbLink,
                telegram,
                college,
                position,
                dateJoined: dateJoined ? new Date(dateJoined) : new Date(),
                lastMatchJoined: lastMatchJoined ? new Date(lastMatchJoined) : new Date(),
                isActive
            });

            await newMember.save();
            created.push(newMember);
        }

        return res.status(200).json({
            message: "Import completed",
            createdCount: created.length,
            skippedCount: skipped.length
        });
    } catch(err) {
        console.error("Import error: ", err);
        return res.status(500).json({ message: "Error importing members."});
    }
};

const exportMembers = async (req, res) => {
    try {
        const members = await Member.find().lean();

        if (!members.length) {
            return res.status(404).json({ message: 'No members to export.' });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Members');

        worksheet.columns = [
            { header: 'ID Number', key: 'idNum' },
            { header: 'First Name', key: 'firstName' },
            { header: 'Last Name', key: 'lastName' },
            { header: 'College', key: 'college' },
            { header: 'Position', key: 'position' },
            { header: 'Contact No', key: 'contactNo' },
            { header: 'Email', key: 'email' },
            { header: 'Facebook', key: 'fbLink' },
            { header: 'Telegram', key: 'telegram' },
            { header: 'Date Joined', key: 'dateJoined' },
            { header: 'Last Match Joined', key: 'lastMatchJoined' },
            { header: 'Status', key: 'isActive' }
        ];

        members.forEach(member => {
            worksheet.addRow({
                idNum: member.idNum,
                firstName: member.firstName,
                lastName: member.lastName,
                college: member.college,
                position: member.position,
                contactNo: member.contactNo,
                email: member.email,
                fbLink: member.fbLink,
                telegram: member.telegram,
                dateJoined: member.dateJoined
                    ? new Date(member.dateJoined).toISOString().split("T")[0]
                    : "",
                lastMatchJoined: member.lastMatchJoined
                    ? new Date(member.lastMatchJoined).toISOString().split("T")[0]
                    : "",
                isActive: member.isActive ? "Active" : "Inactive",        
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=members_${new Date().toISOString().split("T")[0]}.xlsx`
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.send(buffer);
    } catch (error) {
        console.error("Error exporting members:", error);
        res.status(500).json({ message: "Server error. Failed to export members." });
    }
};

module.exports = { addMember, serverGetMemberInfo, getMemberInfo, getMembers, updatePosition, updateMember, removeMember, importMembers, exportMembers};