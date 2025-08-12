"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ContentCard from "@/components/ContentCard";
import { IconBrain, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

interface SharedContent {
  _id: string;
  title: string;
  description: string;
  link: string;
  tags: string[];
  embedInfo?: {
    type: "youtube" | "twitter" | "iframe" | "image" | "link";
    embedUrl?: string;
    thumbnail?: string;
    title?: string;
  };
  user: {
    _id: string;
    userName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface SharedResponse {
  message: string;
  content: SharedContent[];
  owner: {
    userName: string;
    email: string;
  };
  totalContent: number;
}

export default function SharedBrainPage() {
  const params = useParams();
  const hash = params.hash as string;
  const [data, setData] = useState<SharedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/shared/${hash}`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to load shared content");
        }

        const result: SharedResponse = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (hash) {
      fetchSharedContent();
    }
  }, [hash]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading shared brain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md p-8 text-center">
          <div className="mb-4 text-6xl">🔗</div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            Link Not Found
          </h1>
          <p className="mb-6 text-gray-600">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white transition-colors hover:bg-purple-700"
          >
            <IconArrowLeft className="h-4 w-4" />
            Go to Brainly
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBrain className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {data?.owner?.userName}'s Brain
                </h1>
                <p className="text-sm text-gray-600">
                  {data?.totalContent} pieces of content
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700"
            >
              <IconArrowLeft className="h-4 w-4" />
              Create Your Own
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {data?.content && data.content.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.content.map((item) => (
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
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">🧠</div>
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              This Brain is Empty
            </h2>
            <p className="text-gray-600">No content has been shared yet.</p>
          </div>
        )}
      </main>
    </div>
  );
}
