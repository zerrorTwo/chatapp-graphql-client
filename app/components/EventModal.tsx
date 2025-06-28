"use client";

import React, { useState } from "react";
import { X, Calendar } from "lucide-react";

interface EventModalProps {
  onClose: () => void;
  onCreateEvent: (title: string, date: string, time: string) => void;
}

const EventModal = ({ onClose, onCreateEvent }: EventModalProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleCreate = () => {
    if (title.trim() && date && time) {
      onCreateEvent(title.trim(), date, time);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Calendar className="w-6 h-6 mr-2" />
            Tạo lịch hẹn
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/10 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Tiêu đề sự kiện
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề sự kiện..."
              className="w-full px-3 py-2 border rounded-lg bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Ngày
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Giờ
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Tạo một lịch hẹn để nhắc nhở mọi người trong cuộc trò chuyện.
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleCreate}
            disabled={!title.trim() || !date || !time}
            className="cursor-pointer px-4 py-2 text-white rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
          >
            Tạo lịch hẹn
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
