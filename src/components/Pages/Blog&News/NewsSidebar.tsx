import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { getNews, NewsItem, NewsCategory } from '../../../Api';

interface NewsSidebarProps {
  onPostSelect: (categorySlug: string, slug: string) => void;
}

const NewsSidebar: React.FC<NewsSidebarProps> = ({ onPostSelect }) => {
  const [recentPosts, setRecentPosts] = useState<NewsItem[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const response = await getNews({ page: 1 });
      setRecentPosts(response.news.data.slice(0, 5)); // Get first 5 posts
      
      // Extract unique categories
      const uniqueCategories = response.news.data
        .map(post => post.category)
        .filter((category, index, self) => 
          index === self.findIndex(c => c.id === category.id)
        );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching recent news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* More Categories */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-red-600 text-white px-4 py-3">
          <h3 className="font-bold text-sm">More Categories</h3>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onPostSelect(category.category_slug, '')}
                className="flex items-center justify-between w-full text-left text-sm text-gray-700 hover:text-red-600 transition-colors group"
              >
                <span>{category.category_name}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent News */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-red-600 text-white px-4 py-3">
          <h3 className="font-bold text-sm">Recent News</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <button
                key={post.id}
                onClick={() => onPostSelect(post.category.category_slug, post.slug)}
                className="flex items-center justify-between w-full text-left text-sm text-gray-700 hover:text-red-600 transition-colors group"
              >
                <span className="line-clamp-2">{post.title}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSidebar;
