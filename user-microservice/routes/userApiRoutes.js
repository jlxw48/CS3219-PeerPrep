const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.all('/jwt_validate', userController.jwt_validate);
router.post('/create_account', userController.create_account);
router.post('/user_login', userController.user_login);
router.post('/user_logout', userController.user_logout);
router.get('/status', userController.statusCheck);
router.get('/load', userController.load);

module.exports = router;