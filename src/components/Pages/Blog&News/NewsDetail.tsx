import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, Loader2, User } from 'lucide-react';
import { getNewsDetail, NewsDetailData, RelatedNewsItem, IMAGE_BASE_URL } from '../../../Api';
import NewsTableOfContents from './NewsTableOfContents';
import NewsSidebar from './NewsSidebar';

interface NewsDetailProps {
  categorySlug: string;
  newsSlug: string;
  onBack: () => void;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ categorySlug, newsSlug, onBack }) => {
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsDetailData | null>(null);
  const [, setRelatedNews] = useState<RelatedNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getNewsDetail(categorySlug, newsSlug);
        setNews(response.news);
        setRelatedNews(response.related_news);
      } catch (err) {
        setError('Failed to fetch news details');
        console.error('Error fetching news detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [categorySlug, newsSlug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{error || 'News not found'}</h2>
        <button
          onClick={onBack}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          ← Back to News
        </button>
      </div>
    );
  }

  const imageUrl = `${IMAGE_BASE_URL}/${news.thumbnail_path}`;
  const authorImageUrl = news.author?.profile_picture 
    ? `${IMAGE_BASE_URL}/${news.author.profile_picture}` 
    : null;
  
  const getTypeColor = (categoryName: string) => {
    // Generate color based on category name
    const colors = [
      'bg-red-100 text-red-700 border-red-200',
      'bg-green-100 text-green-700 border-green-200',
      'bg-yellow-100 text-yellow-700 border-yellow-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-pink-100 text-pink-700 border-pink-200',
    ];
    const index = categoryName.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Helper function to render HTML content safely
  const renderHTMLContent = (html: string) => {
    return { __html: html };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Button - Fixed at top */}
      <div className="sticky top-[64px] z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 py-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700 font-medium group text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to News</span>
          </button>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 py-2">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">
          
          {/* Left Sidebar - Table of Contents (Sticky) */}
          <div className="xl:col-span-2 order-1 xl:order-1">
            <div className="sticky top-24">
              {news.parent_contents && news.parent_contents.length > 0 && (
                <NewsTableOfContents parentContents={news.parent_contents} />
              )}
            </div>
          </div>

          {/* Main Content - Center Column (Scrollable) */}
          <div className="xl:col-span-8 order-2 xl:order-2">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={news.title}
                  className="w-full h-64 md:h-96 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize mb-4 inline-block border ${getTypeColor(news.category.category_name)}`}>
                    {news.category.category_name}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {news.title.split('-').join(' ')}
                  </h1>
                </div>
              </div>

              <div className="p-8">
                {/* Author & Date Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex items-center space-x-6 text-sm text-slate-600">
                    {/* Author Info */}
                    {news.author && (
                      <div className="flex items-center space-x-3">
                        {authorImageUrl ? (
                          <img
                            src={authorImageUrl}
                            alt={news.author.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-red-600" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-slate-800">{news.author.name}</p>
                          <p className="text-xs text-slate-500">Author</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(news.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>3 min read</span>
                    </div>
                  </div>

                  <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium ml-auto">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                {/* News Content */}
                <div className="prose prose-lg max-w-none">
                  {news.parent_contents && news.parent_contents.length > 0 ? (
                    <div className="space-y-8">
                      {news.parent_contents.map((parentContent) => (
                        <div key={parentContent.id} className="space-y-6">
                          {/* Parent Content Title */}
                          {parentContent.title && (
                            <h2 
                              id={`section-${parentContent.title.toLowerCase().replace(/\s+/g, '-')}`}
                              className="text-2xl font-bold text-slate-800 mb-4 scroll-mt-24"
                            >
                              {parentContent.title.split('-').join(' ')}
                            </h2>
                          )}
                          
                          {/* Parent Content Description (HTML) */}
                          {parentContent.description && (
                            <div 
                              className="text-slate-700 leading-relaxed mb-6"
                              dangerouslySetInnerHTML={renderHTMLContent(parentContent.description)}
                            />
                          )}
                          
                          {/* Child Contents */}
                          {parentContent.child_contents && parentContent.child_contents.length > 0 && (
                            <div className="space-y-6 ml-4 border-l-4 border-red-200 pl-6">
                              {parentContent.child_contents.map((childContent) => (
                                <div key={childContent.id} className="space-y-3">
                                  {/* Child Content Title */}
                                  {childContent.title && (
                                    <h3 
                                      id={`section-${childContent.title.toLowerCase().replace(/\s+/g, '-')}`}
                                      className="text-xl font-semibold text-slate-800 scroll-mt-24"
                                    >
                                      {childContent.title.split('-').join(' ')}
                                    </h3>
                                  )}
                                  
                                  {/* Child Content Description (HTML) */}
                                  {childContent.description && (
                                    <div 
                                      className="text-slate-700 leading-relaxed"
                                      dangerouslySetInnerHTML={renderHTMLContent(childContent.description)}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-slate-700 leading-relaxed">
                      <p>{news.title.split('-').join(' ')}</p>
                    </div>
                  )}
                </div>

                {/* Contact Information */}
                <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="font-semibold text-slate-800 mb-3">Contact Information</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p><strong>Administration Office:</strong> +996 312 123-456</p>
                    <p><strong>Email:</strong> info@kyrgyzstanuniversity.edu.kg</p>
                    <p><strong>Emergency Hotline:</strong> +996 312 911-911</p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Right Sidebar - Categories and Recent Posts (Sticky) */}
          <div className="xl:col-span-2 order-3 xl:order-3">
            <div className="sticky top-24">
              <NewsSidebar onPostSelect={(catSlug, postSlug) => {
                if (postSlug) {
                  navigate(`/blog-news/${catSlug}/${postSlug}`);
                } else {
                  navigate(`/blog-news/${catSlug}`);
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;