import React, { createContext, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import socket from '../socket';

interface SocketContextType {
    socketInstance: Socket; // Renamed context property
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => (
    <SocketContext.Provider value={{ socketInstance: socket }}>
        {children}
    </SocketContext.Provider>
);
