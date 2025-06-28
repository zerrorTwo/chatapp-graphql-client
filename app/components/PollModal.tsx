"use client";

import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

interface PollModalProps {
  onClose: () => void;
  onCreatePoll: (question: string, options: string[]) => void;
}

const PollModal = ({ onClose, onCreatePoll }: PollModalProps) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCreate = () => {
    const validOptions = options.filter((opt) => opt.trim());
    if (question.trim() && validOptions.length >= 2) {
      onCreatePoll(question.trim(), validOptions);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Tạo cuộc bình chọn
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/10 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Câu hỏi
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Nhập câu hỏi bình chọn..."
              className="w-full px-3 py-2 border rounded-lg bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Lựa chọn
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Lựa chọn ${index + 1}`}
                    className="flex-1 px-3 py-2 border rounded-lg bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="p-2 rounded-lg hover:bg-black/10"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 6 && (
              <button
                onClick={addOption}
                className="mt-2 flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-500"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm lựa chọn</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Hủy
          </button>
          <button
            onClick={handleCreate}
            disabled={
              !question.trim() || options.filter((opt) => opt.trim()).length < 2
            }
            className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50"
          >
            Tạo bình chọn
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollModal;
