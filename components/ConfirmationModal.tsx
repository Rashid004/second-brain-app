"use client";
import { useEffect } from "react";
import { IconCheck, IconX } from "@tabler/icons-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
  type?: "success" | "info" | "warning" | "error";
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText = "OK",
  onConfirm,
  type = "success",
}: ConfirmationModalProps) {
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

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const getIconAndColors = () => {
    switch (type) {
      case "success":
        return {
          icon: <IconCheck className="h-6 w-6" />,
          bgColor: "bg-green-100",
          textColor: "text-green-600",
          buttonColor: "bg-green-600 hover:bg-green-700",
        };
      case "error":
        return {
          icon: <IconX className="h-6 w-6" />,
          bgColor: "bg-red-100",
          textColor: "text-red-600",
          buttonColor: "bg-red-600 hover:bg-red-700",
        };
      case "warning":
        return {
          icon: <span className="text-2xl">⚠️</span>,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-600",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
        };
      default:
        return {
          icon: <span className="text-2xl">ℹ️</span>,
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  if (!isOpen) return null;

  const { icon, bgColor, textColor, buttonColor } = getIconAndColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center space-x-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgColor}`}>
            <span className={textColor}>{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
        </div>
        
        <p className="mb-6 text-gray-600">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Close
          </button>
          {onConfirm && (
            <button
              onClick={handleConfirm}
              className={`rounded-lg px-4 py-2 font-medium text-white transition-colors ${buttonColor}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}