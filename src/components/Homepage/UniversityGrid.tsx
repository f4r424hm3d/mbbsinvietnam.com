
import { MapPin, Users, Star, ArrowRight, Award, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getHomeUniversities, HomeUniversity, IMAGE_BASE_URL } from '../../Api';

const UniversityGrid = () => {
  const [universities, setUniversities] = useState<HomeUniversity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        const response = await getHomeUniversities();
        setUniversities(response.data.universities);
      } catch (err) {
        setError('Failed to fetch universities');
        console.error('Error fetching universities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'medical': return 'bg-green-100 text-green-800';
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'general': return 'bg-purple-100 text-purple-800';
      case 'private': return 'bg-purple-100 text-purple-800';
      case 'public': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFee = (fee: string | null) => {
    if (!fee) return 'Contact for details';
    const numFee = parseFloat(fee);
    if (numFee >= 100000) {
      return `$${(numFee / 100000).toFixed(1)}L/year`;
    }
    return `$${numFee.toLocaleString()}/year`;
  };

  const formatStudents = (students: number | null) => {
    if (!students) return 'N/A';
    return students >= 1000 ? `${(students / 1000).toFixed(1)}K+` : `${students}+`;
  };

  const getRecognitionList = (approvedBy: string | null) => {
    if (!approvedBy) return ['WHO', 'MCI'];
    return approvedBy.split(',').map(item => item.trim()).filter(item => item);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Top Universities in Kyrgyzstan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore world-class educational institutions offering quality programs 
              recognized globally and designed for international students.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Top Universities in Kyrgyzstan
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Top Universities in Kyrgyzstan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore world-class educational institutions offering quality programs 
            recognized globally and designed for international students.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {universities.filter(university => university && university.id).map((university) => (
            <div key={university.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={university.thumbnail_path ? `${IMAGE_BASE_URL}/${university.thumbnail_path}` : 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                  alt={university.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(university.institute_type?.institute_type || '')}`}>
                    {university.institute_type?.institute_type || 'N/A'}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{university.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                    {university.name}
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{university.get_city?.city_name || 'N/A'}, {university.get_province?.province_name || 'N/A'}</span>
                    <span className="mx-2">•</span>
                    <span>Est. {university.established_year}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-800">{formatStudents(university.students)}</div>
                    <div className="text-xs text-gray-600">Students</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Award className="w-5 h-5 text-red-600 mx-auto mb-1" />
                    <div className="text-sm font-medium text-gray-800">{formatFee(university.tuition_fee)}</div>
                    <div className="text-xs text-gray-600">Annual Fees</div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {university.scholarship_name && (
                      <span className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-md">
                        {university.scholarship_name}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md">
                      {university.institute_type?.institute_type || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Recognition */}
                <div className="mb-4 flex-grow">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Globe className="w-4 h-4" />
                    <span>Recognized by: {getRecognitionList(university.approved_by).join(', ')}</span>
                  </div>
                </div>

                {/* Action Button - Fixed at bottom */}
                <div className="mt-auto">
                  <Link to={`/universities/${university.slug}`} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 group">
                   <span>View Details</span>
                   
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link 
            to="/universities"
            className="bg-white text-red-600 border-2 border-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors">
            View All Universities
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UniversityGrid;