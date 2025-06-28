"use client";

import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/SideBar";

const HomePage = () => {
  return (
    <div className="flex h-screen w-full">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default HomePage;
