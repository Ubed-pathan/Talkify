import { Request, Response } from "express";
import formidable from "formidable";
import cloudinary from "../config/cloudnaryConfig";
import User from "../models/user";

export const handleAddProfileImage = async (req: Request, res: Response) => {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: "Error parsing form data", error: err.message });
    }

    const file = files.image;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const fileData = Array.isArray(file) ? file[0] : file;

    const mimeType = fileData.mimetype ?? "";
    if (!mimeType.startsWith("image/")) {
      return res.status(400).json({ message: "Only image files are allowed!" });
    }

    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized access!" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }

      if (user.profileImage?.publicId) {
        await cloudinary.uploader.destroy(user.profileImage.publicId);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(fileData.filepath, {
        folder: "talki-profile-images",
        resource_type: "image",
      });

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profileImage: {
            url: cloudinaryResponse.secure_url,
            publicId: cloudinaryResponse.public_id,
            format: cloudinaryResponse.format,
          },
        },
        { new: true }
      );

    if (!updatedUser) {
      return res.status(500).json({ message: "Failed to update user profile image!" });
    }

    const requiredUserData = {
      id: updatedUser._id,
      email: updatedUser.email,
      username: updatedUser.username,
      role: updatedUser.role,
      about: updatedUser.about,
      profileImageUrl: cloudinaryResponse.secure_url,
    };

    return res.status(201).json(requiredUserData);
    } catch (error) {
      return res.status(500).json({
        message: "Failed to upload image",
        error: (error as Error).message,
      });
    }
  });
};
