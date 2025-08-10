import {
  IconBrandYoutube,
  IconShare,
  IconTrash,
  IconExternalLink,
  IconPhoto,
  IconBrandX,
  IconEdit,
} from "@tabler/icons-react";
import { EmbedInfo } from "@/types/content";

interface ContentCardProps {
  id: string;
  title: string;
  content: string;
  author?: string;
  createdAt: string;
  tags?: string[];
  link?: string;
  embedInfo?: EmbedInfo;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ContentCard({
  id,
  title,
  content,
  author,
  createdAt,
  tags = [],
  link,
  embedInfo,
  onEdit,
  onDelete,
}: ContentCardProps) {
  const getContentIcon = () => {
    if (!embedInfo)
      return (
        <IconExternalLink className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600 transition-transform duration-300 sm:h-6 sm:w-6 sm:group-hover:scale-110" />
      );

    switch (embedInfo.type) {
      case "youtube":
        return (
          <IconBrandYoutube className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 transition-transform duration-300 sm:h-6 sm:w-6 sm:group-hover:scale-110" />
        );
      case "twitter":
        return (
          <IconBrandX className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-500 transition-transform duration-300 sm:h-6 sm:w-6 sm:group-hover:scale-110" />
        );
      case "image":
        return (
          <IconPhoto className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 transition-transform duration-300 sm:h-6 sm:w-6 sm:group-hover:scale-110" />
        );
      default:
        return (
          <IconExternalLink className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600 transition-transform duration-300 sm:h-6 sm:w-6 sm:group-hover:scale-110" />
        );
    }
  };

  return (
    <div className="group w-full rounded-2xl border border-gray-200/50 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-purple-200/50 hover:bg-white hover:shadow-xl hover:shadow-purple-100/50 sm:p-6 sm:hover:-translate-y-1">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="line-clamp-2 flex items-start gap-2 text-base leading-tight font-semibold text-gray-900 lg:text-lg">
          {getContentIcon()}
          <span>{title}</span>
        </h3>
        <div className="flex space-x-2 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
          {onEdit && (
            <button
              onClick={onEdit}
              className="rounded-md p-1 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-blue-50 hover:text-blue-600"
              title="Edit"
            >
              <IconEdit className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="rounded-md p-1 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-red-50 hover:text-red-600"
              title="Delete"
            >
              <IconTrash className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-gray-600 sm:text-sm">
        {content}
      </p>
      {/* Embedded Content */}
      {embedInfo && embedInfo.type === "youtube" && embedInfo.embedUrl && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <iframe
            src={embedInfo.embedUrl}
            title={title}
            className="aspect-video w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
      {embedInfo && embedInfo.type === "image" && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={embedInfo.embedUrl}
            alt={title}
            className="h-auto max-h-64 w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      )}
      {embedInfo && embedInfo.type === "twitter" && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-gray-600">
            <IconBrandX className="h-4 w-4 text-blue-500" />
            <span className="font-medium">Twitter Post</span>
          </div>
          {link && link.includes("<blockquote") ? (
            <div
              className="twitter-embed text-sm"
              dangerouslySetInnerHTML={{
                __html: (link || "").replace(
                  /<script[^>]*>.*?<\/script>/gi,
                  "",
                ),
              }}
            />
          ) : (
            <a
              href={embedInfo.embedUrl || link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 underline hover:text-blue-800"
            >
              View Tweet →
            </a>
          )}
        </div>
      )}
      {embedInfo && embedInfo.type === "iframe" && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
            <span className="text-purple-600">🔗</span>
            <span className="font-medium">Embedded Content</span>
          </div>
          <div
            className="embed-content max-w-full overflow-hidden"
            style={{ maxHeight: "400px" }}
            dangerouslySetInnerHTML={{
              __html: (link || "").replace(/<script[^>]*>.*?<\/script>/gi, ""),
            }}
          />
        </div>
      )}
      {link && (!embedInfo || embedInfo.type === "link") && (
        <div className="mb-4 rounded-lg bg-gray-50 p-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <IconExternalLink className="h-4 w-4" />
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate underline hover:text-purple-600"
            >
              {link}
            </a>
          </div>
        </div>
      )}
      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex cursor-pointer items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 transition-all duration-200 hover:scale-105 hover:bg-purple-200 sm:px-2.5"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
        {author && <span>By {author}</span>}
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
