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
import { addContent } from "@/service/add";
import { ContentFormData } from "@/types/content";
import { toast } from "react-toastify";
import { detectEmbedType, isValidUrl } from "@/utils/embedUtils";

export enum ContentType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
}

interface AddContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: ContentFormData) => void;
  onSuccess?: () => void;
}

export default function AddContentModal({
  isOpen,
  onClose,
  onSubmit,
  onSuccess,
}: AddContentModalProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    title: "",
    description: "",
    contentType: ContentType.TEXT,
    tags: [],
    link: "",
    embedInfo: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

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

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        contentType: ContentType.TEXT,
        tags: [],
        link: "",
        embedInfo: undefined,
      });
      setTagInput("");
    }
  }, [isOpen]);

  const handleLinkChange = (input: string) => {
    setFormData((prev) => ({ ...prev, link: input }));

    if (input.trim()) {
      const embedInfo = detectEmbedType(input);
      setFormData((prev) => ({ ...prev, embedInfo }));

      if (embedInfo.type === "youtube") {
        setFormData((prev) => ({ ...prev, contentType: ContentType.VIDEO }));
      } else if (embedInfo.type === "image") {
        setFormData((prev) => ({ ...prev, contentType: ContentType.IMAGE }));
      } else if (embedInfo.type === "twitter") {
        setFormData((prev) => ({ ...prev, contentType: ContentType.TEXT }));
      }
    } else {
      setFormData((prev) => ({ ...prev, embedInfo: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addContent(formData);
      setFormData({
        title: "",
        description: "",
        contentType: ContentType.TEXT,
        tags: [],
        link: "",
        embedInfo: undefined,
      });
      setTagInput("");
      onClose();
      onSuccess?.();
      toast.success("Content added successfully!");
    } catch (error: any) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Content could not be added.");
      }
    } finally {
      setLoading(false);
    }
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

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
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

          {/* Link or Embed Code */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Link or Embed Code
            </label>
            <div className="relative">
              <IconLink className="absolute top-3 left-3 h-5 w-5 text-gray-400" />
              <textarea
                value={formData.link}
                onChange={(e) => handleLinkChange(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 py-3 pr-4 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500"
                placeholder="Paste URL, YouTube iframe, or Twitter embed code here..."
              />
            </div>

            {/* Embed Preview */}
            {formData.embedInfo && (
              <div className="mt-3 rounded-lg bg-gray-50 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Detected:</span>
                  <span className="capitalize">{formData.embedInfo.type}</span>
                  {formData.embedInfo.type === "youtube" && (
                    <span className="text-red-600">📺</span>
                  )}
                  {formData.embedInfo.type === "twitter" && (
                    <span className="text-blue-500">🐦</span>
                  )}
                  {formData.embedInfo.type === "image" && (
                    <span className="text-green-600">🖼️</span>
                  )}
                  {formData.embedInfo.type === "iframe" && (
                    <span className="text-purple-600">🔗</span>
                  )}
                </div>
                {formData.embedInfo.type === "youtube" &&
                  formData.embedInfo.embedUrl && (
                    <div className="mt-2">
                      <iframe
                        src={formData.embedInfo.embedUrl}
                        className="aspect-video w-full max-w-sm rounded border-0"
                        title="Preview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  )}
              </div>
            )}
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
                  onKeyDown={handleTagKeyDown}
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
              disabled={loading}
              className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
            >
              {loading ? "Adding..." : "Add Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
