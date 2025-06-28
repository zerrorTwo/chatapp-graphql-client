"use client";
import React, { useState } from "react";
import { Settings, User, Users, UserPlus, Search } from "lucide-react";
import { useChat } from "../context/ChatContext";
import CreateGroupModal from "./CreateGroupModal";
import AddFriendModal from "./AddFriendModal";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomTooltip } from "./CustomTooltip";

const Sidebar = () => {
  const { chats, users, activeChat, setActiveChat, currentUser } = useChat();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChatAvatar = (chat: any) => {
    if (chat.isGroup) {
      return <Users className="w-8 h-8" />;
    }
    const otherUser = users.find(
      (u) => u.id !== currentUser.id && chat.participants.includes(u.id)
    );
    return (
      <div className="bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
        {otherUser?.name.charAt(0) || "U"}
      </div>
    );
  };

  const getLastMessage = (chat: any) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    if (!lastMessage) return "";

    if (lastMessage.type === "system") return lastMessage.content;
    return lastMessage.content.length > 30
      ? lastMessage.content.substring(0, 30) + "..."
      : lastMessage.content;
  };

  return (
    <>
      <div className="w-80 border-r bg-white border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Tin nhắn</h1>
            <div className="flex space-x-2">
              <Link
                href="/settings"
                className="p-2 rounded-full hover:bg-opacity-10"
              >
                <CustomTooltip content="Cài đặt">
                  <Settings className="cursor-pointer w-5 h-5 text-gray-600" />
                </CustomTooltip>
              </Link>
              <Link
                href="/profile"
                className="p-2 rounded-full hover:bg-opacity-10"
              >
                <Tooltip>
                  <TooltipTrigger>
                    <User className="cursor-pointer w-5 h-5 text-gray-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Profile</p>
                  </TooltipContent>
                </Tooltip>
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setShowCreateGroup(true)}
              className="bg-primary flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-white font-medium"
            >
              <Users className="w-4 h-4" />
              <span>Tạo nhóm</span>
            </button>
            <button
              onClick={() => setShowAddFriend(true)}
              className="p-2 rounded-lg border-2 border-gray-300 hover:bg-gray-50"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat List */}
        <div className="overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-center p-4 cursor-pointer transition-colors ${
                activeChat === chat.id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="mr-3">{getChatAvatar(chat)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate text-gray-900">
                    {chat.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {chat.messages.length > 0 &&
                      new Date(
                        chat.messages[chat.messages.length - 1].timestamp
                      ).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                  </span>
                </div>
                <p className="text-sm truncate text-gray-600">
                  {getLastMessage(chat)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateGroup && (
        <CreateGroupModal onClose={() => setShowCreateGroup(false)} />
      )}
      {showAddFriend && (
        <AddFriendModal onClose={() => setShowAddFriend(false)} />
      )}
    </>
  );
};

export default Sidebar;
