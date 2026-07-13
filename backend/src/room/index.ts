import type { Socket } from "socket.io";
import { v4 as uuid } from "uuid";

const rooms: { [key: string]: string[] } = {};

export const roomHandler = (socket: Socket) => {
  interface JoinRoomParams {
    roomId: string;
    peerId: string;
  }

  const createRoom = () => {
    const roomId = uuid();
    socket.emit("room-created", roomId);
    rooms[roomId] = [];
  };

  const joinRoom = ({ roomId, peerId }: JoinRoomParams) => {
    if (rooms[roomId]) {
      rooms[roomId]?.push(peerId);
      socket.join(roomId);

      socket.emit("get-users", rooms[roomId]);

      socket.on("disconnect", () => {
        leaveRoom(roomId, peerId);
      });
    }
  };

  const leaveRoom = (roomId: string, peerId: string) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId) || [];
      socket.to(roomId).emit("user-disconnected", peerId);
    }
  };

  socket.on("create-room", createRoom);

  socket.on("join-room", joinRoom);
};
