const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { getMemberInfoByIdNum } = require('../controllers/member');

// get member info by ID number 
router.get('/by-idnum/:idNum', getMemberInfoByIdNum);

module.exports = router;