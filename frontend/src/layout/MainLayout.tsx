import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main className="h-[calc(100vh-110px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
