"use client";
import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import ContentCard from "@/components/ContentCard";
import AuthGuard from "@/components/AuthGuard";
import DeleteModal from "@/components/DeleteModal";
import AddContentModal from "@/components/AddContentModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllContent, deleteContent } from "@/service/content";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["content"],
    queryFn: () => getAllContent(),
  });

  const queryClient = useQueryClient();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    contentId: string | null;
    isDeleting: boolean;
  }>({
    isOpen: false,
    contentId: null,
    isDeleting: false,
  });

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    contentId: string | null;
  }>({
    isOpen: false,
    contentId: null,
  });

  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });

  const handleDeleteClick = (contentId: string) => {
    setDeleteModal({ isOpen: true, contentId, isDeleting: false });
  };

  const handleEditClick = (contentId: string) => {
    setEditModal({ isOpen: true, contentId });
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["content"] });
    setConfirmationModal({
      isOpen: true,
      title: "Content Updated",
      message: "Your content has been successfully updated!",
    });
  };

  const handleCloseEditModal = () => {
    setEditModal({ isOpen: false, contentId: null });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.contentId) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await deleteContent(deleteModal.contentId);
      queryClient.invalidateQueries({ queryKey: ["content"] });
      toast.success("Content deleted successfully!");
      setDeleteModal({ isOpen: false, contentId: null, isDeleting: false });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to delete content");
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleCloseDeleteModal = () => {
    if (!deleteModal.isDeleting) {
      setDeleteModal({ isOpen: false, contentId: null, isDeleting: false });
    }
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <Layout>
          <ContentGrid
            title="Welcome to Second Brain"
            description="Discover, share, and organize your thoughts and knowledge"
          >
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading content...</p>
              </div>
            </div>
          </ContentGrid>
        </Layout>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <Layout>
          <ContentGrid
            title="Welcome to Second Brain"
            description="Discover, share, and organize your thoughts and knowledge"
          >
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-red-600">
                  Error loading content. Please try again.
                </p>
              </div>
            </div>
          </ContentGrid>
        </Layout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <Layout>
        <ContentGrid
          title="My Second Brain"
          description="Your personal knowledge base - all your content in one place"
        >
          {data?.content && data.content.length > 0 ? (
            data.content.map((item) => (
              <ContentCard
                key={item._id}
                id={item._id}
                title={item.title}
                content={item.description}
                author={item.user.userName}
                createdAt={item.createdAt}
                tags={item.tags}
                link={item.link}
                embedInfo={item.embedInfo}
                onEdit={() => handleEditClick(item._id)}
                onDelete={() => handleDeleteClick(item._id)}
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="space-y-4 text-center">
                <div className="text-6xl">🧠</div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Your Second Brain is Empty
                </h3>
                <p className="mx-auto max-w-md text-gray-600">
                  Start building your personal knowledge base by adding your
                  first piece of content. You can add links, YouTube videos,
                  Twitter posts, or any web content!
                </p>
                <p className="text-sm font-medium text-purple-600">
                  Click "Add Content" above to get started 👆
                </p>
              </div>
            </div>
          )}
        </ContentGrid>

        {/* Delete Modal */}
        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteModal.isDeleting}
        />

        {/* Edit Modal */}
        <AddContentModal
          isOpen={editModal.isOpen}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
          contentId={editModal.contentId || undefined}
          isEditMode={true}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ isOpen: false, title: "", message: "" })}
          title={confirmationModal.title}
          message={confirmationModal.message}
          type="success"
        />
      </Layout>
    </AuthGuard>
  );
}
