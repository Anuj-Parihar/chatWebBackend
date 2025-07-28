const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { protect } = require('../middlewares/auth');

router.post('/', protect, roomController.createRoom);
router.get('/', protect, roomController.getRooms);
router.get('/:id', protect, roomController.getRoom);
router.get('/:roomId/messages', protect, roomController.getRoomMessages);
router.get('/:roomId/users', protect, roomController.getOnlineUsers);

module.exports = router;