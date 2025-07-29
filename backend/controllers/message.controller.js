import { Message } from "../models/message.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apierrors from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { io } from "../socket/socket.js"; 




// =============================== Get Messages Between Two Users =========================
 const getMessagesBetweenUsers = asyncHandler(async (req, res) => {
  const { sender , receiver } = req.params;
   if (!sender || !receiver) {
     throw new apierrors("Sender or Receiver ID is missing", 400);
   }
  
 
  try {
    const messages = await Message.find({
      $or: [
        { sender: sender, receiver: receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });

    if (messages.length === 0) {
      return res
        .status(404)
        .json({ data: null, message: "No messages found between these users" });
    }

    // console.log("Messages between users:", messages);

    // messages.forEach((msg) => {
    //   console.log("Message content:", msg.message);
    // });

    res.json({ data: messages, message: "Messages retrieved successfully" });
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new apierrors(error.message || "Error fetching messages", 500);
  }
  
});

// ===================================================== Create a Message =========================    

const createMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const { receiverId } = req.params;
 

  if (!receiverId || !message) {
    throw new apierrors("Receiver ID and message are required", 400);
  }

  const newMessage = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    message: message,
  });

  // Emit the message to the receiver 
  io.to(receiverId).emit("newPrivateMessage", newMessage); // Emit to the receiver
  io.to(req.user._id).emit("newPrivateMessage", newMessage); // Emit to the sender

  res
    .status(201)
    .json({data: newMessage, message: "Message sent successfully"});
}); 

export { getMessagesBetweenUsers, createMessage };