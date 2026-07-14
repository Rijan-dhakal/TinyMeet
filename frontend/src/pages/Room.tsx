import Peer from "peerjs";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

import VideoPlayer from "../components/VideoPlayer";
import { RoomContext } from "../context/RoomContext";
import { toast } from "sonner";
import WaitingContainer from "@/components/WaitingContainer";

const Room = () => {
  const { id } = useParams();
  const { socket } = useContext(RoomContext);

  const [stream, setStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const localStreamRef = useRef<MediaStream | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const peer = new Peer(uuid());

    const callPeer = (peerId: string) => {
      const currentStream = localStreamRef.current;

      if (!currentStream || peerId === peer.id) {
        return;
      }

      const call = peer.call(peerId, currentStream);

      call.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
      });
    };

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((mediaStream) => {
        localStreamRef.current = mediaStream;
        setStream(mediaStream);
      })
      .catch((err) => {
        console.error("Failed to access media devices:", err);
      });

    peer.on("open", (peerId) => {
      if (!id) return;

      socket.emit("join-room", {
        roomId: id,
        peerId,
      });
    });

    socket.on("room-full", () => {
      toast.error("The room is full.");
      navigate("/");
      return;
    });

    socket.on("get-users", (peerIds: string[]) => {
      const [firstPeerId] = peerIds;

      if (firstPeerId) {
        callPeer(firstPeerId);
      }
    });

    peer.on("call", (call) => {
      const currentStream = localStreamRef.current;

      if (!currentStream) {
        return;
      }

      call.answer(currentStream);

      call.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
      });
    });

    socket.on;

    return () => {
      peer.destroy();

      localStreamRef.current?.getTracks().forEach((track) => track.stop());

      socket.off("get-users");
      socket.off("user-disconnected");
      socket.off("room-full");
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-slate-900 px-6 pt-16">
      <div className="mx-auto grid max-w-max-w-7xl gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 relative">
          <div className="absolute bg-gray-800/50 text-white py-1 px-3 top-3 left-3 rounded-lg text-sm">
            You
          </div>
          {stream ? (
            <VideoPlayer stream={stream} />
          ) : (
            <WaitingContainer text="Waiting for camera permission..." />
          )}
        </div>

        <div className="overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10 max-w-7xl relative">
          <div className="absolute bg-gray-800/50 text-white py-1 px-3 top-3 left-3 rounded-lg text-sm">
            Other
          </div>
          {remoteStream ? (
            <VideoPlayer stream={remoteStream} />
          ) : (
            <WaitingContainer text="Waiting for another user..." />
          )}
        </div>
      </div>
    </div>
  );
};

export default Room;
