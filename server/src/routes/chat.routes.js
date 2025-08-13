const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const supabaseAuth = require('../middleware/supabaseAuth');

router.post('/', supabaseAuth, chatController.handleChat);

module.exports = router;
