import { RoomContext } from "@/context/RoomContext";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

const Room = () => {
  const { socket } = useContext(RoomContext);
  const { id } = useParams();

  useEffect(() => {
    socket.emit("join-room", id);

    socket.on("get-users", (users: string[]) => {
      console.log("Users in the room:", users);
    });

    return () => {
      socket.off("create-room");
      socket.off("get-users");
    };
  }, [id]);

  return <div>Room</div>;
};
export default Room;
