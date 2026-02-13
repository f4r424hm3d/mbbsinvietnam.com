import React, { useState, useEffect } from 'react';
import { Search, Tag } from 'lucide-react';
import ArticalCard from './ArticalCard';
import { getArticles, getArticlesByCategory, Article, IMAGE_BASE_URL } from '../../../Api';

interface ArticalProps {
  onArticalSelect: (categorySlug: string, slug: string) => void;
  initialCategory?: string;
}

const Artical: React.FC<ArticalProps> = ({ onArticalSelect, initialCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    if (selectedCategory !== 'all') {
      fetchArticlesByCategory(selectedCategory);
    } else {
      fetchArticles();
    }
  }, [selectedCategory]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getArticles();
      setArticles(response.articles.data);
      
      // Extract unique categories from the articles
      const uniqueCategories: string[] = ['all', ...Array.from(new Set(response.articles.data.map((article: Article) => article.category.category_slug)))];
      setCategories(uniqueCategories);
    } catch (err) {
      setError('Failed to fetch articles. Please try again later.');
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticlesByCategory = async (categorySlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getArticlesByCategory(categorySlug);
      setArticles(response.articles.data);
    } catch (err) {
      setError('Failed to fetch articles for this category. Please try again later.');
      console.error('Error fetching articles by category:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticals = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category.category_slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-t-xl border-t-4 border-red-800 shadow-lg">
          {/* Category Navigation Bar */}
          <div className="bg-red-800 px-6 py-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-red-500 text-white'
                    : 'bg-red-800 text-white border border-white hover:bg-red-700'
                }`}
              >
                All Articles
              </button>
              {categories.slice(1).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors capitalize ${
                    selectedCategory === category
                      ? 'bg-red-500 text-white'
                      : 'bg-red-800 text-white border border-white hover:bg-red-700'
                  }`}
                >
                  {category.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Section Title */}
          <div className="px-6 py-8 text-center">
            <h1 className="text-3xl font-bold text-red-800">
              {selectedCategory === 'all' ? 'All Articles' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ') + ' Articles'}
            </h1>
          </div>

          {/* Search and Filter */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-slate-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.slice(1).map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Article Grid */}
          <div className="px-6 pb-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">Loading articles...</h3>
                <p className="text-slate-600">Please wait while we fetch the latest articles.</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-red-600">⚠️</span>
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">Error loading articles</h3>
                <p className="text-slate-600 mb-4">{error}</p>
                <button 
                  onClick={() => selectedCategory === 'all' ? fetchArticles() : fetchArticlesByCategory(selectedCategory)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredArticals.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredArticals.map((article) => {
                  // Transform API article to match ArticalCard expected format
                  const transformedArticle = {
                    id: article.id,
                    title: article.title,
                    author: {
                      name: article.author?.name || 'Unknown Author',
                      avatar: article.author?.profile_picture ? `${IMAGE_BASE_URL}/${article.author.profile_picture}` : 'https://randomuser.me/api/portraits/lego/1.jpg',
                      role: 'Author'
                    },
                    date: new Date(article.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }),
                    image: `${IMAGE_BASE_URL}/${article.thumbnail_path}`,
                    excerpt: article.title, // Using title as excerpt since API doesn't provide one
                    category: article.category.category_slug,
                    categorySlug: article.category.category_slug,
                    slug: article.slug
                  };
                  return (
                    <ArticalCard key={article.id} artical={transformedArticle} onArticalSelect={onArticalSelect} />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800 mb-2">No articles found</h3>
                <p className="text-slate-600">Try adjusting your search terms or category filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artical;