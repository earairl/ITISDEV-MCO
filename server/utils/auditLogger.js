const AuditLog = require('../models/AuditLog');

async function logAudit({editor, action, changes}) {
    try {
        const filteredChanges = changes.filter(({oldValue, newValue }) => {
            return oldValue!== newValue;;
        });
        
        if (filteredChanges.length === 0) {
            console.log('No changes to log');
            return;
        }
     
        console.log('Logging audit:', { editor, action, changes: filteredChanges });

        await AuditLog.create({
            editor,
            action,
            changes: filteredChanges
        });
    } catch (error) {
        console.error("Error logging audit:", error)
    }
}
 
module.exports = logAudit;