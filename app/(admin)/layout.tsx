import { ReactNode } from "react";
import ProtectedRoute from "@/app/(admin)/protectedRoute";
import { ChatProvider } from "../context/ChatContext";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ChatProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
    </ChatProvider>
  );
};

export default AppLayout;
