"use client";
import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import AuthGuard from "@/components/AuthGuard";
import { useQuery } from "@tanstack/react-query";
import { getAllContent } from "@/service/content";
import { useState } from "react";

export default function TagsPage() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["content"],
    queryFn: () => getAllContent(),
  });

  const allTags = Array.from(
    new Set(
      data?.content?.flatMap(item => item.tags || []) || []
    )
  ).sort();

  const filteredContent = selectedTag 
    ? data?.content?.filter(item => item.tags?.includes(selectedTag)) || []
    : data?.content || [];

  if (isLoading) {
    return (
      <AuthGuard>
        <Layout>
          <ContentGrid
            title="Your Tags"
            description="Browse content by tags and categories"
          >
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading tags...</p>
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
            title="Your Tags"
            description="Browse content by tags and categories"
          >
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <p className="text-red-600">Error loading tags. Please try again.</p>
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
          title="Your Tags"
          description="Browse content by tags and categories"
        >
          <div className="col-span-full mb-8">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !selectedTag
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All ({data?.content?.length || 0})
              </button>
            </div>
            
            {allTags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const count = data?.content?.filter(item => item.tags?.includes(tag)).length || 0;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                        selectedTag === tag
                          ? "bg-purple-600 text-white"
                          : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                      }`}
                    >
                      #{tag}
                      <span className="text-xs opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🏷️</div>
                <p className="text-gray-600">No tags found. Add some tags to your content to organize it better.</p>
              </div>
            )}
          </div>

          {filteredContent.length > 0 ? (
            <div className="col-span-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredContent.map((item) => (
                <div key={item._id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>By {item.user.userName}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedTag ? (
            <div className="col-span-full text-center py-12">
              <div className="text-4xl mb-2">🏷️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No content found for #{selectedTag}</h3>
              <p className="text-gray-600">Try selecting a different tag or add more content with this tag.</p>
            </div>
          ) : null}
        </ContentGrid>
      </Layout>
    </AuthGuard>
  );
}