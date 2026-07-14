import Peer from "peerjs";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";

import VideoPlayer from "../components/VideoPlayer";
import { RoomContext } from "../context/RoomContext";
import { toast } from "sonner";
import WaitingContainer from "@/components/WaitingContainer";
import { Button } from "@/components/ui/button";
import { BsFillMicMuteFill, BsMicFill } from "react-icons/bs";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import CameraOff from "@/components/CameraOff";

const Room = () => {
  const { id } = useParams();
  const { socket } = useContext(RoomContext);

  const [stream, setStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const [remoteMicOn, setRemoteMicOn] = useState(true);
  const [remoteCameraOn, setRemoteCameraOn] = useState(true);

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerIdRef = useRef<string>("");

  const navigate = useNavigate();

  const toggleCamera = () => {
    const stream = localStreamRef.current;

    if (!stream) return;

    const video = stream.getVideoTracks()[0];

    if (video) {
      video.enabled = !video.enabled;

      setCameraOn(video.enabled);

      socket.emit("toggle-camera", {
        roomId: id,
        cameraEnabled: video.enabled,
      });
    }
  };

  const toggleAudio = () => {
    const stream = localStreamRef.current;

    if (!stream) return;

    const audio = stream.getAudioTracks()[0];

    if (audio) {
      audio.enabled = !audio.enabled;

      setMicOn(audio.enabled);

      socket.emit("toggle-audio", {
        roomId: id,
        audioEnabled: audio.enabled,
      });
    }
  };

  const endCall = () => {
    socket.emit("leave-room", {
      roomId: id,
      peerId: peerIdRef.current,
    });
    navigate("/");
  };

  useEffect(() => {
    const peer = new Peer(uuid());

    const callPeer = (peerId: string) => {
      const currentStream = localStreamRef.current;

      if (!currentStream || peerId === peer.id) return;

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
      peerIdRef.current = peerId;

      socket.emit("join-room", {
        roomId: id,
        peerId,
      });
    });

    socket.on("room-full", () => {
      toast.error("The room is full.");
      navigate("/");
    });

    socket.on("get-users", (peerIds: string[]) => {
      const [firstPeerId] = peerIds;

      if (firstPeerId) {
        callPeer(firstPeerId);
      }
    });

    peer.on("call", (call) => {
      const currentStream = localStreamRef.current;

      if (!currentStream) return;

      call.answer(currentStream);

      call.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
      });
    });

    socket.on("toggle-audio-status", (audioEnabled: boolean) => {
      setRemoteMicOn(audioEnabled);
    });

    socket.on("toggle-camera-status", (cameraEnabled: boolean) => {
      setRemoteCameraOn(cameraEnabled);
      console.log("Remote camera status changed:", cameraEnabled);
    });

    socket.on("user-disconnected", () => {
      setRemoteStream(undefined);
    });

    return () => {
      peer.destroy();

      localStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      socket.off("get-users");
      socket.off("room-full");
      socket.off("toggle-audio-status");
      socket.off("toggle-camera-status");
      socket.off("user-disconnected");
    };
  }, [id, navigate, socket]);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      <div className="flex justify-end px-4 py-2">
        <div className="rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm shadow-sm">
          <span className="text-muted-foreground">Meeting ID:</span>{" "}
          <span className="font-mono font-semibold tracking-wide text-foreground">
            {id}
          </span>
        </div>
      </div>
      <div className="min-h-0 flex-1 p-3 sm:p-6">
        <div className="mx-auto grid h-full max-w-7xl grid-rows-2 gap-3 sm:gap-4 md:grid-cols-2 md:grid-rows-1 lg:gap-6">
          <div className="relative min-h-0 w-full overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border sm:rounded-2xl">
            <div className="absolute left-2 top-2 z-10 rounded-md bg-black/50 px-2 py-0.5 text-xs text-white sm:left-3 sm:top-3 sm:rounded-lg sm:px-3 sm:py-1 sm:text-sm">
              You
            </div>
            {!micOn && (
              <div className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white sm:right-3 sm:top-3 sm:h-10 sm:w-10">
                <BsFillMicMuteFill className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            )}

            {stream ? (
              cameraOn ? (
                <VideoPlayer stream={stream} />
              ) : (
                <CameraOff />
              )
            ) : (
              <WaitingContainer text="Waiting for camera permission..." />
            )}
          </div>

          <div className="relative min-h-0 w-full overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-border sm:rounded-2xl">
            <div className="absolute left-2 top-2 z-10 rounded-md bg-black/50 px-2 py-0.5 text-xs text-white sm:left-3 sm:top-3 sm:rounded-lg sm:px-3 sm:py-1 sm:text-sm">
              Other
            </div>

            {!remoteMicOn && (
              <div className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white sm:right-3 sm:top-3 sm:h-10 sm:w-10">
                <BsFillMicMuteFill className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            )}

            {remoteStream ? (
              remoteCameraOn ? (
                <VideoPlayer stream={remoteStream} />
              ) : (
                <CameraOff />
              )
            ) : (
              <WaitingContainer text="Waiting for another user..." />
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 justify-center px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-2 sm:pb-4 sm:pt-0">
        <div className="flex items-center gap-3 rounded-2xl bg-card/90 px-4 py-3 shadow-xl backdrop-blur sm:gap-4 sm:px-6 sm:py-4">
          <Button
            onClick={toggleCamera}
            className="h-11 w-11 shrink-0 rounded-full p-0 cursor-pointer sm:h-14 sm:w-14 lg:h-16 lg:w-16"
          >
            {cameraOn ? (
              <FaVideo className="h-4! w-4! sm:h-6! sm:w-6!" />
            ) : (
              <FaVideoSlash className="h-4! w-4! sm:h-6! sm:w-6!" />
            )}
          </Button>

          <Button
            onClick={toggleAudio}
            className="h-11 w-11 shrink-0 rounded-full p-0 cursor-pointer sm:h-14 sm:w-14 lg:h-16 lg:w-16"
          >
            {micOn ? (
              <BsMicFill className="h-4! w-4! sm:h-6! sm:w-6!" />
            ) : (
              <BsFillMicMuteFill className="h-4! w-4! sm:h-6! sm:w-6!" />
            )}
          </Button>

          <Button
            onClick={endCall}
            className="h-11 w-11 shrink-0 rounded-full p-0 bg-red-600 text-white cursor-pointer hover:bg-red-700 focus:ring-red-600 sm:h-14 sm:w-14 lg:h-16 lg:w-16"
          >
            <MdCallEnd className="h-4! w-4! sm:h-6! sm:w-6!" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Room;
