import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { getBlogDetail, BlogDetailData, IMAGE_BASE_URL } from '../../../Api';
import TableOfContents from './TableOfContents';
import BlogSidebar from './BlogSidebar';

interface BlogDetailProps {
  categorySlug: string;
  slug: string;
  onBack: () => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({ categorySlug, slug, onBack }) => {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState<BlogDetailData | null>(null);
  const [, setRelatedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogDetail();
  }, [categorySlug, slug]);

  const fetchBlogDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getBlogDetail(categorySlug, slug);
      
      if (response.status && response.blog) {
        setBlogData(response.blog);
        setRelatedPosts(response.related_blogs || []);
      } else {
        setError('Blog post not found');
      }
    } catch (err) {
      setError('Failed to load blog post');
      console.error('Error fetching blog detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading blog post...</p>
      </div>
    );
  }

  if (error || !blogData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">{error || 'Post not found'}</h2>
        <button
          onClick={onBack}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          ← Back to Blog
        </button>
      </div>
    );
  }

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
        <span>Back to Blog</span>
      </button>
    </div>
  </div>

      {/* Three Column Layout */}
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-2 py-2">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2">
          
          {/* Left Sidebar - Table of Contents (Sticky) */}
          <div className="xl:col-span-2 order-1 xl:order-1">
            <div className="sticky top-24">
              {blogData.parent_contents && blogData.parent_contents.length > 0 && (
                <TableOfContents parentContents={blogData.parent_contents} />
              )}
            </div>
          </div>

          {/* Main Content - Center Column (Scrollable) */}
          <div className="xl:col-span-8 order-2 xl:order-2">
            <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              <div className="relative">
                <img
                  src={`${IMAGE_BASE_URL}/${blogData.thumbnail_path}`}
                  alt={blogData.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-700 px-4 py-2 rounded-full text-sm font-medium capitalize mb-4 inline-block">
                    {blogData.category.category_name}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {blogData.title}
                  </h1>
                </div>
              </div>

              <div className="p-8">
                {/* Article Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    {blogData.author ? (
                      <>
                        <img
                          src={blogData.author.profile_picture ? `${IMAGE_BASE_URL}/${blogData.author.profile_picture}` : 'https://images.pexels.com/photos/3586966/pexels-photo-3586966.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'}
                          alt={blogData.author.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">{blogData.author.name}</p>
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
                      <span>{new Date(blogData.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
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
                  {blogData.parent_contents && blogData.parent_contents.length > 0 ? (
                    <div className="space-y-8">
                      {blogData.parent_contents.map((parentContent) => (
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
                      <p>{blogData.title}</p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </div>

          {/* Right Sidebar - Categories and Recent Posts (Sticky) */}
          <div className="xl:col-span-2 order-3 xl:order-3">
            <div className="sticky top-24">
              <BlogSidebar onPostSelect={(catSlug, postSlug) => {
                if (postSlug) {
                  navigate(`/blog/${catSlug}/${postSlug}`);
                } else {
                  navigate(`/blog/${catSlug}`);
                }
              }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
