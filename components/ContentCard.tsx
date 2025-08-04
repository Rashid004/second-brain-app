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
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <div className="flex space-x-2">
          {onShare && (
            <button
              // onClick={onShare}
              className="p-1 text-gray-400 transition-colors hover:text-blue-600"
              title="Share"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>
          )}
          {onEdit && (
            <button
              // onClick={onEdit}
              className="p-1 text-gray-400 transition-colors hover:text-blue-600"
              title="Edit"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              // onClick={onDelete}
              className="p-1 text-gray-400 transition-colors hover:text-red-600"
              title="Delete"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 line-clamp-3 text-sm text-gray-600">{content}</p>

      {tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-500">
        {author && <span>By {author}</span>}
        <span>{new Date(createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
