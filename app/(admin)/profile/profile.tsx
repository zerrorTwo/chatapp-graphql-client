"use client";
import React, { useState } from "react";
import { ArrowLeft, Camera, Edit3, Save, X } from "lucide-react";
import { useChat } from "@/app/context/ChatContext";
import Link from "next/link";

const Profile = () => {
  const { currentUser } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [bio, setBio] = useState("Xin chào! Tôi đang sử dụng Messenger.");
  const [status, setStatus] = useState(currentUser.status);

  const statusOptions = [
    { value: "online", label: "Trực tuyến", color: "bg-green-500" },
    { value: "away", label: "Vắng mặt", color: "bg-yellow-500" },
    { value: "busy", label: "Bận", color: "bg-red-500" },
    { value: "offline", label: "Ngoại tuyến", color: "bg-gray-500" },
  ];

  const handleSave = () => {
    console.log("Saving:", { name, email, bio, status });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white w-full">
      <div className="max-w-5xl mx-auto p-6 space-y-10 w-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <Link href="/" className="p-2 mr-4 rounded-lg hover:bg-blue-100">
              <ArrowLeft className="w-6 h-6 text-blue-600" />
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Trang cá nhân
            </h1>
          </div>
          {isEditing ? (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
              <button
                onClick={handleSave}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow"
              >
                <Save className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 hover:bg-blue-100 rounded-lg"
            >
              <Edit3 className="w-6 h-6 text-blue-600" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Avatar + Statistics */}
          <div className="col-span-1 flex flex-col items-center space-y-8">
            {/* Avatar */}
            <div className="p-8 bg-white rounded-2xl shadow flex flex-col items-center w-full">
              <div className="relative group">
                <div className="w-36 h-36 rounded-full border-4 border-blue-400 bg-gradient-to-br from-blue-400 to-blue-200 text-white text-5xl font-extrabold flex items-center justify-center shadow-lg">
                  {name.charAt(0)}
                </div>
                {isEditing && (
                  <button className="absolute bottom-2 right-2 p-2 rounded-full bg-white border border-blue-300 shadow hover:bg-blue-50 transition">
                    <Camera className="w-5 h-5 text-blue-600" />
                  </button>
                )}
              </div>
              <h2 className="text-2xl font-bold mt-4 text-blue-700">{name}</h2>
              <p className="text-gray-500">{email}</p>
            </div>
            {/* Statistics */}
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="p-6 bg-white rounded-2xl shadow flex flex-col items-center">
                <div className="text-3xl font-extrabold text-blue-600 mb-1">
                  12
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Cuộc trò chuyện
                </div>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow flex flex-col items-center">
                <div className="text-3xl font-extrabold text-blue-600 mb-1">
                  156
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Tin nhắn đã gửi
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="col-span-2 p-8 bg-white rounded-2xl shadow space-y-6 w-full">
            <h3 className="text-xl font-bold text-blue-700 mb-2">
              Thông tin cá nhân
            </h3>

            {/* Tên */}
            <div>
              <label className="text-sm font-semibold mb-2 text-gray-700 block">
                Tên hiển thị
              </label>
              {isEditing ? (
                <input
                  className="w-full px-4 py-2 border-2 rounded-lg bg-white border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <p className="bg-blue-50 p-3 rounded-lg text-gray-800 font-medium">
                  {name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold mb-2 text-gray-700 block">
                Email
              </label>
              {isEditing ? (
                <input
                  className="w-full px-4 py-2 border-2 rounded-lg bg-white border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <p className="bg-blue-50 p-3 rounded-lg text-gray-800 font-medium">
                  {email}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-semibold mb-2 text-gray-700 block">
                Giới thiệu
              </label>
              {isEditing ? (
                <textarea
                  className="w-full px-4 py-2 border-2 rounded-lg bg-white border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              ) : (
                <p className="bg-blue-50 p-3 rounded-lg text-gray-800 font-medium">
                  {bio}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-semibold mb-2 text-gray-700 block">
                Trạng thái
              </label>
              {isEditing ? (
                <select
                  className="w-full px-4 py-2 border-2 rounded-lg bg-white border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "online" | "offline" | "away")
                  }
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex items-center p-3 rounded-lg bg-blue-50">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      statusOptions.find((o) => o.value === status)?.color
                    }`}
                  />
                  <span className="text-gray-800 font-medium">
                    {statusOptions.find((o) => o.value === status)?.label ||
                      "Không xác định"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
