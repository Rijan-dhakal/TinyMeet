import { RoomContext } from "@/context/RoomContext";
import { useContext } from "react";

const Room = () => {
  const { socket } = useContext(RoomContext);

  socket.emit("test-socket", { message: "Hello from client!" });

  socket.on("test-socket-2", (data) => {
    console.log(data.message);
  });

  return <div>Room</div>;
};
export default Room;
