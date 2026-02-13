import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { IMAGE_BASE_URL } from '../../../Api';

interface NewsCategory {
  id: number;
  category_name: string;
  category_slug: string;
}

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  thumbnail_path: string;
  created_at: string;
  category: NewsCategory;
}

interface NewsCardProps {
  news: NewsItem;
  onNewsSelect: (categorySlug: string, slug: string) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, onNewsSelect }) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Construct the full image URL
  const imageUrl = `${IMAGE_BASE_URL}/${news.thumbnail_path}`;

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      {/* Banner-style header with gradient background */}
      <div className="relative h-48 bg-gradient-to-br from-red-100 to-rose-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={news.title}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
        />
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        {/* Category tag */}
        <div className="mb-3">
          <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium capitalize">
            {news.category.category_name}
          </span>
        </div>
        
        {/* Title */}
        <h3 className="text-sm font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-red-600 transition-colors leading-tight flex-grow">
          {news.title.split('-').join(' ')}
        </h3>
        
        {/* Date and author */}
        <div className="flex items-center justify-between text-xs text-red-600 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(news.created_at)}</span>
          </div>
          <span>by Kyrgyz Republic</span>
        </div>
        
        {/* Read more button - fixed at bottom */}
        <button 
          onClick={() => onNewsSelect(news.category.category_slug, news.slug)}
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

export default NewsCard;