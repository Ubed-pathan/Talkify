import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { Types } from "mongoose";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY as string;

interface User {
    id: Types.ObjectId;
    email: string;
    username: string;
    role: string;
    about: string;
}

interface TokenPayload extends JwtPayload {
    id: string;
    email: string;
    username: string;
    role: string;
    about: string;
}

function createTokenForUser(user: User): string {
  const payload: TokenPayload  = {
    id: user.id.toString(),
    email: user.email,
    username: user.username,
    role: user.role,
    about: user.about,
  };

  const options: SignOptions = { expiresIn: "4d" };

  const token = jwt.sign(payload, SECRET_KEY, options);
  return token;
}

function verifyUser(token: string): TokenPayload | null {
  try {
    const userData = jwt.verify(token, SECRET_KEY) as TokenPayload;
    return userData;
  } catch (err) {
    return null;
  }
}

export { createTokenForUser, verifyUser };
