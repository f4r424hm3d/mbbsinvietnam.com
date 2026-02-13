import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { getArticleDetail, ArticleDetailResponse, IMAGE_BASE_URL } from '../../../Api';
import ArticleTableOfContents from './ArticleTableOfContents';
import ArticleSidebar from './ArticleSidebar';

interface ArticalDetailProps {
  categorySlug: string;
  slug: string;
  onBack: () => void;
}

const ArticalDetail: React.FC<ArticalDetailProps> = ({ categorySlug, slug, onBack }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [articleData, setArticleData] = useState<ArticleDetailResponse | null>(null);

  useEffect(() => {
    fetchArticleDetail();
  }, [categorySlug, slug]);

  const fetchArticleDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getArticleDetail(categorySlug, slug);
      setArticleData(response);
    } catch (err) {
      setError('Failed to fetch article details. Please try again later.');
      console.error('Error fetching article detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Loading article...</h3>
        </div>
      </div>
    );
  }

  if (error || !articleData) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center py-8">
          <p className="text-xl text-red-600">{error || 'Article not found.'}</p>
          <button
            onClick={onBack}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <ArrowLeft className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const { article } = articleData;
  const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
            <span>Back to Articles</span>
          </button>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 py-2">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">
          
          {/* Left Sidebar - Table of Contents (Sticky) */}
          <div className="xl:col-span-2 order-1 xl:order-1">
            <div className="sticky top-24">
              {article.parent_contents && article.parent_contents.length > 0 && (
                <ArticleTableOfContents parentContents={article.parent_contents} />
              )}
            </div>
          </div>

          {/* Main Content - Center Column (Scrollable) */}
          <div className="xl:col-span-8 order-2 xl:order-2">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              <div className="relative">
                <img
                  src={`${IMAGE_BASE_URL}/${article.thumbnail_path}`}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-700 px-4 py-2 rounded-full text-sm font-medium capitalize mb-4 inline-block">
                    {article.category.category_name}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {article.title}
                  </h1>
                </div>
              </div>

              <div className="p-8">
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    {article.author ? (
                      <>
                        <img
                          src={article.author.profile_picture ? `${IMAGE_BASE_URL}/${article.author.profile_picture}` : 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                          alt={article.author.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">{article.author.name}</p>
                          <p className="text-sm text-slate-600">Author</p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <p className="font-semibold text-slate-800">Admin</p>
                        <p className="text-sm text-slate-600">Author</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>5 min read</span>
                    </div>
                  </div>

                  <button className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium ml-auto">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  {/* Render parent contents with their children */}
                  {article.parent_contents && article.parent_contents.length > 0 ? (
                    <div className="space-y-8">
                      {article.parent_contents.map((parentContent) => (
                        <div key={parentContent.id} className="space-y-4">
                          {/* Parent content title */}
                          <h2 
                            id={`section-${parentContent.title.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-2xl font-bold text-slate-800 mt-6 mb-4 scroll-mt-24"
                          >
                            {parentContent.title}
                          </h2>
                          
                          {/* Parent content description */}
                          <div 
                            className="text-slate-700 leading-relaxed mb-6"
                            dangerouslySetInnerHTML={{ __html: parentContent.description }}
                          />
                          
                          {/* Child contents */}
                          {parentContent.child_contents && parentContent.child_contents.length > 0 && (
                            <div className="ml-6 space-y-6 border-l-4 border-red-200 pl-6">
                              {parentContent.child_contents.map((childContent) => (
                                <div key={childContent.id} className="space-y-2">
                                  {/* Child content title */}
                                  <h3 
                                    id={`section-${childContent.title.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-xl font-semibold text-slate-800 scroll-mt-24"
                                  >
                                    {childContent.title}
                                  </h3>
                                  
                                  {/* Child content description */}
                                  <div 
                                    className="text-slate-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: childContent.description }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xl text-slate-700 leading-relaxed">
                      <p>{article.title}</p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Right Sidebar - Categories and Recent Posts (Sticky) */}
          <div className="xl:col-span-2 order-3 xl:order-3">
            <div className="sticky top-24">
              <ArticleSidebar onPostSelect={(catSlug, postSlug) => {
                if (postSlug) {
                  navigate(`/blog-article/${catSlug}/${postSlug}`);
                } else {
                  navigate(`/blog-article/${catSlug}`);
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticalDetail;