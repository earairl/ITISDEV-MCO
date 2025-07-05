const AuditLog = require('../models/AuditLog');

async function logAudit({editor, action, field, oldValue, newValue}) {
    console.log('Logging audit:', { editor, action, field, oldValue, newValue });
    try {
        await AuditLog.create({
            editor,
            action,
            field,
            oldValue,
            newValue,
        });
    } catch (error) {
        console.error("Error logging audit:", error)
    }
}
 
module.exports = logAudit;