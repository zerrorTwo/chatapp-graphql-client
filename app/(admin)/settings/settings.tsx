"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  Palette,
  Sun,
  Bell,
  Shield,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#0084ff"); // Màu mặc định

  const colorOptions = [
    { name: "Messenger Blue", value: "#0084ff" },
    { name: "Teal", value: "#20b2aa" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Green", value: "#10b981" },
    { name: "Orange", value: "#f97316" },
    { name: "Red", value: "#ef4444" },
    { name: "Indigo", value: "#6366f1" },
  ];

  const handleChangePrimaryColor = (color: string) => {
    setPrimaryColor(color);
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--primary", color);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="max-w-5xl mx-auto p-6 w-full">
        {/* Header */}
        <div className="flex items-center mb-8 w-full">
          <Link href="/" className="p-2 rounded-lg mr-4 hover:bg-black/10">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Cài đặt</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Theme Settings */}
          <div className="p-6 rounded-lg bg-white shadow-lg w-full">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <Palette className="w-6 h-6 mr-2" />
              Giao diện
            </h2>

            {/* Màu chủ đạo */}
            <div>
              <h3 className="font-medium mb-3 text-gray-800">Màu chủ đạo</h3>
              <div className="grid grid-cols-4 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleChangePrimaryColor(color.value)}
                    className={`h-12 rounded-lg border-2 transition-all ${
                      primaryColor === color.value
                        ? "border-gray-800 scale-110"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="p-6 rounded-lg bg-white shadow-lg w-full">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <Bell className="w-6 h-6 mr-2" />
              Thông báo
            </h2>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-800">
                  Thông báo tin nhắn
                </h3>
                <p className="text-sm text-gray-600">
                  Nhận thông báo khi có tin nhắn mới
                </p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notificationsEnabled ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="p-6 rounded-lg bg-white shadow-lg w-full">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <Shield className="w-6 h-6 mr-2" />
              Bảo mật & Riêng tư
            </h2>

            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-black/10">
                <div className="font-medium text-gray-800">Khóa ứng dụng</div>
                <div className="text-sm text-gray-600">
                  Yêu cầu xác thực khi mở ứng dụng
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-black/10">
                <div className="font-medium text-gray-800">Chặn người dùng</div>
                <div className="text-sm text-gray-600">
                  Quản lý danh sách người dùng bị chặn
                </div>
              </button>
            </div>
          </div>

          {/* Help & Support */}
          <div className="p-6 rounded-lg bg-white shadow-lg w-full">
            <h2 className="text-xl font-bold mb-4 flex items-center text-gray-800">
              <HelpCircle className="w-6 h-6 mr-2" />
              Trợ giúp & Hỗ trợ
            </h2>

            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg hover:bg-black/10">
                <div className="font-medium text-gray-800">
                  Câu hỏi thường gặp
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-black/10">
                <div className="font-medium text-gray-800">Liên hệ hỗ trợ</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg hover:bg-black/10">
                <div className="font-medium text-gray-800">Về ứng dụng</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
