"use client";
import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { useChat } from "../context/ChatContext";

interface AddFriendModalProps {
  onClose: () => void;
}

const AddFriendModal = ({ onClose }: AddFriendModalProps) => {
  const { addFriend } = useChat();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    if (email.trim() && email.includes("@")) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addFriend(email.trim());
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Thêm bạn bè</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/10 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email người bạn muốn thêm..."
              className="w-full px-3 py-2 border rounded-lg bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-sm text-gray-600">
            Nhập địa chỉ email của người bạn muốn kết bạn. Họ sẽ nhận được lời
            mời kết bạn.
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleAdd}
            disabled={!email.trim() || !email.includes("@") || isLoading}
            className="cursor-pointer px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Đang thêm...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Thêm bạn</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriendModal;
