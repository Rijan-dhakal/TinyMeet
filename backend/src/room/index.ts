import type { Socket } from "socket.io";
import { v4 as uuid } from "uuid";

const rooms: { [key: string]: string[] } = {};

export const roomHandler = (socket: Socket) => {
  const createRoom = () => {
    const roomId = uuid();
    socket.emit("room-created", roomId);
    rooms[roomId] = [];
    console.log(`Room created with ID: ${roomId}`);
  };

  const joinRoom = (roomId: string) => {
    if (rooms[roomId]) {
      socket.join(roomId);
      rooms[roomId].push(socket.id);
      console.log(`User joined room: ${roomId}`);
      socket.emit("get-users", rooms[roomId]);
      socket.on("disconnect", () => {
        console.log(`User disconnected from room: ${roomId}`);
        rooms[roomId] = rooms[roomId]?.filter((id) => id !== socket.id) || [];
      });
    }
  };

  socket.on("create-room", createRoom);

  socket.on("join-room", joinRoom);
};
