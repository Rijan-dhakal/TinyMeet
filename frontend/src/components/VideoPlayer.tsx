import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const VideoPlayer = ({
  stream,
  muted = false,
  className,
}: {
  stream: MediaStream;
  muted?: boolean;
  className?: string;
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
      className={cn("h-full w-full rounded-lg object-cover", className)}
    />
  );
};

export default VideoPlayer;
