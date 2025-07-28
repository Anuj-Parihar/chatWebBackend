const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, messageController.createMessage);

module.exports = router;