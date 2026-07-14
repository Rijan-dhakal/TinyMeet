import IconsInfo from "@/components/IconsInfo";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { MdVideoCall } from "react-icons/md";
import { CiCloudOff } from "react-icons/ci";
import { LuShieldCheck } from "react-icons/lu";
import { MdNoAccounts } from "react-icons/md";
import { RoomContext } from "@/context/RoomContext";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [meetingId, setMeetingId] = useState("");
  const { socket } = useContext(RoomContext);
  const navigate = useNavigate();

  const handleJoinMeeting = (meetingId: string) => {
    console.log("Joining meeting with ID:", meetingId);
    navigate(`/room/${meetingId}`);
  };

  useEffect(() => {
    const handleRoomCreated = (roomId: string) => {
      navigate(`/room/${roomId}`);
    };

    socket.on("room-created", handleRoomCreated);

    return () => {
      socket.off("room-created", handleRoomCreated);
    };
  }, [navigate, socket]);

  const createRoom = () => {
    socket.emit("create-room");
  };

  return (
    <div className="min-h-screen px-10 py-3 bg-[url('/background-light.png')] dark:bg-[url('/background-dark.jpg')] bg-cover overflow-hidden">
      {/* Page Title */}
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-5xl font-bold text-center mt-10 text-black dark:text-white">
          Secure Peer-to-Peer Video
          <br />
          Meetings
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Simple. Private. No accounts needed.
        </p>
      </div>

      {/* Meeting Input */}
      <div className="flex justify-center mt-8 flex-col items-center gap-4">
        <Button
          onClick={createRoom}
          className="bg-blue-500 hover:bg-blue-600 text-white py-6 px-4 cursor-pointer rounded flex items-center md:px-12"
        >
          <MdVideoCall className="mr-2 size-8" />
          <span className="text-xl">Create New Meeting</span>
        </Button>
        <span>OR</span>
        <div className="flex items-center flex-col gap-2 md:flex-row md:gap-0">
          <input
            type="text"
            placeholder="Enter Meeting ID"
            className="border border-gray-800 rounded py-3 px-4 mr-2 dark:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
          />
          <Button
            onClick={() => handleJoinMeeting(meetingId)}
            className="bg-gray-200 text-gray-800 py-6 px-24 cursor-pointer rounded hover:bg-gray-300 md:px-5"
          >
            <span className="text-xl">Join</span>
          </Button>
        </div>
      </div>

      {/* Extra Content */}
      <div className="flex justify-center mt-18 flex-row items-center gap-4 md:gap-8 lg:gap-32">
        <IconsInfo icon={<LuShieldCheck size={38} />} text="No Logging" />
        <IconsInfo icon={<CiCloudOff size={38} strokeWidth={1} />} text="P2P" />
        <IconsInfo icon={<MdNoAccounts size={38} />} text="No Accounts" />
      </div>
    </div>
  );
};
export default Homepage;
