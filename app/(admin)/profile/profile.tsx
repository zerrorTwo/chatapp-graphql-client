"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Camera, Edit3, Save, X } from "lucide-react";
import { useChat } from "@/app/context/ChatContext";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import {
  UPLOAD_AVATAR,
  UPDATE_USER,
} from "@/app/graphql/mutations/users/update.mutation";
import { toast } from "sonner";
import { useLoading } from "@/app/context/loadingContext";

const Profile = () => {
  const { currentUser } = useChat();
  const [uploadAvatar] = useMutation(UPLOAD_AVATAR);
  const [updateUser] = useMutation(UPDATE_USER);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const [bio, setBio] = useState("Xin chào! Tôi đang sử dụng Messenger.");
  const [status, setStatus] = useState<boolean | null>(null);
  const { setLoading } = useLoading();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file); // Lưu file, không upload ngay
    }
  };

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setAvatarUrl(currentUser.avatarUrl);
      setStatus(
        typeof currentUser.status === "boolean" ? currentUser.status : null
      );
    }
  }, [currentUser]);

  const handleSave = async () => {
    let newAvatarUrl = avatarUrl;
    if (selectedFile && selectedFile instanceof File) {
      try {
        const uploadRes = await uploadAvatar({
          variables: { file: selectedFile },
        });
        console.log("uplaodadada", uploadRes);
        newAvatarUrl = uploadRes.data?.uploadAvatar;
      } catch (err) {
        toast.error("Upload failed!");
        return;
      }
    }
    try {
      setLoading(true);
      await updateUser({
        variables: {
          dataUpdate: {
            userName: name,
            status, // boolean value
            avatarUrl: newAvatarUrl,
          },
        },
      });
      setLoading(false);
      setAvatarUrl(newAvatarUrl);
      setIsEditing(false);
      setSelectedFile(null); // Reset file sau khi upload thành công
      toast.success("Update successfully!!");
    } catch (err) {
      setLoading(false);
      toast.error("Update failed!!");
    }
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
            <div className="p-8 bg-white rounded-2xl shadow flex flex-col items-center w-full">
              <div className="relative group">
                {/* Avatar Preview hoặc Chữ cái đầu */}
                <div className="w-36 h-36 rounded-full border-4 border-blue-400 bg-gradient-to-br from-blue-400 to-blue-200 text-white text-5xl font-extrabold flex items-center justify-center shadow-lg overflow-hidden">
                  {avatarPreview || avatarUrl ? (
                    <img
                      src={avatarPreview || avatarUrl!}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    name?.charAt(0)
                  )}
                </div>

                {/* Button giữ nguyên, có chọn ảnh */}
                {isEditing && (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-white border border-blue-300 shadow hover:bg-blue-50 transition"
                    >
                      <Camera className="w-5 h-5 text-blue-600" />
                    </button>
                  </>
                )}
              </div>

              <h2 className="text-2xl font-bold mt-4 text-blue-700">{name}</h2>
              <p className="text-gray-500">{email}</p>
            </div>

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

            {/* Name */}
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
                  disabled
                  className="w-full px-4 py-2 border-2 rounded-lg bg-white border-blue-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  value={email}
                  readOnly
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
                  value={
                    status === true ? "true" : status === false ? "false" : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "true") setStatus(true);
                    else if (value === "false") setStatus(false);
                    else setStatus(null);
                  }}
                >
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="true">Trực tuyến</option>
                  <option value="false">Ngoại tuyến</option>
                </select>
              ) : (
                <div className="flex items-center p-3 rounded-lg bg-blue-50">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 ${
                      status === true ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                  <span className="text-gray-800 font-medium">
                    {status === true
                      ? "Trực tuyến"
                      : status === false
                      ? "Ngoại tuyến"
                      : "Không xác định"}
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
