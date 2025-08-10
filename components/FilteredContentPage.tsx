"use client";
import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import ContentCard from "@/components/ContentCard";
import AuthGuard from "@/components/AuthGuard";
import DeleteModal from "@/components/DeleteModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getContent, deleteContent } from "@/service/content";
import { toast } from "react-toastify";
import { useState } from "react";

interface FilteredContentPageProps {
  contentType: string;
  title: string;
  description: string;
  emptyIcon: string;
  emptyTitle: string;
  emptyDescription: string;
}

export default function FilteredContentPage({
  contentType,
  title,
  description,
  emptyIcon,
  emptyTitle,
  emptyDescription,
}: FilteredContentPageProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["content", contentType],
    queryFn: () => getContent({ embedType: contentType }),
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

  const handleDeleteClick = (contentId: string) => {
    setDeleteModal({ isOpen: true, contentId, isDeleting: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.contentId) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));

    try {
      await deleteContent(deleteModal.contentId);
      queryClient.invalidateQueries({ queryKey: ["content", contentType] });
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
          <ContentGrid title={title} description={description}>
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
          <ContentGrid title={title} description={description}>
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
        <ContentGrid title={title} description={description}>
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
                onEdit={() => console.log("Edit:", item._id)}
                onDelete={() => handleDeleteClick(item._id)}
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center py-12">
              <div className="space-y-4 text-center">
                <div className="text-6xl">{emptyIcon}</div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {emptyTitle}
                </h3>
                <p className="mx-auto max-w-md text-gray-600">
                  {emptyDescription}
                </p>
                <p className="text-sm font-medium text-purple-600">
                  Click "Add Content" above to get started 👆
                </p>
              </div>
            </div>
          )}
        </ContentGrid>

        <DeleteModal
          isOpen={deleteModal.isOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          isDeleting={deleteModal.isDeleting}
        />
      </Layout>
    </AuthGuard>
  );
}
