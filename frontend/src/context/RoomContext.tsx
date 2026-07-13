import { createContext, type ReactNode, useState } from "react";
import { io, Socket } from "socket.io-client";

const WS = "http://localhost:3001";

const socket: Socket = io(WS);

type RoomContextType = {
  roomId: string;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  socket: Socket;
};

export const RoomContext = createContext<RoomContextType>({
  roomId: "",
  setRoomId: () => {},
  socket,
});

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [roomId, setRoomId] = useState("");

  return (
    <RoomContext.Provider
      value={{
        roomId,
        setRoomId,
        socket,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
