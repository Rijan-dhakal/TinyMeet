import { useEffect, useRef } from "react";

const VideoPlayer = ({ stream }: { stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      controls={false}
      className="h-full w-full rounded-lg object-cover"
    />
  );
};

export default VideoPlayer;
