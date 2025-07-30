// // import express from "express";
// import express from "express";
// import dotenv from "dotenv";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import Message from "./models/Message.js";

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/chat", chatRoutes);

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: { origin: "*" }
// });

// let onlineUsers = {};

// io.on("connection", (socket) => {
//   console.log("New user connected");

//   socket.on("joinRoom", ({ username, room }) => {
//     socket.join(room);
//     onlineUsers[socket.id] = { username, room };
//     io.to(room).emit("onlineUsers", Object.values(onlineUsers).filter(u => u.room === room));
//   });

//   socket.on("chatMessage", async ({ room, sender, message }) => {
//     const msg = await Message.create({ room, sender, message });
//     io.to(room).emit("chatMessage", msg);
//   });

//   socket.on("typing", ({ room, username }) => {
//     socket.broadcast.to(room).emit("typing", username);
//   });

//   socket.on("disconnect", () => {
//     const user = onlineUsers[socket.id];
//     if (user) {
//       delete onlineUsers[socket.id];
//       io.to(user.room).emit("onlineUsers", Object.values(onlineUsers).filter(u => u.room === user.room));
//     }
//     console.log("User disconnected");
//   });
// });

// server.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import Message from "./models/Message.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("joinRoom", async ({ username, room }) => {
    socket.join(room);
    onlineUsers[socket.id] = { username, room };

    // Send updated online users list
    io.to(room).emit(
      "onlineUsers",
      Object.values(onlineUsers).filter((u) => u.room === room)
    );

    // Send room chat history to the new user
    const history = await Message.find({ room }).sort({ createdAt: 1 });
    socket.emit("roomHistory", history);
  });

  socket.on("chatMessage", async ({ room, sender, message }) => {
    if (!room || !message.trim()) return;
    const msg = await Message.create({ room, sender, message });
    io.to(room).emit("chatMessage", msg);
  });

  socket.on("typing", ({ room, username }) => {
    socket.broadcast.to(room).emit("typing", username);
  });

  socket.on("disconnect", () => {
    const user = onlineUsers[socket.id];
    if (user) {
      delete onlineUsers[socket.id];
      io.to(user.room).emit(
        "onlineUsers",
        Object.values(onlineUsers).filter((u) => u.room === user.room)
      );
    }
    console.log("User disconnected:", socket.id);
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
