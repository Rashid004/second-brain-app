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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared brain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Link Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <IconArrowLeft className="w-4 h-4" />
            Go to Brainly
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconBrain className="w-8 h-8 text-purple-600" />
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
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              <IconArrowLeft className="w-4 h-4" />
              Create Your Own
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              This Brain is Empty
            </h2>
            <p className="text-gray-600">
              No content has been shared yet.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}