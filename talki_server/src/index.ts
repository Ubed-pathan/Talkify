import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authenticateUser from './middleware/authenticateUser';
import connectDB from './config/db';
import authRouter from './routes/auth';
import messageRouter from './routes/message';
import onRefreshGetUserData from './routes/onRefreshGetUserData';
import getContactedUser from './routes/getContactedUser';
import getAllUsers from './routes/getAllUsers';
import { DefaultEventsMap, Server } from 'socket.io';
import { createServer } from 'http';
import { setupSocketIO } from './controller/message';
import addProfileImage from './routes/addProfileImage';
import addAbout from './routes/addAbout'
import handleLogout from './routes/auth';
import path from 'path';

dotenv.config();

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '8000', 10);
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3003';

if (!frontendURL) {
    console.error('Frontend URL not found');
    process.exit(1);
}

const corsOptions = {
    origin: frontendURL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(authenticateUser);

connectDB();

app.get('/healthCheck', (req: Request, res: Response) => {
    res.send('Hey, the server is running very well.');
});

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: frontendURL,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

setupSocketIO(io);

app.use('/user', authRouter);
app.use('/message', messageRouter);
app.use('/onRefreshGetUserData', onRefreshGetUserData);
app.use('/getContactedUser', getContactedUser);
app.use('/getAllUsers', getAllUsers);
app.use('/addProfileImage', addProfileImage);
app.use('/addAbout', addAbout);
app.use('/logout', handleLogout);

const frontendBuildPath = path.join(__dirname, "../../talki_client/dist");
app.use(express.static(frontendBuildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendBuildPath, "index.html"));
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

