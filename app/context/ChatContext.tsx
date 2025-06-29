"use client";

import { useQuery } from "@apollo/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { GET_USER_BY_ID } from "../graphql/queries/user/getById.query";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: "text" | "image" | "system" | "game" | "poll" | "event";
  data?: any;
}

interface Chat {
  id: string;
  name: string;
  participants: string[];
  messages: Message[];
  isGroup: boolean;
  avatar?: string;
  background?: string;
  nicknames?: { [userId: string]: string };
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  status: "online" | "offline" | "away";
}

interface ChatContextType {
  chats: Chat[];
  users: User[];
  activeChat: string | null;
  currentUser: User | null;
  setActiveChat: (chatId: string | null) => void;
  sendMessage: (
    chatId: string,
    content: string,
    type?: string,
    data?: any
  ) => void;
  createGroup: (name: string, participants: string[]) => void;
  addFriend: (email: string) => void;
  updateChatBackground: (chatId: string, background: string) => void;
  updateNickname: (chatId: string, userId: string, nickname: string) => void;
  updateGroupName: (chatId: string, name: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, loading, error } = useQuery(GET_USER_BY_ID);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    if (data?.getUserById) {
      setCurrentUser({
        id: data.getUserById.id,
        name: data.getUserById.userName,
        email: data.getUserById.email,
        status: data.getUserById.status,
        avatarUrl: data.getUserById.avatarUrl,
      });
    }
  }, [data]);

  const [users, setUsers] = useState<User[]>([
    {
      id: "user2",
      name: "Nguyễn Văn A",
      email: "a@example.com",
      status: "online",
    },
    { id: "user3", name: "Trần Thị B", email: "b@example.com", status: "away" },
    {
      id: "user4",
      name: "Lê Văn C",
      email: "c@example.com",
      status: "offline",
    },
    {
      id: "user5",
      name: "Lê Văn C",
      email: "c@example.com",
      status: "offline",
    },
    {
      id: "user6",
      name: "Lê Văn C",
      email: "c@example.com",
      status: "offline",
    },
    {
      id: "user7",
      name: "Lê Văn C",
      email: "c@example.com",
      status: "offline",
    },
    {
      id: "user8",
      name: "Lê Văn C",
      email: "c@example.com",
      status: "offline",
    },
    {
      id: "user9",
      name: "Lê Văn C",
      email: "c@example.com",
      status: "offline",
    },
    {
      id: "user10",
      name: "Lê Văn C",
      email: "c@example.com",
      status: "offline",
    },
  ]);

  // Thêm currentUser vào users khi currentUser thay đổi
  useEffect(() => {
    if (currentUser && !users.some((u) => u.id === currentUser.id)) {
      setUsers((prev) => [currentUser, ...prev]);
    }
  }, [currentUser]);

  const [chats, setChats] = useState<Chat[]>([
    {
      id: "chat1",
      name: "Nguyễn Văn A",
      participants: ["user1", "user2"],
      isGroup: false,
      messages: [
        {
          id: "1",
          content: "Chào bạn!",
          sender: "user2",
          timestamp: new Date(),
          type: "text",
        },
        {
          id: "2",
          content: "Xin chào! Bạn khỏe không?",
          sender: "user1",
          timestamp: new Date(),
          type: "text",
        },
      ],
    },
    {
      id: "chat2",
      name: "Nhóm bạn thân",
      participants: [
        "user1",
        "user2",
        "user3",
        "user4",
        "user5",
        "user6",
        "user7",
      ],
      isGroup: true,
      messages: [
        {
          id: "3",
          content: "Hôm nay mình đi chơi nhé!",
          sender: "user3",
          timestamp: new Date(),
          type: "text",
        },
      ],
    },
  ]);

  const [activeChat, setActiveChat] = useState<string | null>("chat1");

  const sendMessage = (
    chatId: string,
    content: string,
    type = "text",
    data?: any
  ) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: currentUser.id,
      timestamp: new Date(),
      type: type as any,
      data,
    };
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );
  };

  const createGroup = (name: string, participants: string[]) => {
    if (!currentUser) return;
    const newChat: Chat = {
      id: Date.now().toString(),
      name,
      participants: [currentUser.id, ...participants],
      isGroup: true,
      messages: [
        {
          id: Date.now().toString(),
          content: `Nhóm "${name}" đã được tạo`,
          sender: "system",
          timestamp: new Date(),
          type: "system",
        },
      ],
    };
    setChats((prev) => [...prev, newChat]);
  };

  const addFriend = (email: string) => {
    const existingUser = users.find((u) => u.email === email);
    if (!existingUser) {
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
        status: "offline",
      };
      setUsers((prev) => [...prev, newUser]);
    }
  };

  const updateChatBackground = (chatId: string, background: string) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, background } : chat))
    );
  };

  const updateNickname = (chatId: string, userId: string, nickname: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              nicknames: { ...chat.nicknames, [userId]: nickname },
            }
          : chat
      )
    );
  };

  const updateGroupName = (chatId: string, name: string) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, name } : chat))
    );
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        users,
        activeChat,
        currentUser,
        setActiveChat,
        sendMessage,
        createGroup,
        addFriend,
        updateChatBackground,
        updateNickname,
        updateGroupName,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
