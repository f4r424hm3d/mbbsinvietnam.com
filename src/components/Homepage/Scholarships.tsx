import { Award, Users, DollarSign, Calendar, CheckCircle, ArrowRight, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getNonUniversityScholarships, NonUniversityScholarship } from '../../Api';

const Scholarships = () => {
  const [scholarships, setScholarships] = useState<NonUniversityScholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getNonUniversityScholarships();
        setScholarships(response.data.scholarships);
      } catch (err) {
        console.error('Error fetching scholarships:', err);
        setError('Failed to load scholarships. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);


  // Helper function to format amount
  const formatAmount = (amountMin: string, amountMax: string) => {
    const min = parseFloat(amountMin);
    const max = parseFloat(amountMax);
    
    if (min === max) {
      return `$${min.toLocaleString()}`;
    } else {
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
  };

  // Helper function to format deadline
  const formatDeadline = (deadline: string) => {
    try {
      return new Date(deadline).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return deadline;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'government': return 'bg-green-100 text-green-800';
      case 'embassy': return 'bg-blue-100 text-blue-800';
      case 'university': return 'bg-purple-100 text-purple-800';
      case 'merit': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (loading) {
    return (
      <section id="scholarships" className="py-20 bg-white -mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 -mt-10">
              Scholarships & Financial Aid
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make your education dreams affordable with various scholarship opportunities 
              available for Indian students studying in Kyrgyzstan.
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <span className="ml-2 text-gray-600">Loading scholarships...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="scholarships" className="py-20 bg-white -mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 -mt-10">
              Scholarships & Financial Aid
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Make your education dreams affordable with various scholarship opportunities 
              available for Indian students studying in Kyrgyzstan.
            </p>
          </div>
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="scholarships" className="py-20 bg-white -mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 -mt-10">
            Scholarships & Financial Aid
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make your education dreams affordable with various scholarship opportunities 
            available for Indian students studying in Kyrgyzstan.
          </p>
        </div>

        {/* Scholarship Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl">
            <Award className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-red-600 mb-2">250+</div>
            <div className="text-gray-700 font-medium">Scholarships Available</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
            <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-green-600 mb-2">$2M+</div>
            <div className="text-gray-700 font-medium">Total Aid Distributed</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
            <div className="text-gray-700 font-medium">Students Receive Aid</div>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
            <Star className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
            <div className="text-gray-700 font-medium">Success Rate</div>
          </div>
        </div>

        {/* Scholarship Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {scholarships.map((scholarship) => {
            const eligibilityItems = scholarship.eligibility;
            const coverageItems = scholarship.coverage;
            
            return (
              <div key={scholarship.id} className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt={scholarship.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(scholarship.scholarship_type)}`}>
                      {scholarship.scholarship_type}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{scholarship.title}</h3>
                    <p className="text-white/90 text-sm">{scholarship.program}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Key Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600 mb-2" />
                      <div className="text-sm text-gray-600">Amount</div>
                      <div className="font-semibold text-gray-800">{formatAmount(scholarship.amount_min, scholarship.amount_max)}</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 mb-2" />
                      <div className="text-sm text-gray-600">Deadline</div>
                      <div className="font-semibold text-gray-800">{formatDeadline(scholarship.deadline)}</div>
                    </div>
                  </div>

                  {/* Eligibility */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Eligibility</h4>
                    <div className="space-y-1">
                      {eligibilityItems.map((item, index) => (
                        <p key={index} className="text-gray-600 text-sm">• {item}</p>
                      ))}
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{scholarship.available_seats} scholarships available</span>
                    </div>
                  </div>

                  {/* Coverage */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Coverage Includes</h4>
                    <div className="space-y-2">
                      {coverageItems.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-600 text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>


                  {/* Action Button - Fixed at bottom */}
                  <div className="mt-auto">
                    <Link 
                      to={`/scholarships/${scholarship.slug}?apply=true`}
                      className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Need Help with Scholarship Applications?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our scholarship counselors are here to guide you through the application process 
            and help you secure the best financial aid opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={"/scholarships"}
            className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-red-700 transition-colors">
             Explore Scholarship 
            </Link>
            <button className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors">
              Download Scholarship Guide
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Scholarships;