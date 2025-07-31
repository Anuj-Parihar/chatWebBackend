// import express from "express";
// import { getRoomMessages } from "../controllers/chatController.js";
// import { protect } from "../middlewares/authMiddleware.js";
// const router = express.Router();

// router.get("/:room", protect, getRoomMessages);

// export default router;

import express from "express";
import { getRoomMessages, getRooms, createRoom } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/rooms", getRooms);
router.post("/rooms", protect, createRoom);
router.get("/:room", protect, getRoomMessages);

export default router;
