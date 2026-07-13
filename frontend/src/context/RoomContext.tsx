import { createContext, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";

const WS = "http://localhost:3001";

const socket: Socket = io(WS);

type RoomContextType = {
  socket: Socket;
};

export const RoomContext = createContext<RoomContextType>({
  socket,
});

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  return (
    <RoomContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
