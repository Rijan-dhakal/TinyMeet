import { FaUserCircle } from "react-icons/fa";

const CameraOff = () => {
  return (
    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-gray-400 sm:text-base">
      <div className="flex flex-col items-center gap-2">
        <FaUserCircle className="h-12 w-12 sm:h-16 sm:w-16" />
        <div className="mt-2 text-xs sm:mt-3 sm:text-sm">Camera is off</div>
      </div>
    </div>
  );
};

export default CameraOff;
