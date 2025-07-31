// import Message from "../models/Message.js";

// export const getRoomMessages = async (req, res) => {
//   try {
//     const { room } = req.params;
//     const messages = await Message.find({ room }).sort({ createdAt: 1 });
//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// import Room from "../models/Room.js";
// import Message from "../models/Message.js";

// // Get all rooms
// export const getRooms = async (req, res) => {
//   try {
//     const rooms = await Room.find();
//     res.json(rooms);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Create a new room
// export const createRoom = async (req, res) => {
//   try {
//     const { name } = req.body;
//     if (!name) return res.status(400).json({ message: "Room name required" });

//     const roomExists = await Room.findOne({ name });
//     if (roomExists) return res.status(400).json({ message: "Room already exists" });

//     const room = await Room.create({ name });
//     res.status(201).json(room);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get chat messages for a room
// export const getRoomMessages = async (req, res) => {
//   try {
//     const { room } = req.params;
//     const messages = await Message.find({ room }).sort({ createdAt: 1 });
//     res.json(messages);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


import Room from "../models/Room.js";
import Message from "../models/Message.js";

// Get all rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name.trim()) return res.status(400).json({ message: "Room name is required" });

    const roomExists = await Room.findOne({ name });
    if (roomExists) return res.status(400).json({ message: "Room already exists" });

    const room = await Room.create({ name });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: "Error creating room" });
  }
};

// Get chat messages for a room
export const getRoomMessages = async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await Message.find({ room }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages" });
  }
};
