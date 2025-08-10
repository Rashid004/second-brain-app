import FilteredContentPage from "@/components/FilteredContentPage";

export default function VideosPage() {
  return (
    <FilteredContentPage
      contentType="youtube"
      title="Your Videos"
      description="All your saved YouTube videos and educational content"
      emptyIcon="📹"
      emptyTitle="No Videos Yet"
      emptyDescription="Save educational videos, tutorials, and interesting content to learn from later."
    />
  );
}
