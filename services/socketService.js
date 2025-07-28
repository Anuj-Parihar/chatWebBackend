const Message = require('../models/Message');
const User = require('../models/User');

module.exports = (io) => {
  // Store online users by room
  const onlineUsers = {};

  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`);

    // Join a room
    socket.on('joinRoom', async ({ roomId, userId }) => {
      try {
        // Leave all rooms first
        socket.rooms.forEach(room => {
          if (room !== socket.id) {
            socket.leave(room);
            
            // Remove user from online users in that room
            if (onlineUsers[room]) {
              onlineUsers[room] = onlineUsers[room].filter(user => user.id !== userId);
              io.to(room).emit('onlineUsers', onlineUsers[room]);
            }
          }
        });

        // Join the new room
        socket.join(roomId);

        // Add user to online users in this room
        const user = await User.findById(userId).select('username');
        
        if (!onlineUsers[roomId]) {
          onlineUsers[roomId] = [];
        }
        
        if (!onlineUsers[roomId].some(u => u.id === userId)) {
          onlineUsers[roomId].push({
            id: userId,
            username: user.username
          });
        }

        // Update online users for everyone in the room
        io.to(roomId).emit('onlineUsers', onlineUsers[roomId]);

        // Load previous messages
        const messages = await Message.find({ room: roomId })
          .sort({ createdAt: -1 })
          .limit(50)
          .populate('sender', 'username')
          .exec();

        socket.emit('previousMessages', messages.reverse());

        console.log(`User ${userId} joined room ${roomId}`);
      } catch (err) {
        console.error('Error joining room:', err);
      }
    });

    // Send a message
    socket.on('sendMessage', async ({ roomId, userId, content }) => {
      try {
        if (!content.trim()) return;

        // Create and save message
        const message = await Message.create({
          content,
          sender: userId,
          room: roomId
        });

        // Populate sender info
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', 'username')
          .exec();

        // Broadcast to room
        io.to(roomId).emit('newMessage', populatedMessage);
      } catch (err) {
        console.error('Error sending message:', err);
      }
    });

    // Typing indicator
    socket.on('typing', ({ roomId, userId, isTyping }) => {
      socket.to(roomId).emit('typing', { userId, isTyping });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);

      // Remove user from all rooms' online users
      Object.keys(onlineUsers).forEach(roomId => {
        onlineUsers[roomId] = onlineUsers[roomId].filter(user => {
          if (user.id === socket.userId) {
            io.to(roomId).emit('userLeft', user);
            return false;
          }
          return true;
        });
        
        io.to(roomId).emit('onlineUsers', onlineUsers[roomId]);
      });
    });
  });
};