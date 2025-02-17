import { Request, Response } from "express";
import User from "../models/user";

async function handleGetAllUsers(req: Request, res: Response): Promise<void> {
  const userData = req.user;

  if (!userData) {
    res.status(400).send("User data is missing");
    return;
  }

  const userCompleteData = await User.findById(userData?.id).populate({
    path: "conversations",
    populate: {
      path: "conversation",
      model: "User",
      select: "-password -role",
    },
  });

  if (!userCompleteData) {
    res.status(404).send("User not found");
    return;
  }

  if (userCompleteData.conversations.length === 0) {
    const allUsers = await User.find({ _id: { $ne: userData.id } });
    const getRequiredData = allUsers.map((user: any) => {
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImageURL: user.profileImage?.url,
        about: user.about,
        isOnline: user.isOnline
      };
    });
  
    res.status(200).json(getRequiredData);
    return;
  }

  const contactedUserIds = userCompleteData.conversations.flatMap((conv: any) =>
    conv.conversation.map((user: any) => user._id)
  );

  const allUsers = await User.find({
    _id: { $nin: [...contactedUserIds, userData.id] },
  });

  const getRequiredData = allUsers.map((user: any) => {
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      profileImageURL: user.profileImage.url,
      about: user.about,
      isOnline: user.isOnline
    };
  });

  res.status(200).json(getRequiredData);
}

export { handleGetAllUsers };
