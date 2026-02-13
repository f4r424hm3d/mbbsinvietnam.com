import React, { useState, useEffect } from 'react';
import { Search, Bell, Loader2 } from 'lucide-react';
import NewsCard from './NewsCard';
import { getNews, getNewsByCategory, NewsItem } from '../../../Api';

interface NewsProps {
  onNewsSelect: (categorySlug: string, slug: string) => void;
  initialCategory?: string;
}

const News: React.FC<NewsProps> = ({ onNewsSelect, initialCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<Array<{id: number, category_name: string, category_slug: string}>>([]);

  // Fetch news data
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (selectedCategory === 'all') {
          const response = await getNews({ page: currentPage });
          setNewsItems(response.news.data);
          setTotalPages(response.news.last_page);
          
          // Extract unique categories from news items
          const uniqueCategories = Array.from(
            new Map(response.news.data.map(item => [item.category.id, item.category])).values()
          );
          setCategories(uniqueCategories);
        } else {
          const response = await getNewsByCategory(selectedCategory, { page: currentPage });
          setNewsItems(response.news.data);
          setTotalPages(response.news.last_page);
        }
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [selectedCategory, currentPage]);

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-t-xl border-t-4 border-red-800 shadow-lg">
          {/* Category Navigation Bar */}
          <div className="bg-red-800 px-6 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-800 text-white border border-white hover:bg-red-700'
                }`}
              >
                All News
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.category_slug)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors capitalize ${
                    selectedCategory === category.category_slug
                      ? 'bg-red-500 text-white'
                      : 'bg-red-800 text-white border border-white hover:bg-red-700'
                  }`}
                >
                  {category.category_name}
                </button>
              ))}
            </div>
          </div>

          {/* Section Title */}
          <div className="px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-red-800">
              {selectedCategory === 'all' 
                ? 'All News' 
                : categories.find(c => c.category_slug === selectedCategory)?.category_name || 'News'}
            </h1>
          </div>

          {/* Search */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.category_slug}>
                      {category.category_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="px-6 pb-8 flex justify-center items-center py-12">
              <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="px-6 pb-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">Error Loading News</h3>
                <p className="text-slate-600">{error}</p>
              </div>
            </div>
          )}

          {/* News Grid */}
          {!loading && !error && (
            <div className="px-6 pb-8">
              {filteredNews.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredNews.map((item) => (
                      <NewsCard key={item.id} news={item} onNewsSelect={onNewsSelect} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-8">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-slate-700">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No news found</h3>
                  <p className="text-slate-600">Try adjusting your search terms or filter options.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default News;