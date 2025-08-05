import { IconBrandYoutube, IconShare, IconTrash } from "@tabler/icons-react";

interface ContentCardProps {
  title: string;
  content: string;
  author?: string;
  createdAt: string;
  tags?: string[];
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}

export default function ContentCard({
  title,
  content,
  author,
  createdAt,
  tags = [],
  onEdit,
  onDelete,
  onShare,
}: ContentCardProps) {
  return (
    <div className="group w-full rounded-2xl border border-gray-200/50 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-purple-200/50 hover:bg-white hover:shadow-xl hover:shadow-purple-100/50 sm:p-6 sm:hover:-translate-y-1">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="line-clamp-2 flex items-start gap-2 text-base leading-tight font-semibold text-gray-900 lg:text-lg">
          <IconBrandYoutube className="mt-0.5 h-5 w-5 flex-shrink-0 text-purple-600 transition-transform duration-300 sm:h-6 sm:w-6 sm:group-hover:scale-110" />
          <span>{title}</span>
        </h3>
        <div className="flex space-x-2 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
          {onShare && (
            <button
              // onClick={onShare}
              className="rounded-md p-1 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-blue-50 hover:text-blue-600"
              title="Share"
            >
              <IconShare className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}

          {onDelete && (
            <button
              // onClick={onDelete}
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
