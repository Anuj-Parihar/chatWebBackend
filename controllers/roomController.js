const Room = require('../models/Room');
const Message = require('../models/Message');
const User = require('../models/User');

// Create a new room
exports.createRoom = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Check if room already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        error: 'Room with this name already exists'
      });
    }

    // Create new room
    const room = await Room.create({
      name,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: room
    });
  } catch (err) {
    next(err);
  }
};

// Get all rooms
exports.getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (err) {
    next(err);
  }
};

// Get room by ID
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (err) {
    next(err);
  }
};

// Get room messages
exports.getRoomMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ room: req.params.roomId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username')
      .exec();

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages.reverse() // Show oldest first
    });
  } catch (err) {
    next(err);
  }
};

// Get online users in a room
exports.getOnlineUsers = async (req, res, next) => {
  try {
    // This will be populated by socket.io
    res.status(200).json({
      success: true,
      data: []
    });
  } catch (err) {
    next(err);
  }
};