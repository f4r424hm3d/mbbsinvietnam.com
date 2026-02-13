import React, { useState, useMemo } from "react";

interface ExpandableContentProps {
  content: string;
  maxChars?: number;
  className?: string;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({ 
  content, 
  maxChars = 200,
  className = ""
}) => {
  const [expanded, setExpanded] = useState(false);

  // Strip HTML tags for character counting
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const textContent = useMemo(() => stripHtml(content), [content]);
  const shouldTruncate = textContent.length > maxChars;

  // Create preview text by truncating plain text
  const previewText = useMemo(() => {
    if (!shouldTruncate) return textContent;
    const truncated = textContent.substring(0, maxChars);
    const lastSpace = truncated.lastIndexOf(' ');
    const lastPeriod = truncated.lastIndexOf('.');
    const breakPoint = Math.max(lastPeriod, lastSpace > maxChars * 0.7 ? lastSpace : maxChars);
    return textContent.substring(0, breakPoint) + "...";
  }, [textContent, maxChars, shouldTruncate]);

  return (
    <div className={`max-w-7xl w-full mx-auto bg-white shadow-md rounded-2xl p-6 border border-gray-200 ${className}`}>
      {/* Content Display */}
      {expanded ? (
        <div 
          className="text-gray-700 leading-relaxed prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <p className="text-gray-700 leading-relaxed">
          {previewText}
        </p>
      )}

      {/* Show More / Show Less Button */}
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default ExpandableContent;

