"use client";
import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import ContentCard from "@/components/ContentCard";
import AuthGuard from "@/components/AuthGuard";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllContent, deleteContent } from "@/service/content";
import { toast } from "react-toastify";

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["content"],
    queryFn: () => getAllContent(),
  });
  
  const queryClient = useQueryClient();

  const handleDelete = async (contentId: string) => {
    if (confirm("Are you sure you want to delete this content?")) {
      try {
        await deleteContent(contentId);
        queryClient.invalidateQueries({ queryKey: ["content"] });
        toast.success("Content deleted successfully!");
      } catch (error: any) {
        toast.error(error.response?.data?.error || "Failed to delete content");
      }
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
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
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
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <p className="text-red-600">Error loading content. Please try again.</p>
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
                onEdit={() => console.log("Edit:", item._id)}
                onDelete={() => handleDelete(item._id)}
                onShare={() => console.log("Share:", item._id)}
              />
            ))
          ) : (
            <div className="flex justify-center items-center py-12 col-span-full">
              <div className="text-center space-y-4">
                <div className="text-6xl">🧠</div>
                <h3 className="text-xl font-semibold text-gray-800">Your Second Brain is Empty</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Start building your personal knowledge base by adding your first piece of content. 
                  You can add links, YouTube videos, Twitter posts, or any web content!
                </p>
                <p className="text-sm text-purple-600 font-medium">
                  Click "Add Content" above to get started 👆
                </p>
              </div>
            </div>
          )}
        </ContentGrid>
      </Layout>
    </AuthGuard>
  );
}
