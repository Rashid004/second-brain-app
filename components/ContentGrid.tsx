import { ReactNode } from "react";
import { IconSparkles, IconBrain } from "@tabler/icons-react";

interface ContentGridProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function ContentGrid({
  children,
  title,
  description,
}: ContentGridProps) {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {(title || description) && (
        <div className="relative">
          <div className="absolute inset-0 scale-105 -rotate-1 transform rounded-xl bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 opacity-30 sm:rounded-2xl sm:opacity-50 lg:rounded-3xl"></div>

          {/* Content */}
          <div className="relative rounded-xl border border-white/50 bg-white/80 p-3 shadow-sm backdrop-blur-sm sm:rounded-2xl sm:p-4 lg:p-6">
            <div className="mb-3 flex flex-col items-start gap-2 sm:mb-4 sm:flex-row sm:items-center sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 p-1.5 shadow-lg sm:rounded-xl sm:p-2 lg:p-3">
                  <IconBrain className="h-4 w-4 text-white sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                </div>
                {title && (
                  <h1 className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 bg-clip-text text-lg font-bold text-transparent sm:text-xl lg:text-2xl xl:text-3xl">
                    {title}
                  </h1>
                )}
              </div>
              <IconSparkles className="h-4 w-4 animate-pulse text-purple-500 lg:h-5 lg:w-5" />
            </div>

            {description && (
              <p className="max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
                {description}
              </p>
            )}

            {/* Stats or additional info */}
            <div className="mt-3 flex flex-col items-start gap-2 text-xs text-gray-500 sm:mt-4 sm:flex-row sm:items-center sm:gap-4 sm:text-sm lg:mt-6 lg:gap-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400 sm:h-2 sm:w-2"></div>
                <span>Live content</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400 sm:h-2 sm:w-2"></div>
                <span>Auto-organized</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 opacity-0 sm:opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #8b5cf6 2px, transparent 0), radial-gradient(circle at 75px 75px, #3b82f6 2px, transparent 0)`,
              backgroundSize: "100px 100px",
            }}
          ></div>
        </div>

        {/* Actual grid */}
        <div className="relative grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 2xl:grid-cols-4">
          {children}
        </div>
      </div>
    </div>
  );
}
