import { Request, response, Response } from "express";
import User from "../models/user";
import Conversation from "../models/conversation";
import mongoose, { Types } from "mongoose";
import Message from "../models/messages";
import { Server } from 'socket.io';


interface ConnectedUser {
  userId: string;
  socketId: string;
}

let connectedUsers: ConnectedUser[] = [];
let ios: Server;

function setNewContactMadeToReciver(recieverId: string){
  const user = connectedUsers.find(user => user.userId === recieverId);
  if(user){
    const isAddedNewUser = true;
    ios.to(user.socketId).emit('newUserAdded', isAddedNewUser);
  }
}

function setupSocketIO(io: Server) {
  ios = io;
  io.on('connection', (socket) => {

    socket.on("addUser", (userId) => {
      if (userId) {
        const user = { userId, socketId: socket.id };
        connectedUsers.push(user);
        io.emit("getUsers", connectedUsers); // Broadcast updated users
      }
    });

    socket.on('sendMessage', ({ message, recieverId, senderId, date }) => {
      const user = connectedUsers.find(user => user.userId === recieverId);
      if (user) {
        io.to(user.socketId).emit('getMessage', { message, senderId, date });
      }
    });

    socket.on("disconnect", () => {
      connectedUsers = connectedUsers.filter(
        (user) => user.socketId !== socket.id
      );
      io.emit("getUsers", connectedUsers); // Broadcast updated users
    });
  });
}

async function handleSendMessage(req: Request, res: Response): Promise<void> {
  const senderUserData = req.user;
  const { message, recieverId, conversationId, date} = req.body;

  const completeSenderUserData = await User.findById(
    senderUserData?.id
  ).populate({
    path: "conversations",
    populate: {
      path: "conversation",
      model: "User",
    },
  });

  if (!completeSenderUserData) {
    res.status(401).json({ message: "No User of this id" });
    return;
  }

  let filteredConversations: string | any[] = [];

  if (!conversationId) {
    filteredConversations = completeSenderUserData.conversations.filter(
      (conversation: any) => {
        return (
          conversation.conversation.some((id: mongoose.Types.ObjectId) =>
            id.equals(senderUserData?.id)
          ) &&
          conversation.conversation.some((id: mongoose.Types.ObjectId) =>
            id.equals(recieverId)
          )
        );
      }
    );
  }

  if (!conversationId || completeSenderUserData.conversations.length === 0) {
    const createdConversationData = await Conversation.create({
      conversation: [senderUserData?.id, recieverId],
      lastMessage: Date.now(),
    });

    const conversationId: Types.ObjectId =
      createdConversationData._id as Types.ObjectId;

    completeSenderUserData?.conversations.push(conversationId);

    await completeSenderUserData.save();

    const recieverData = await User.findById(recieverId);

    if (!recieverData) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    recieverData.conversations.push(conversationId);

    await recieverData.save();

    const isMessageSendSuccessfully = await sendMessage(
      message,
      completeSenderUserData._id.toString(),
      conversationId.toString(),
      date
    );

    if (isMessageSendSuccessfully) {
      setNewContactMadeToReciver(recieverId);
      res.status(201).json(conversationId);
    } else {
      res.status(401).json({ message: "Error, Message not send" });
    }
  } else {
    let findConversationId = null;

    if (conversationId) {
      findConversationId = conversationId;
    }
    else if (filteredConversations.length != 0) {
      findConversationId = filteredConversations[0]._id;
    } else {
      res.status(404).send("not conversation found");
    }

    const isMessageSendSuccessfully = await sendMessage(
      message,
      completeSenderUserData._id.toString(),
      findConversationId.toString(),
      date
    );

    if (isMessageSendSuccessfully) {
      const changeConversationLastMessageDate = await Conversation.findById(
        findConversationId
      );
      if (changeConversationLastMessageDate) {
        changeConversationLastMessageDate.lastMessage.setDate(Date.now());
        await changeConversationLastMessageDate.save();
      }
      res.status(201).json(conversationId);
    } else {
      res.status(401).json({ message: "Error, Message not send" });
    }
  }
}

async function sendMessage(
  message: string,
  senderId: string,
  conversationId: string,
  date: string
): Promise<boolean> {
  const isMessageCreate = await Message.create({
    message,
    conversationId,
    senderId,
    typeOfMessage: "text",
    date,
  });

  if (isMessageCreate) return true;
  else return false;
}

async function handleGetMessage(req: Request, res: Response): Promise<void> {
  const userData = req.user;
  const { recieverId, conversationId } = req.body;

  if(!userData || !recieverId || !conversationId){
    res.status(404).send("no conversation found.");
    return;
  }
  else{
    const getAllMessage = await Message.find({conversationId});
    res.status(200).json(getAllMessage);
  }
}

export { setupSocketIO, handleSendMessage, handleGetMessage };
