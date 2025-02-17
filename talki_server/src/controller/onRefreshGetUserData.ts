import mongoose from "mongoose";
import { Request, Response } from "express";
import User from "../models/user";

export async function handleOnRefreshGetUserData(req: Request, res: Response): Promise<void> {
    const cookieData = req.user;

    if(cookieData){
        const userData = await User.findById(cookieData.id);
        if(userData){
            const requiredUserData = {
                id: userData._id,
                email: userData.email,
                username: userData.username,
                role: userData.role,
                about: userData.about,
                profileImageUrl: userData.profileImage?.url ?? ""
              };
              res.status(201).send(requiredUserData);
        }
    }else{
        res.status(401);
    }

}   