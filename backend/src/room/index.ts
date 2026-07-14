import type { Socket } from "socket.io";
import { customAlphabet } from "nanoid";

const rooms: { [key: string]: string[] } = {};

export const roomHandler = (socket: Socket) => {
  interface JoinRoomParams {
    roomId: string;
    peerId: string;
  }

  const createRoom = () => {
    const generateId = customAlphabet(
      "abcdefghijklmnopqrstuvwxyz0123456789",
      6,
    );
    const roomId = generateId();

    socket.emit("room-created", roomId);
    rooms[roomId] = [];
  };

  const joinRoom = ({ roomId, peerId }: JoinRoomParams) => {
    if (rooms[roomId]) {
      const tempSet = new Set(rooms[roomId]);

      rooms[roomId] = Array.from(tempSet);

      if (rooms[roomId].length >= 2) {
        socket.emit("room-full");
        return;
      }
      rooms[roomId]?.push(peerId);
      socket.join(roomId);

      socket.emit("get-users", rooms[roomId]);

      socket.on("disconnect", () => {
        leaveRoom({
          roomId,
          peerId,
        });
      });
    }
  };

  const leaveRoom = ({
    roomId,
    peerId,
  }: {
    roomId: string;
    peerId: string;
  }) => {
    if (rooms[roomId]) {
      rooms[roomId] = rooms[roomId]?.filter((id) => id !== peerId) || [];
      socket.to(roomId).emit("user-disconnected", peerId);

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
  };

  const toggleAudio = ({
    roomId,
    audioEnabled,
  }: {
    roomId: string;
    audioEnabled: boolean;
  }) => {
    socket.to(roomId).emit("toggle-audio-status", audioEnabled);
  };

  const toggleCamera = ({
    roomId,
    cameraEnabled,
  }: {
    roomId: string;
    cameraEnabled: boolean;
  }) => {
    console.log(12);
    socket.to(roomId).emit("toggle-camera-status", cameraEnabled);
  };

  const leaveRoomHandler = ({
    roomId,
    peerId,
  }: {
    roomId: string;
    peerId: string;
  }) => {
    leaveRoom({ roomId, peerId });
    socket.to(roomId).emit("end-call", peerId);
  };

  socket.on("leave-room", leaveRoomHandler);

  socket.on("create-room", createRoom);

  socket.on("join-room", joinRoom);

  socket.on("toggle-audio", toggleAudio);

  socket.on("toggle-camera", toggleCamera);
};
