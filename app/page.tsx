import Layout from "@/components/Layout";
import ContentGrid from "@/components/ContentGrid";
import ContentCard from "@/components/ContentCard";

export default function Home() {
  const sampleContent = [
    {
      id: "1",
      title: "Getting Started with Second Brain",
      content:
        "Welcome to your Second Brain! This is where you can store and organize all your thoughts, ideas, and knowledge. Start by creating your first post and sharing your insights with the community.",
      author: "System",
      createdAt: new Date().toISOString(),
      tags: ["welcome", "getting-started"],
    },
    {
      id: "2",
      title: "Tips for Better Content Organization",
      content:
        "Use tags effectively to categorize your content. Think of tags as a way to create connections between different pieces of information. This helps you find related content quickly.",
      author: "System",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      tags: ["organization", "tips", "productivity"],
    },
    {
      id: "3",
      title: "Sharing Your Knowledge",
      content:
        "The best way to learn is to teach others. Share your insights, experiences, and learnings with the community. Every piece of knowledge you share helps others grow.",
      author: "System",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      tags: ["sharing", "community", "learning"],
    },
  ];

  return (
    <Layout>
      <ContentGrid
        title="Welcome to Second Brain"
        description="Discover, share, and organize your thoughts and knowledge"
      >
        {sampleContent.map((item) => (
          <ContentCard
            key={item.id}
            title={item.title}
            content={item.content}
            author={item.author}
            createdAt={item.createdAt}
            tags={item.tags}
            onEdit={() => console.log("Edit:", item.id)}
            onDelete={() => console.log("Delete:", item.id)}
            onShare={() => console.log("Share:", item.id)}
          />
        ))}
      </ContentGrid>
    </Layout>
  );
}
