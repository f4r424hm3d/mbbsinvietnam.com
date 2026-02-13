import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ArticleParentContent {
  id: number;
  title: string;
  description: string;
  child_contents?: ArticleChildContent[];
}

interface ArticleChildContent {
  id: number;
  title: string;
  description: string;
}

interface ArticleTableOfContentsProps {
  parentContents: ArticleParentContent[];
}

const ArticleTableOfContents: React.FC<ArticleTableOfContentsProps> = ({ parentContents }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const scrollToSection = (title: string) => {
    const element = document.getElementById(`section-${title.toLowerCase().replace(/\s+/g, '-')}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Header with blue background */}
      <div className="bg-red-600 text-white px-4 py-3 flex items-center justify-between">
        <h3 className="font-bold text-sm">Table of contents</h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:text-red-200 transition-colors"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>
      
      {/* Content */}
      {!isCollapsed && (
        <div className="p-4">
          <div className="space-y-2">
            {parentContents.map((content, index) => (
              <div key={content.id} className="space-y-1">
                {/* Main content */}
                <button
                  onClick={() => scrollToSection(content.title)}
                  className="block w-full text-left text-sm font-medium text-gray-700 hover:text-red-600 transition-colors cursor-pointer"
                >
                  {index + 1}. {content.title}
                </button>
                
                {/* Child contents */}
                {content.child_contents && content.child_contents.length > 0 && (
                  <div className="ml-4 space-y-1">
                    {content.child_contents.map((child, childIndex) => (
                      <button
                        key={child.id}
                        onClick={() => scrollToSection(child.title)}
                        className="block w-full text-left text-xs text-gray-600 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        {index + 1}.{childIndex + 1} {child.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleTableOfContents;
