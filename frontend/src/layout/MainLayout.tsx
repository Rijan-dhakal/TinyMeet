import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="flex-1 px-10 py-3 bg-[url('/background-light.png')] dark:bg-[url('/background-dark.jpg')] bg-cover overflow-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
