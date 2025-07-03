const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { getUserIdByUsername } = require("../controllers/user");

router.get("/userId/:username", getUserIdByUsername); // Get user info by username

module.exports = router;
