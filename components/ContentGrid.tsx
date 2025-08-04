import { ReactNode } from 'react';

interface ContentGridProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function ContentGrid({ children, title, description }: ContentGridProps) {
  return (
    <div className="space-y-6">
      {(title || description) && (
        <div className="border-b border-gray-200 pb-4">
          {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
          {description && <p className="mt-2 text-gray-600">{description}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}