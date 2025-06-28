"use client";
import { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext";
import {
  Send,
  Image,
  Calendar,
  Vote,
  Gamepad2,
  MoreVertical,
  X,
} from "lucide-react";
import ChatSettings from "./ChatSettings";
import PollModal from "./PollModal";
import EventModal from "./EventModal";

const ChatWindow = () => {
  const { chats, activeChat, sendMessage, currentUser, users } = useChat();
  const [message, setMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chat = chats.find((c) => c.id === activeChat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const handleSend = () => {
    if (message.trim() && activeChat) {
      sendMessage(activeChat, message.trim());
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getUserName = (userId: string) => {
    if (chat?.nicknames && chat.nicknames[userId]) {
      return chat.nicknames[userId];
    }
    const user = users.find((u) => u.id === userId);
    return user?.name || "Unknown";
  };

  const getBackgroundStyle = () => {
    if (chat?.background) {
      if (chat.background.startsWith("#")) {
        return { backgroundColor: chat.background };
      } else if (chat.background.startsWith("gradient-")) {
        const gradients = {
          "gradient-sunset": "linear-gradient(135deg, #ff6b6b, #ffd93d)",
          "gradient-ocean": "linear-gradient(135deg, #667eea, #764ba2)",
          "gradient-forest": "linear-gradient(135deg, #11998e, #38ef7d)",
          "gradient-purple": "linear-gradient(135deg, #667eea, #764ba2)",
        };
        return {
          backgroundImage:
            gradients[chat.background as keyof typeof gradients] || "",
        };
      }
    }
    return {};
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: string[] = [];
      let loaded = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (ev) => {
          newImages.push(ev.target?.result as string);
          loaded++;
          if (loaded === files.length) {
            setSelectedImages((prev) => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleRemoveImage = (idx: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!activeChat || !chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full flex items-center justify-center bg-blue-500">
            <Send className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Chọn một cuộc trò chuyện
          </h2>
          <p className="text-gray-600">
            Chọn từ danh sách bên trái để bắt đầu nhắn tin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-1 h-full w-full">
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          showSettings ? "max-w-[calc(100%-24rem)]" : ""
        }`}
      >
        {/* Chat Header */}
        <div className="p-4 border-b flex items-center justify-between bg-white border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-primary">
              {chat.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-gray-800">{chat.name}</h2>
              <p className="text-sm text-gray-600 flex items-center">
                {chat.isGroup ? (
                  `${chat.participants.length} thành viên`
                ) : (
                  <>
                    Đang hoạt động
                    <span className="ml-2 w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!chat.isGroup && (
              <button className="p-2 rounded-lg hover:bg-black/10 cursor-pointer">
                <Gamepad2 className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg hover:bg-black/10 cursor-pointer"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={getBackgroundStyle()}
        >
          {chat.messages.map((msg) => {
            const isOwn = msg.sender === currentUser.id;
            const isSystem = msg.sender === "system";

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center ">
                  <span className="text-sm px-3 py-1 rounded-full bg-gray-200 text-gray-600">
                    {msg.content}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md ${
                    isOwn ? "order-2" : "order-1"
                  }`}
                >
                  {!isOwn && chat.isGroup && (
                    <p className="text-xs mb-1 text-gray-600">
                      {getUserName(msg.sender)}
                    </p>
                  )}
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwn
                        ? "text-white rounded-br-md bg-primary"
                        : "bg-gray-200 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-right" : "text-left"
                    } text-gray-500`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <button
                className="p-2 rounded-lg hover:bg-black/10 cursor-pointer"
                onClick={handleImageButtonClick}
                type="button"
              >
                <Image className="w-5 h-5 text-gray-600" />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
              </button>
              <button
                onClick={() => setShowEvent(true)}
                className="p-2 rounded-lg hover:bg-black/10 cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setShowPoll(true)}
                className="p-2 rounded-lg hover:bg-black/10 cursor-pointer"
              >
                <Vote className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex-1 relative">
              {selectedImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt="preview"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-white hover:bg-gray-200 shadow"
                        type="button"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="w-full px-4 py-2 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 ring-blue-500"
                style={selectedImages.length > 0 ? { marginTop: "0.5rem" } : {}}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="p-2 rounded-full text-white disabled:opacity-50 bg-primary"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      {showSettings && (
        <ChatSettings chat={chat} onClose={() => setShowSettings(false)} />
      )}

      {showPoll && (
        <PollModal
          onClose={() => setShowPoll(false)}
          onCreatePoll={(question, options) => {
            sendMessage(activeChat, question, "poll", { options });
            setShowPoll(false);
          }}
        />
      )}
      {showEvent && (
        <EventModal
          onClose={() => setShowEvent(false)}
          onCreateEvent={(title, date, time) => {
            sendMessage(activeChat, title, "event", { date, time });
            setShowEvent(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatWindow;
