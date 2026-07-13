import Peer from "peerjs";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

import VideoPlayer from "../components/VideoPlayer";
import { RoomContext } from "../context/RoomContext";

const Room = () => {
  const { id } = useParams();
  const { socket } = useContext(RoomContext);

  const [stream, setStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const localStreamRef = useRef<MediaStream | null>(null);

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

    return () => {
      peer.destroy();

      localStreamRef.current?.getTracks().forEach((track) => track.stop());

      socket.off("get-users");
      socket.off("user-disconnected");
    };
  }, [id]);

  return (
    <>
      <div>
        {stream && <VideoPlayer stream={stream} />}
        {remoteStream && <VideoPlayer stream={remoteStream} />}
      </div>
    </>
  );
};

export default Room;
