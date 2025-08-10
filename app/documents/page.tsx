import FilteredContentPage from "@/components/FilteredContentPage";

export default function DocumentsPage() {
  return (
    <FilteredContentPage
      contentType="document"
      title="Your Documents"
      description="All your saved articles, blogs, and text content"
      emptyIcon="📄"
      emptyTitle="No Documents Yet"
      emptyDescription="Save articles, blog posts, and documents that you want to reference later."
    />
  );
}