import { Request, Response, NextFunction } from "express";
import { verifyUser } from "../services/authenticateUserService";

interface UserPayload {
  id: string;
  email: string;
  username: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.logToken;
//   const publicPaths = ["/healthCheck", "/user/signup", "/user/signin"];
  const securePaths = [
    "/message",
    "/message/getMessages",
    "/onRefreshGetUserData",
    "/getContactedUser",
    "/getAllUsers",
    "/addProfileImage",
    "/addAbout",
    "/logout",
  ];

  const requiresAuth = securePaths.some((securePath) => req.path.startsWith(securePath));

  if (!requiresAuth) {
    return next();
  }

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decodeUser = verifyUser(token) as UserPayload | null;
    if (decodeUser) {
      req.user = decodeUser;
      next(); // Continue to the next middleware or route handler
    } else {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authenticateUser;
