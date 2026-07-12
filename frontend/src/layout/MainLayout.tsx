import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="px-10 py-3">
        <Outlet />
      </main>
    </>
  );
}
