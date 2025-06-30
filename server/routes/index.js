const express = require('express');
const router = express.Router();
const { register } = require('../controllers/register');

// GET
router.get('/', (req, res) => {
    res.json({msg: 'Welcome to ShuttleSync'})
})

// // GET single
// router.get('/:id', (req, res) => {
//     res.json({msg: 'Get Single Method'})
// })

// // POST
// router.post('/', (req, res) => {
//     res.json({msg: 'Post Method'})
// })
router.post('/register', register);

// // DELETE
// router.delete('/:id', (req, res) => {
//     res.json({msg: 'Delete Method'})
// })

// // UPDATE
// router.patch('/:id', (req, res) => {
//     res.json({msg: 'Update Method'})
// })

module.exports = router;