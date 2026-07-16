import { useEffect, useRef } from "react";

const VideoPlayer = ({
  stream,
  muted = false,
}: {
  stream: MediaStream;
  muted?: boolean;
}) => {
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
      muted={muted}
      controls={false}
      className="h-full w-full rounded-lg object-cover"
    />
  );
};

export default VideoPlayer;
