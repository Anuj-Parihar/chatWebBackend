const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/guest', authController.guestLogin);
router.get('/me', protect, authController.getMe);
router.get('/logout', protect, authController.logout);

module.exports = router;