const express = require('express');
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { register } = require('../controllers/register');
const { loginUser, logoutUser } = require('../controllers/login');
const { getUser, updateEmail, deleteUser } = require('../controllers/user');
const { addMember, getMemberInfo, getMembers, updatePosition, updateMember, removeMember, importMembers, exportMembers } = require('../controllers/member');
const { updateMatchStatus, editMatch, joinMatch, leaveMatch, createMatch, getFormattedGame, getFormattedGames } = require('../controllers/match');
const { getUserNotifications } = require('../utils/notifications');

// GET
router.get('/', (req, res) => {
    res.json({msg: 'Welcome to ShuttleSync'})
})

// // GET single
// router.get('/:id', (req, res) => {
//     res.json({msg: 'Get Single Method'})
// })
router.get('/logout', logoutUser);
router.get('/getUser', getUser);
router.get('/getMemberInfo', getMemberInfo);
router.get('/getMembers', getMembers);
router.get('/getFormattedGame/:gameId', getFormattedGame);
router.get('/getFormattedGames', getFormattedGames);
router.get('/exportMembers', exportMembers);
router.get('/getNotifications/:userId', getUserNotifications);

// // POST
// router.post('/', (req, res) => {
//     res.json({msg: 'Post Method'})
// })
router.post('/register', register);
router.post('/login', loginUser);
router.post('/addMember', addMember);
router.post('/importMembers', upload.single("file"), importMembers);
router.post('/createMatch', createMatch);
router.post('/joinMatch', joinMatch);
router.post('/leaveMatch', leaveMatch);

// // DELETE
// router.delete('/:id', (req, res) => {
//     res.json({msg: 'Delete Method'})
// })
router.delete('/deleteUser/:username', deleteUser);
router.delete('/removeMember', removeMember);

// // UPDATE
// router.patch('/:id', (req, res) => {
//     res.json({msg: 'Update Method'})
// })
router.patch('/updatePosition', updatePosition);
router.put('/updateEmail', updateEmail);
router.patch('/updateMember', updateMember);
router.put('/editMatch', editMatch);
router.patch('/updateMatchStatus', updateMatchStatus);

module.exports = router;