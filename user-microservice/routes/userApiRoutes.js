const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/create_account', userController.create_account);
router.post('/user_login', userController.user_login);
router.post('/user_logout', userController.user_logout);

module.exports = router;