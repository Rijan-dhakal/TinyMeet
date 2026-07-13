import { useEffect, useRef } from "react";

const VideoPlayer = ({ stream }: { stream: MediaStream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  });

  return <video ref={videoRef} autoPlay playsInline controls={false} />;
};
export default VideoPlayer;
