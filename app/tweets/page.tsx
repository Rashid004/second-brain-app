import FilteredContentPage from "@/components/FilteredContentPage";

export default function TweetsPage() {
  return (
    <FilteredContentPage
      contentType="twitter"
      title="Your Tweets"
      description="All your saved Twitter posts and threads"
      emptyIcon="🐦"
      emptyTitle="No Tweets Yet"
      emptyDescription="Start saving interesting tweets and threads to build your Twitter knowledge base."
    />
  );
}
