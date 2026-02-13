import React, { useState, useEffect } from 'react';
import { Search, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import BlogCard from './BlogCard';
import { getBlogs, getBlogsByCategory, BlogPost, BlogCategory } from '../../../Api';

interface BlogProps {
  onPostSelect: (categorySlug: string, slug: string) => void;
  initialCategory?: string;
}

const Blog: React.FC<BlogProps> = ({ onPostSelect, initialCategory }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'all');
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState('All Blog');

  useEffect(() => {
    fetchBlogs();
  }, [searchTerm, selectedCategory, currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (selectedCategory !== 'all') {
        // Fetch blogs by category
        const response = await getBlogsByCategory(selectedCategory, { page: currentPage });
        setBlogs(response.blogs.data);
        setTotalPages(response.blogs.last_page);
        setCategoryName(response.category.category_name);
      } else {
        // Fetch all blogs
        const params: any = { page: currentPage };
        if (searchTerm) params.search = searchTerm;
        
        const response = await getBlogs(params);
        setBlogs(response.blogs.data);
        setTotalPages(response.blogs.last_page);
        setCategoryName('All Blog');
        
        // Extract unique categories from the response
        if (response.blogs.data.length > 0) {
          const uniqueCategories = response.blogs.data
            .map(post => post.category)
            .filter((category, index, self) => 
              index === self.findIndex(c => c.id === category.id)
            );
          setCategories(uniqueCategories);
        }
      }
    } catch (err) {
      setError('Failed to fetch blog posts');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                All Blogs
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.category_slug)}
                  className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
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
              {categoryName}
            </h1>
          </div>

          {/* Search and Filter */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {selectedCategory === 'all' && (
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-slate-400" />
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
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading blog posts...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">!</span>
              </div>
              <h3 className="text-lg font-medium text-slate-800 mb-2">Error Loading Posts</h3>
              <p className="text-slate-600">{error}</p>
            </div>
          )}

          {/* Blog Grid */}
          {!loading && !error && (
            <>
              <div className="px-6 pb-8">
                {blogs.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {blogs.map((post) => (
                      <BlogCard key={post.id} post={post} onPostSelect={onPostSelect} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No posts found</h3>
                    <p className="text-slate-600">Try adjusting your search terms or category filter.</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {blogs.length > 0 && totalPages > 1 && (
                <div className="px-6 pb-8 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === 1
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === totalPages
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;