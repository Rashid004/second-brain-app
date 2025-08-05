"use client";
import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import AddContentModal, { ContentFormData } from "./AddContentModal";
import { IconMenu2, IconPlus, IconShare } from "@tabler/icons-react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false);

  const handleAddContent = (data: ContentFormData) => {
    console.log("New content:", data);
    // TODO: Integrate with your API
  };

  useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileSidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
      </div>

      <main className="w-full flex-1">
        {/* Header with buttons */}
        <header className="border-b border-gray-200 bg-white px-4 py-3 md:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
              >
                <IconMenu2 className="h-6 w-6" />
              </button>

              {/* Mobile logo */}
              <div className="flex items-center gap-2 md:hidden">
                <img
                  src="/brainly.png"
                  alt="Brainly Logo"
                  className="h-6 w-auto"
                />
                <h1 className="text-lg font-semibold text-purple-900">
                  Brainly
                </h1>
              </div>
            </div>

            {/* Top right buttons */}
            <div className="flex items-center gap-2">
              <button className="flex items-center justify-center gap-2 rounded-lg bg-purple-100 px-3 py-2 text-sm font-medium text-purple-800 transition-colors hover:bg-purple-200">
                <IconShare className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={() => setIsAddContentModalOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                <IconPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Content</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">{children}</div>
      </main>

      {/* Add Content Modal */}
      <AddContentModal
        isOpen={isAddContentModalOpen}
        onClose={() => setIsAddContentModalOpen(false)}
        onSubmit={handleAddContent}
      />
    </div>
  );
}
