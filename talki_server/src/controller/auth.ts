    import { Request, Response } from "express";
    import User from "../models/user";
    import bcrypt from "bcryptjs";
    import dotenv from 'dotenv';
    import { createTokenForUser } from '../services/authenticateUserService'

    dotenv.config();

    async function handleUserSignUp(req: Request, res: Response): Promise<void> {
        try{    
            const {username, email, password} = req.body;
            if (!username?.trim() || !email?.trim() || !password?.trim()) {
                res.status(202).send("Please fill all the fields properly");
                return;
            }

            const existingUser = await User.findOne({ 
                $or: [{ username }, { email }] 
            });
    
            if (existingUser) {
                if (existingUser.username === username) {
                    res.status(200).send("Username already exists");
                } else if (existingUser.email === email) {
                    res.status(200).send("Email already exists");
                }
                return;
            }

            const saltRounds : number = 10;
            const hashedPassword : string = await bcrypt.hash(password, saltRounds);

            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            await newUser.save();

            res.status(201).send("User signed up successfully");
            
        }catch(err){
            res.status(500).send("Failed to signup");
        }
    }

    async function handleUserSignIn(req:Request, res: Response): Promise<void> {
        try{    
            
            const {username, password} = req.body;
            if (!username?.trim() || !password?.trim()) {
                res.status(202).send("Please fill all the fields properly");
                return;
            }

            const userData = await User.findOne({username});

            if(!userData){
                res.status(200).send("User does not exist. Please sign up first.");
                return;
            }
            
            const isPasswordValid : boolean = await bcrypt.compare(password, userData.password);

            if(!isPasswordValid){
                res.status(200).send("Please enter correct password!");
                return;
            }
            else{
                const requiredUserData = {
                    id : userData._id,
                    email : userData.email,
                    username : userData.username,
                    role: userData.role,
                    about: userData.about,
                }
                const logToken : string = createTokenForUser(requiredUserData);

                res.cookie('logToken', logToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 4 * 24 * 60 * 60 * 1000, 
                    sameSite: 'strict',
                })
                res.status(201).send(requiredUserData);
            }
            
        }catch(err){
            res.status(500).send("Failed to signin");
        }
    }

    async function handleLogout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie('logToken', {
                httpOnly: true, 
                secure: true,   
                sameSite: 'strict',
                path: '/',      
            });
    
            res.status(200).json({ message: "Logged out successfully" });
        } catch (err) {
            console.error("Logout Error:", err);
            res.status(500).json({ message: "Failed to logout" });
        }
    }




    // this is for multivalue export we can export more than one value and in this when we impoert it in another class we have to keep same name as it is we can't use our custom name at the time of import.
    export {handleUserSignUp, handleUserSignIn, handleLogout};
