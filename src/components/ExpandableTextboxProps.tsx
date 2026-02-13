import React, { useState } from "react";

const ExpandableText: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
  ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
  in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia 
  deserunt mollit anim id est laborum.`; // <-- Ye baad mai API se aayega

  const maxChars = 200;

  const displayText =
    text.length > maxChars && !expanded ? text.slice(0, maxChars) + "..." : text;

  return (
    <div className="max-w-7xl w-full mx-auto bg-white shadow-md rounded-2xl p-6 border border-gray-200">
      {/* Text Display */}
      <p className="text-gray-700 leading-relaxed">{displayText}</p>

      {/* Show More / Show Less */}
      {text.length > maxChars && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-blue-600 hover:text-blue-800 font-semibold transition"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
