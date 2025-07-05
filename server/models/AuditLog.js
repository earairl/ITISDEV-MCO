const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    editor: String,
    action: String,
    field: String, 
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now }
}, {collection: 'AuditLogs'});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);
module.exports = AuditLog;
