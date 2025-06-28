"use client";
import React, { useState } from "react";
import { useChat } from "../context/ChatContext";
import { X, Palette, Edit3, Users } from "lucide-react";
import NicknameModal from "./NicknameModal";

interface ChatSettingsProps {
  chat: any;
  onClose: () => void;
}

const ChatSettings = ({ chat, onClose }: ChatSettingsProps) => {
  const { updateChatBackground, updateGroupName } = useChat();
  const [newName, setNewName] = useState(chat.name);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  const backgrounds = [
    { id: "default", name: "Mặc định", color: "#f3f4f6" },
    { id: "#ff6b6b", name: "Đỏ", color: "#ff6b6b" },
    { id: "#4ecdc4", name: "Xanh ngọc", color: "#4ecdc4" },
    { id: "#45b7d1", name: "Xanh dương", color: "#45b7d1" },
    { id: "#96ceb4", name: "Xanh lá", color: "#96ceb4" },
    { id: "#feca57", name: "Vàng", color: "#feca57" },
    { id: "#ff9ff3", name: "Hồng", color: "#ff9ff3" },
    {
      id: "gradient-sunset",
      name: "Hoàng hôn",
      color: "linear-gradient(135deg, #ff6b6b, #ffd93d)",
    },
    {
      id: "gradient-ocean",
      name: "Đại dương",
      color: "linear-gradient(135deg, #667eea, #764ba2)",
    },
    {
      id: "gradient-forest",
      name: "Rừng cây",
      color: "linear-gradient(135deg, #11998e, #38ef7d)",
    },
  ];

  const handleBackgroundChange = (backgroundId: string) => {
    updateChatBackground(chat.id, backgroundId);
  };

  const handleNameChange = () => {
    if (newName.trim() && newName !== chat.name) {
      updateGroupName(chat.id, newName.trim());
    }
  };

  return (
    <>
      <div className="w-96 h-full bg-white shadow-lg flex flex-col transition-transform duration-300">
        <div className="rounded-lg p-6 flex-1 overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Cài đặt cuộc trò chuyện
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-black/10 cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            {/* Chat Name */}
            {chat.isGroup && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  <Edit3 className="w-4 h-4 inline mr-2" />
                  Tên nhóm
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 ring-blue-500"
                  />
                  <button
                    onClick={handleNameChange}
                    className="px-3 py-2 text-white rounded-lg bg-blue-500"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            )}

            {/* Background */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-700">
                <Palette className="w-4 h-4 inline mr-2" />
                Hình nền cuộc trò chuyện
              </label>
              <div className="grid grid-cols-4 gap-2">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => handleBackgroundChange(bg.id)}
                    className={`h-12 rounded-lg border-2 ${
                      chat.background === bg.id
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    style={{
                      background:
                        bg.color.startsWith("linear-gradient") ||
                        bg.color.startsWith("#")
                          ? bg.color
                          : "#f3f4f6",
                    }}
                    title={bg.name}
                  >
                    {bg.id === "default" && (
                      <span className="text-xs text-gray-600">Mặc định</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Members */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <Users className="w-4 h-4 inline mr-2" />
                Thành viên ({chat.participants.length})
              </label>
              <button
                onClick={() => {
                  setShowNicknameModal(true);
                }}
                className="text-sm underline text-blue-600"
              >
                Quản lý biệt danh
              </button>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-white rounded-lg bg-blue-500"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {showNicknameModal && (
        <NicknameModal
          chat={chat}
          onClose={() => setShowNicknameModal(false)}
        />
      )}
    </>
  );
};

export default ChatSettings;
