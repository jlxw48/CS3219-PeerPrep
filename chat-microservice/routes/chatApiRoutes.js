const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/status', chatController.statusCheck);
router.post('/new_message', chatController.new_message);
router.get('/get_messages/:interviewId', chatController.get_messages);

// Export API routes
module.exports = router;