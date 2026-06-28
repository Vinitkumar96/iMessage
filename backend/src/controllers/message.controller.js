import { hasImageKitConfig, uploadChatMethod } from "../lib/imagekit.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { upload } from "../middleware/upload.middleware.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export async function getUsersForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-clerkId");
    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getConversationsForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;

    const conversations = await Message.aggregate([
      //where msg i send or i recieved
      {
        $match: {
          $or: [
            {
              senderId: loggedInUserId,
            },
            {
              receiverId: loggedInUserId,
            },
          ],
        },
      },
      //latest message
      {
        $group: {
          _id: {
            $cond: [
              {
                $eq: ["$senderId", loggedInUserId],
              },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      //sort
      {
        $sort: {
          lastMessageAt: -1,
        },
      },

      //lookup to add the partners detail
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },

      // now we will replace each object by just keeping the partners detail
      {
        $replaceRoot: {
          newRoot: {
            $first: "$user",
          },
        },
      },

      //project this to all objects
      {
        $project: {
          clerkId: 0,
        },
      },
    ]);

    return res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getConversationsForSidebar", error.message);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendMessage(req, res) {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    let videoUrl;

    if (req.file) {
      if (!hasImageKitConfig()) {
        return res
          .status(500)
          .json({ message: "Media upload is not configured" });
      }

      const url = await uploadChatMethod(req.file);
      if (req.file.mimetype.startsWith("video/")) videoUrl = url;
      else imageUrl = url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
      video: videoUrl,
    });

    await newMessage.save();

    //will use socket later so that user dont have to re-
    //refresh for seeing new messages every time
    const receiverSocketId = getReceiverSocketId(receiverId); // now we have receiver socket id
    //we will send if receiver is online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
