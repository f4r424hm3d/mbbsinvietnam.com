import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Newspaper, FileText } from 'lucide-react';
import Blog from './Blog';
import News from './News';
import Artical from './Artical';
import BlogDetail from './BlogDetail';
import NewsDetail from './NewsDetail';
import ArticalDetail from './ArticalDetail';

function BlognewsMain() {
  const location = useLocation();
  const navigate = useNavigate();
  const { categorySlug, slug } = useParams<{ categorySlug?: string; slug?: string }>();

  // Determine active tab based on current URL
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.startsWith('/blog/') && !path.includes('/blog-news') && !path.includes('/blog-article')) return 'blog';
    if (path.startsWith('/blog-news')) return 'news';
    if (path.startsWith('/blog-article')) return 'artical';
    if (path === '/blog') return 'blog';
    return 'blog'; // default
  };

  const activeTab = getActiveTab();
  
  // Determine if we're showing a detail page
  const isDetailPage = categorySlug && slug;
  // Determine if we're showing a category page
  const isCategoryPage = categorySlug && !slug;

  const handleBlogPostSelect = (categorySlug: string, slug: string) => {
    navigate(`/blog/${categorySlug}/${slug}`);
  };

  const handleNewsItemSelect = (categorySlug: string, slug: string) => {
    navigate(`/blog-news/${categorySlug}/${slug}`);
  };

  const handleArticalItemSelect = (categorySlug: string, slug: string) => {
    navigate(`/blog-article/${categorySlug}/${slug}`);
  };

  const handleBackToBlog = () => {
    navigate('/blog');
  };

  const handleBackToNews = () => {
    navigate('/blog-news');
  };

  const handleBackToArtical = () => {
    navigate('/blog-article');
  };

  // Handle tab navigation with URL changes
  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'blog':
        navigate('/blog');
        break;
      case 'news':
        navigate('/blog-news');
        break;
      case 'artical':
        navigate('/blog-article');
        break;
    }
  };
useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         
          
          {/* Navigation Tabs */}
          <div className="border-b border-slate-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabChange('blog')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'blog'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-slate-500  hover:text-red-500  hover:border-red-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Blog</span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange('news')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'news'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-slate-500 hover:text-red-500  hover:border-red-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Newspaper className="w-4 h-4" />
                  <span>News</span>
                </div>
              </button>
              <button
               onClick={() => handleTabChange('artical')}
               className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'artical'
                   ? 'border-red-500 text-red-600'
                   : 'border-transparent text-slate-500 hover:text-red-500 hover:border-red-300'
               }`}
               >
                 <div className="flex items-center space-x-2">
                   <FileText className="w-4 h-4" />
                   <span>Articles</span>
                 </div>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'blog' ? (
          isDetailPage ? (
            <BlogDetail 
              categorySlug={categorySlug!} 
              slug={slug!} 
              onBack={handleBackToBlog} 
            />
          ) : isCategoryPage ? (
            <Blog onPostSelect={handleBlogPostSelect} initialCategory={categorySlug} />
          ) : (
            <Blog onPostSelect={handleBlogPostSelect} />
          )
        ) : activeTab === 'news' ? (
          isDetailPage ? (
            <NewsDetail 
              categorySlug={categorySlug!} 
              newsSlug={slug!} 
              onBack={handleBackToNews} 
            />
          ) : isCategoryPage ? (
            <News onNewsSelect={handleNewsItemSelect} initialCategory={categorySlug} />
          ) : (
            <News onNewsSelect={handleNewsItemSelect} />
          )
        ) : (
          isDetailPage ? (
            <ArticalDetail 
              categorySlug={categorySlug!} 
              slug={slug!} 
              onBack={handleBackToArtical} 
            />
          ) : isCategoryPage ? (
            <Artical onArticalSelect={handleArticalItemSelect} initialCategory={categorySlug} />
          ) : (
            <Artical onArticalSelect={handleArticalItemSelect} />
          )
        )}
      </main>

      
    </div>
  );
}

export default  BlognewsMain;