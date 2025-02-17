import { Response, Request } from "express";
import User from "../models/user";

export async function handleAddAbout(req: Request, res: Response){
    const cookieData = req.user;
    const {updatedAbout} = req.body;

    if(!cookieData) res.status(404).send("User not found");

    try{
        const updatedUser = await User.findByIdAndUpdate(
            cookieData?.id,
            {
                about : updatedAbout,
            }
        )

        if(!updatedUser) res.status(500).send("fail to add about server error");

        const requiredUserData = {
            id: updatedUser?._id,
            email: updatedUser?.email,
            username: updatedUser?.username,
            role: updatedUser?.role,
            about: updatedAbout,
            profileImageUrl: updatedUser?.profileImage?.url ?? ""
          };

          res.status(201).send(requiredUserData)
      
    }
    catch(err){
        res.status(500).send("fail to add server error");
    }

}