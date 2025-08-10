"use client";
import { useState, useEffect } from "react";
import { IconX, IconShare, IconCopy, IconCheck, IconTrash } from "@tabler/icons-react";
import { createShareLink, deleteShareLink, getShareStatus } from "@/service/share";
import { toast } from "react-toastify";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchShareStatus();
    }
  }, [isOpen]);

  const fetchShareStatus = async () => {
    try {
      setIsLoading(true);
      const response = await getShareStatus();
      setIsShared(response.isShared || false);
      setShareLink(response.shareLink || null);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to get share status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateShare = async () => {
    try {
      setIsLoading(true);
      const response = await createShareLink();
      setIsShared(true);
      setShareLink(response.shareLink || null);
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create share link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteShare = async () => {
    try {
      setIsLoading(true);
      const response = await deleteShareLink();
      setIsShared(false);
      setShareLink(null);
      setCopied(false);
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to remove share link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (shareLink) {
      try {
        await navigator.clipboard.writeText(shareLink);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md mx-4 bg-white rounded-xl shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
              <IconShare className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Share Your Brain</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            disabled={isLoading}
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {!isShared ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    Create a shareable link to let others view your brain content.
                  </p>
                  <button
                    onClick={handleCreateShare}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    Create Share Link
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-4">
                    Your brain is now shareable! Anyone with this link can view your content.
                  </p>
                  
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg mb-4">
                    <input
                      type="text"
                      value={shareLink || ""}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
                      title="Copy link"
                    >
                      {copied ? (
                        <IconCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <IconCopy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCopyLink}
                      className="flex-1 bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors font-medium"
                    >
                      Copy Link
                    </button>
                    <button
                      onClick={handleDeleteShare}
                      className="flex items-center gap-2 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors font-medium"
                    >
                      <IconTrash className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}