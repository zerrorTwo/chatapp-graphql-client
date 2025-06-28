"use client";

import React, { useState } from "react";
import { useChat } from "../context/ChatContext";
import { X, Edit3 } from "lucide-react";

interface NicknameModalProps {
  chat: any;
  onClose: () => void;
}

const NicknameModal = ({ chat, onClose }: NicknameModalProps) => {
  const { updateNickname, users } = useChat();
  const [nicknames, setNicknames] = useState(chat.nicknames || {});

  const handleSave = () => {
    Object.entries(nicknames).forEach(([userId, nickname]) => {
      updateNickname(chat.id, userId, nickname as string);
    });
    onClose();
  };

  const handleNicknameChange = (userId: string, nickname: string) => {
    setNicknames((prev: Record<string, string>) => ({
      ...prev,
      [userId]: nickname,
    }));
  };

  const participantUsers = users.filter((user) =>
    chat.participants.includes(user.id)
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 h-[600px] flex flex-col">
        {/* Header cố định */}
        <div className="flex items-center justify-between p-6 border-b shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Quản lý biệt danh</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/10 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Nội dung scroll */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {participantUsers.map((user) => (
            <div key={user.id}>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                <Edit3 className="w-4 h-4 inline mr-2" />
                Biệt danh cho {user.name}
              </label>
              <input
                type="text"
                value={nicknames[user.id] || user.name}
                onChange={(e) => handleNicknameChange(user.id, e.target.value)}
                placeholder={`Nhập biệt danh cho ${user.name}`}
                className="w-full px-3 py-2 border rounded-lg bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        {/* Footer cố định */}
        <div className="flex justify-end space-x-2 p-4 border-t shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default NicknameModal;

/* Thêm custom-scrollbar vào className của div scrollable và hướng dẫn thêm CSS vào global */
