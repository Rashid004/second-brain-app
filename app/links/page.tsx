import FilteredContentPage from "@/components/FilteredContentPage";

export default function LinksPage() {
  return (
    <FilteredContentPage
      contentType="link"
      title="Your Links"
      description="All your saved links and web resources"
      emptyIcon="🔗"
      emptyTitle="No Links Yet"
      emptyDescription="Save useful links, resources, and websites that you want to revisit."
    />
  );
}
