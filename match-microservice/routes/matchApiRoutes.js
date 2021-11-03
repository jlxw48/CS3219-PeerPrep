const express = require('express');
const matchController = require('../controllers/matchController');

const router = express.Router();

router.get('/status', matchController.statusCheck);
router.get('/interviews', matchController.interviewsCount);
router.get('/get_interview', matchController.getInterview);
router.post('/start_find', matchController.findMatch);
router.delete('/end_interview', matchController.endInterview);
router.delete('/stop_find', matchController.cancelFindMatch);

// Export API routes
module.exports = router;