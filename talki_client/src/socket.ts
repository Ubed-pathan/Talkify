import { io, Socket } from 'socket.io-client';

const socket: Socket = io(import.meta.env.VITE_SERVER_API);

export default socket;
