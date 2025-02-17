import { Request, Response } from "express";
import User from "../models/user";

async function handleGetContactedUser(
  req: Request,
  res: Response
): Promise<void> {
  const userData = req.user;

  const userCompleteData = await User.findById(userData?.id).populate({
    path: "conversations",
    populate: {
      path: "conversation",
      model: "User",
      select: "-password -role",
    },
  });

  if (!userCompleteData) {
    res.status(401).send("No user found");
    return;
  }

  const sortedData = userCompleteData.conversations.sort((a: any, b: any) => {
    return (
      new Date(b.lastMessage).getTime() - new Date(a.lastMessage).getTime()
    );
  });

  const filteredData = sortedData.map((conversation: any) => {
    const conversationData = { ...conversation.toObject() };
    conversationData.conversation = conversationData.conversation
      .filter((user: any) => user._id.toString() !== userData?.id)
      .map((user: any) => ({
        id: user._id,
        username: user.username,
        email: user.email,
        profileImageURL: user.profileImage?.url,
        about: user.about,
        isOnline: user.isOnline,
      }));
    return conversationData;
  });

  res.status(200).json(filteredData);
}

export { handleGetContactedUser };
