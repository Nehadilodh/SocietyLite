import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        transports: ['websocket'], // YE ADD KAR - 403 fix hoga
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
        // RESIDENT HAI TO FLAT ROOM JOIN KAR
        if (user.role === 'resident' && user.flatNo) {
          newSocket.emit('join_flat', user.flatNo);
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [user, token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);