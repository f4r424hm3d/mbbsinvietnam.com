import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Users, Award, ThumbsUp, Loader2, Search, Facebook, GraduationCap, MessageSquare, UserCheck } from 'lucide-react';
import { getUniversityReviews, UniversityReview } from '../../Api';

interface RatingsReviewsProps {
  universityId?: number;
}

const RatingsReviews: React.FC<RatingsReviewsProps> = ({ universityId }) => {
  const [reviews, setReviews] = useState<UniversityReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await getUniversityReviews(universityId!);
        setReviews(response.data.reviews);
        setError(null);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    if (universityId) {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [universityId]);

  const platforms = [
    {
      name: 'Google Reviews',
      rating: 4.8,
      reviews: 1247,
      icon: Search,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      name: 'Facebook',
      rating: 4.9,
      reviews: 856,
      icon: Facebook,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      name: 'Trustpilot',
      rating: 4.7,
      reviews: 623,
      icon: Star,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      name: 'Study Abroad Reviews',
      rating: 4.8,
      reviews: 445,
      icon: GraduationCap,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  const badges = [
    {
      title: 'Top Rated University',
      subtitle: '2024 Excellence Award',
      icon: Award,
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Student Choice Award',
      subtitle: 'Best International Support',
      icon: ThumbsUp,
      color: 'from-green-400 to-blue-500'
    },
    {
      title: 'Parent Recommended',
      subtitle: '98% Satisfaction Rate',
      icon: Users,
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Rising Star',
      subtitle: 'Fastest Growing University',
      icon: TrendingUp,
      color: 'from-blue-400 to-cyan-500'
    }
  ];

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  return (
    <section className="py-10 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ratings & Reviews
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See what students and parents are saying about their experience with our university 
            across multiple review platforms.
          </p>
        </div>

        {/* Review Badges */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center shadow-lg`}>
                <badge.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{badge.title}</h3>
              <p className="text-sm text-gray-600">{badge.subtitle}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Platform Ratings */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Platform Ratings</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {platforms.map((platform, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${platform.bgColor}`}>
                        <platform.icon className={`h-6 w-6 ${platform.iconColor}`} />
                      </div>
                      <h4 className="font-semibold text-gray-900">{platform.name}</h4>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-xl font-bold text-gray-900">{platform.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{platform.reviews.toLocaleString()} reviews</span>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(platform.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Recent Reviews</h3>
            {!universityId ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-600">Please select a university to view reviews.</p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading reviews...</span>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600">{error}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-600">No reviews available yet.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews
                  .filter(review => review.is_published === 1)
                  .sort((a, b) => new Date(b.reviewed_at).getTime() - new Date(a.reviewed_at).getTime())
                  .slice(0, 3)
                  .map((review) => (
                    <div 
                      key={review.id}
                      className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-semibold text-gray-900">
                              {review.reviewer_name}
                              {review.reviewer_role && ` (${review.reviewer_role})`}
                            </h5>
                            {review.is_verified === 1 && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(review.reviewed_at)}</span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Overall Satisfaction Metrics</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-3xl font-bold text-blue-600 mb-2">4.8/5</h4>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MessageSquare className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-3xl font-bold text-green-600 mb-2">3,171</h4>
              <p className="text-gray-600">Total Reviews</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ThumbsUp className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-3xl font-bold text-purple-600 mb-2">98%</h4>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UserCheck className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-3xl font-bold text-orange-600 mb-2">95%</h4>
              <p className="text-gray-600">Recommendation Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RatingsReviews;