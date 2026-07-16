import type { Server, Socket } from "socket.io";
import { customAlphabet } from "nanoid";

const rooms: { [key: string]: string[] } = {};

export const roomHandler = (io: Server, socket: Socket) => {
  interface JoinRoomParams {
    roomId: string;
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

  const joinRoom = ({ roomId }: JoinRoomParams) => {
    if (!rooms[roomId]) {
      socket.emit("room-not-found");
      return;
    }

    const tempSet = new Set(rooms[roomId]);

    rooms[roomId] = Array.from(tempSet);

    if (rooms[roomId].includes(socket.id)) {
      const existingUsers = rooms[roomId].filter((id) => id !== socket.id);

      socket.emit("get-users", existingUsers);
      return;
    }

    if (rooms[roomId].length >= 2) {
      socket.emit("room-full");
      return;
    }

    const existingUsers = [...rooms[roomId]];

    rooms[roomId]?.push(socket.id);
    socket.join(roomId);

    socket.emit("get-users", existingUsers);

    socket.to(roomId).emit("user-joined", socket.id);

    socket.on("disconnect", () => {
      leaveRoom({
        roomId,
        peerId: socket.id,
      });
    });
  };

  const leaveRoom = ({
    roomId,
    peerId,
  }: {
    roomId: string;
    peerId: string;
  }): boolean => {
    if (!rooms[roomId] || !rooms[roomId].includes(peerId)) {
      return false;
    }

    rooms[roomId] = rooms[roomId].filter((id) => id !== peerId);
    socket.to(roomId).emit("user-disconnected", peerId);

    if (rooms[roomId].length === 0) {
      delete rooms[roomId];
    }

    return true;
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
    socket.to(roomId).emit("toggle-camera-status", cameraEnabled);
  };

  const leaveRoomHandler = ({ roomId }: { roomId: string }) => {
    const actuallyLeft = leaveRoom({ roomId, peerId: socket.id });

    if (actuallyLeft) {
      socket.to(roomId).emit("end-call", socket.id);
    }
  };

  const sendSignal = ({
    to,
    signal,
  }: {
    to: string;
    signal: { type?: string };
  }) => {
    io.to(to).emit("signal", {
      from: socket.id,
      signal,
    });
  };

  socket.on("leave-room", leaveRoomHandler);

  socket.on("create-room", createRoom);

  socket.on("join-room", joinRoom);

  socket.on("toggle-audio", toggleAudio);

  socket.on("toggle-camera", toggleCamera);

  socket.on("signal", sendSignal);
};
