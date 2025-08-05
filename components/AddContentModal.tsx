"use client";
import { useState, useEffect } from "react";
import {
  IconX,
  IconFileText,
  IconPhoto,
  IconVideo,
  IconMusic,
  IconLink,
  IconHash,
} from "@tabler/icons-react";

export enum ContentType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
}

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContentFormData) => void;
}

export interface ContentFormData {
  title: string;
  description: string;
  contentType: ContentType;
  tags: string[];
  link: string;
}

export default function AddContentModal({
  isOpen,
  onClose,
  onSubmit,
}: AddContentModalProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    title: "",
    description: "",
    contentType: ContentType.TEXT,
    tags: [],
    link: "",
  });

  const [tagInput, setTagInput] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        contentType: ContentType.TEXT,
        tags: [],
        link: "",
      });
      setTagInput("");
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case ContentType.TEXT:
        return <IconFileText className="h-5 w-5" />;
      case ContentType.IMAGE:
        return <IconPhoto className="h-5 w-5" />;
      case ContentType.VIDEO:
        return <IconVideo className="h-5 w-5" />;
      case ContentType.AUDIO:
        return <IconMusic className="h-5 w-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            Add New Content
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <IconX className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="Enter content title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500"
              placeholder="Describe your content"
              required
            />
          </div>

          {/* Content Type */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Content Type *
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Object.values(ContentType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, contentType: type }))
                  }
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    formData.contentType === type
                      ? "border-purple-500 bg-purple-50 text-purple-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {getContentTypeIcon(type)}
                  <span className="text-sm font-medium capitalize">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Link */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Link (Optional)
            </label>
            <div className="relative">
              <IconLink className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="url"
                value={formData.link}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, link: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="space-y-3">
              <div className="relative">
                <IconHash className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="w-full rounded-lg border border-gray-300 py-3 pr-24 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded-md bg-purple-600 px-3 py-1 text-sm text-white transition-colors hover:bg-purple-700"
                >
                  Add
                </button>
              </div>

              {/* Tags Display */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-purple-600"
                      >
                        <IconX className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
            >
              Add Content
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
