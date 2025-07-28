const Message = require('../models/Message');
const Room = require('../models/Room');

// Create a new message
exports.createMessage = async (req, res, next) => {
  try {
    const { content, roomId } = req.body;

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    // Create message
    const message = await Message.create({
      content,
      sender: req.user.id,
      room: roomId
    });

    // Populate sender info
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username')
      .exec();

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (err) {
    next(err);
  }
};