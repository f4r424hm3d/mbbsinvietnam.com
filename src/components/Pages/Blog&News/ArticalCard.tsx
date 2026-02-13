import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';

interface Author {
  name: string;
  avatar: string;
  role: string;
}

interface Artical {
  id: number;
  title: string;
  author: Author;
  date: string;
  image: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  slug: string;
}

interface ArticalCardProps {
  artical: Artical;
  onArticalSelect: (categorySlug: string, slug: string) => void;
}

const ArticalCard: React.FC<ArticalCardProps> = ({ artical, onArticalSelect }) => {
  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      {/* Banner-style header with gradient background */}
      <div className="relative h-48 bg-gradient-to-br from-red-100 to-rose-100 overflow-hidden">
        <img
          src={artical.image}
          alt={artical.title}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        {/* Category tag */}
        <div className="mb-3">
          <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium capitalize">
            {artical.category}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-sm font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight flex-grow">
          {artical.title}
        </h3>
        
        {/* Date and author */}
        <div className="flex items-center justify-between text-xs text-red-600 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{artical.date}</span>
          </div>
          <span>by {artical.author.name}</span>
        </div>
        
        {/* Read more button - fixed at bottom */}
        <button 
          onClick={() => onArticalSelect(artical.categorySlug, artical.slug)}
          className="w-full bg-red-600 text-white py-2 px-4 rounded text-xs font-medium hover:bg-red-600 transition-colors group mt-auto"
        >
          <span className="flex items-center justify-center space-x-1">
            <span>Read More</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </article>
  );
};

export default ArticalCard;