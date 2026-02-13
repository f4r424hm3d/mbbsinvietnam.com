import { useState, useEffect } from 'react';
import { MapPin, CheckCircle, Globe, Award, Search, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import WhyChooseKyrgyzstan from './WhyChooseKyrgyzstan';
import ApplicationProcess from './AdmissionProcess';
import Testimonials from './Testimonials';
import FAQ2 from './FAQ 2';
import { FaDownload } from "react-icons/fa6";
import DownloadFormPopup from './DownloadFormPopup';
import api from '../../Api';
import { getUniversityDetail, UniversityDetailForComparison, getPageContent, PageContentData } from '../../Api';
import ExpandableContent from '../ExpandableContent';

interface University {
  id: number;
  name: string;
  slug: string;
  city_id: string;
  province_id: string;
  is_featured: number;
  thumbnail_path: string;
  rating: string;
  established_year: string;
  scholarship_name: string | null;
  scholarship_amount: string | null;
  seats_available: number | null;
  institute_type_id: number;
  students: number | null;
  tuition_fee: string | null;
  approved_by: string | null;
  created_at: string;
  updated_at: string;
  // Additional fields for detailed comparison
  course_duration?: string | null;
  medium_of_instruction?: string | null;
  fmge_pass_rate?: string | null;
  eligibility?: string | null;
  neet_requirement?: string | null;
  international_recognition?: string | null;
  english_medium?: string | null;
  global_ranking?: string | null;
  campus_area?: string | null;
  labs?: string | null;
  lecture_hall?: string | null;
  hostel_building?: string | null;
  parent_satisfaction?: string | null;
  total_reviews?: string | null;
  recommended_rate?: string | null;
  year_of_excellence?: string | null;
  countries_represented?: string | null;
  diverse_community?: string | null;
  who_listed?: number;
  nmc_approved?: number;
  ministry_licensed?: number;
  faimer_listed?: number;
  mci_recognition?: number;
  ecfmg_eligible?: number;
  institute_type: {
    id: number;
    institute_type: string;
    institute_type_slug: string;
    created_at: string;
    updated_at: string;
  };
  get_province: {
    id: number;
    province_name: string;
    province_slug: string;
    created_at: string | null;
    updated_at: string | null;
  };
  get_city: {
    id: number;
    city_name: string;
    city_slug: string;
    province_id: number;
    created_at: string;
    updated_at: string;
  };
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [compareList, setCompareList] = useState<number[]>([]);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);
  const [selectedUniversityForDownload, setSelectedUniversityForDownload] = useState<University | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [detailedUniversityData, setDetailedUniversityData] = useState<UniversityDetailForComparison[]>([]);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const [universitiesData, setUniversitiesData] = useState<University[]>([]);
  const [filters, setFilters] = useState({ cities: [] as any[], institute_types: [] as any[] });
  const [selectedFilters, setSelectedFilters] = useState({ city: "", institute_type: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState<PageContentData | null>(null);

  useEffect(() => {
    fetchUniversities();
  }, [selectedFilters]);

  // Fetch page content
  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await getPageContent('universities');
        setPageContent(response.data.data);
      } catch (err) {
        console.error('Error fetching page content:', err);
        // Don't set error, just continue without content
      }
    };

    fetchPageContent();
  }, []);

  // Universities fetch using existing api instance (baseURL configured in ../../Api)
  const fetchUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams: string[] = [];
      if (selectedFilters.city) queryParams.push(`city_id=${selectedFilters.city}`);
      if (selectedFilters.institute_type) queryParams.push(`institute_type=${selectedFilters.institute_type}`);

      const url = `/universities${queryParams.length ? `?${queryParams.join("&")}` : ""}`;
      console.log("Fetching URL:", url);

      const response = await api.get(url);
      console.log("API Response:", response.data);
      console.log("Full response structure:", JSON.stringify(response.data, null, 2));

      // NOTE: your API returns { status, message, data: { filters, universities, ... } }
      if (response.data?.status) {
        // use correct path into response
        const payload = response.data.data || response.data; // defensive
        console.log("Payload:", payload);
        
        if (payload.universities && Array.isArray(payload.universities.data)) {
          console.log("Universities data:", payload.universities.data);
          setUniversitiesData(payload.universities.data);
        } else if (Array.isArray(payload.data)) {
          // fallback if API shape differs
          console.log("Fallback data:", payload.data);
          setUniversitiesData(payload.data);
        } else {
          console.log("No universities found in response");
          setUniversitiesData([]);
        }

        if (payload.filters) {
          console.log("Filters:", payload.filters);
          setFilters(payload.filters);
        }
      } else {
        console.log("API response status is false:", response.data);
        setError("Failed to fetch universities");
        setUniversitiesData([]);
      }
    } catch (error) {
      console.error("Error fetching universities", error);
      setError("Error fetching universities. Please try again.");
      setUniversitiesData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id: number) => {
    setCompareList((prev) => {
      if (prev.includes(id)) {
        return prev.filter((comp) => comp !== id);
      } else if (prev.length < 3) {
        return [...prev, id];
      } else {
        return [prev[1], prev[2], id];
      }
    });
  };

  const clearCompare = () => setCompareList([]);

  const fetchDetailedUniversityData = async () => {
    if (compareList.length === 0) return;

    try {
      setComparisonLoading(true);
      const detailPromises = compareList.map(id => getUniversityDetail(id));
      const detailResponses = await Promise.all(detailPromises);
      const details = detailResponses.map(response => response.data.university);
      setDetailedUniversityData(details);
    } catch (err) {
      console.error('Error fetching detailed university data:', err);
      // Don't set error here as basic comparison can still work
    } finally {
      setComparisonLoading(false);
    }
  };

  const handleCompareNow = async () => {
    if (compareList.length >= 2) {
      await fetchDetailedUniversityData();
      setShowComparison(true);
    }
  };

  const handleBackToList = () => {
    setShowComparison(false);
  };

  const getDetailedUniversityById = (id: number) => detailedUniversityData.find(u => u.id === id);
  
  const getUniversityForComparison = (id: number) => {
    const detailedUniversity = getDetailedUniversityById(id);
    const basicUniversity = universitiesData.find(u => u.id === id);
    return detailedUniversity || basicUniversity;
  };

  function slugify(str: string): string {
    return (str || '').toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  }


  // Filter & sort on client-side (keeps same UI behaviour as before)
  const filteredUniversities = universitiesData
    .filter(uni => {
      const name = (uni.name || '').toString().toLowerCase();
      const loc = (uni.get_city?.city_name || '').toLowerCase();
      const matchesSearch = name.includes(searchTerm.toLowerCase()) || loc.includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          return (b.is_featured || 0) - (a.is_featured || 0);
        case 'rating':
          return parseFloat(b.rating || '0') - parseFloat(a.rating || '0');
        case 'tuition':
          return (parseInt((a.tuition_fee || '').toString().replace(/[^0-9]/g, '')) || 0) - (parseInt((b.tuition_fee || '').toString().replace(/[^0-9]/g, '')) || 0);
        case 'established':
          return parseInt(b.established_year || '0') - parseInt(a.established_year || '0');
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {!showComparison && (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Perfect
              <span className="block text-blue-200">Medical University</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Explore top-ranked medical universities offering MBBS programs with 
              scholarships and financial aid opportunities worldwide.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span>WHO Recognized</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-6 h-6 text-yellow-400" />
                <span>Scholarship Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-6 h-6 text-blue-300" />
                <span>International Programs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar - NOT sticky */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search universities, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            Showing {filteredUniversities.length} of {universitiesData.length} universities
          </div>
        </div>
      </div>

      {/* Filters - Horizontal scrollable and sticky */}
      <div className="sticky top-[60px] z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-4 min-w-max">
              <select
                name="city"
                value={selectedFilters.city}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent whitespace-nowrap"
              >
                <option value="">All Cities</option>
                {filters.cities.map(city => (
                  <option key={city.id} value={city.id}>{city.city_name || city.name}</option>
                ))}
              </select>

              <select
                name="institute_type"
                value={selectedFilters.institute_type}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent whitespace-nowrap"
              >
                <option value="">All Types</option>
                {filters.institute_types.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))} 
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent whitespace-nowrap"
              >
                <option value="featured">Featured First</option>
                <option value="rating">Highest Rated</option>
                <option value="tuition">Lowest Tuition</option>
                <option value="established">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Universities Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p className="mt-4 text-gray-600">Loading universities...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Universities</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchUniversities}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Universities Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUniversities.map((university) => (
            <div key={university.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={university.thumbnail_path ? `https://admin.mymbbsinvietnam.com/storage/${university.thumbnail_path}` : 'https://via.placeholder.com/800x400'} 
                  alt={university.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {university.is_featured && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(university.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${favorites.includes(university.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} 
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Header */}
                <div className="mb-4">
                  <div className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors h-14 flex flex-col justify-center">
                    <div className="line-clamp-2 leading-tight">
                      {university.name}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{university.get_city?.city_name || '—'}, {university.get_province?.province_name || '—'}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-semibold">{university.rating || '—'}</span>
                      <span className="ml-1 text-sm text-gray-500">(0)</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      Est. {university.established_year || '—'}
                    </div>
                  </div>
                </div>

                {/* Scholarship Info */}
                {university.scholarship_name && (
                <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{university.scholarship_name}</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Scholarship
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <div className="font-semibold text-green-600">{university.scholarship_amount || '—'}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Seats:</span>
                      <div className="font-semibold">{university.seats_available || '—'} available</div>
                    </div>
                  </div>
                </div>
                )}

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Students:</span>
                    <div className="font-semibold">{university.students || '—'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Tuition:</span>
                    <div className="font-semibold text-blue-600">{university.tuition_fee || '—'}</div>
                  </div>
                </div>

                {/* Recognition Badges */}
                <div className="flex flex-wrap gap-2 mb-4 flex-grow">
                  {university.approved_by && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {university.approved_by}
                    </span>
                  )}
                  {university.institute_type && (
                    <span className="inline-flex items-center justify-center min-w-[100px] px-3 py-1.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full text-center">
                      {university.institute_type.institute_type}
                    </span>
                  )}
                </div>

                {/* Action Buttons - Fixed at bottom */}
                <div className="flex space-x-2 mt-auto">
                  <Link to={`/universities/${slugify(university.name as string)}`} className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl hover:bg-red-700 transition-colors font-semibold text-center">
                    View Details
                  </Link>
                  <button 
                    onClick={() => toggleCompare(university.id)}
                    className={`flex-1 py-3 px-4 rounded-xl transition-colors font-semibold ${
                      compareList.includes(university.id)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={!compareList.includes(university.id) && compareList.length >= 3}
                  >
                    {compareList.includes(university.id) ? 'Added to Compare' : 'Compare'}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedUniversityForDownload(university);
                      setShowDownloadPopup(true);
                    }}
                    className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex-shrink-0"
                  >
                    <FaDownload className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredUniversities.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No universities found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Compare Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-gray-900">
                  Compare Universities ({compareList.length}/3)
                </span>
                <div className="flex space-x-2">
                  {compareList.map(id => {
                    const uni = universitiesData.find(u => u.id === id);
                    return uni ? (
                      <div key={id} className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                        <span className="text-sm text-blue-800">{(uni.name || '').split(' ')[0]}</span>
                        <button 
                          onClick={() => toggleCompare(id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={clearCompare}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear All
                </button>
                <button 
                  onClick={handleCompareNow}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  disabled={compareList.length < 2}
                >
                  Compare Now ({compareList.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {/* Comparison View */}
      {showComparison && (
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleBackToList}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back to Universities</span>
                  </button>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Compare Universities</h1>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    {compareList.length} universities selected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            {comparisonLoading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                <p className="mt-4 text-gray-600">Loading detailed comparison data...</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-red-600 text-white">
                      <th className="text-left p-6 font-semibold">Features</th>
                      {compareList.map((id) => {
                        const detailedUniversity = getDetailedUniversityById(id);
                        const basicUniversity = universitiesData.find(u => u.id === id);
                        const university = detailedUniversity || basicUniversity;
                        return (
                          <th key={id} className="text-center p-6 font-semibold min-w-64">
                            <div className="space-y-2">
                              <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-white">
                                {university?.thumbnail_path ? (
                                  <img 
                                    src={`https://admin.mymbbsinvietnam.com/storage/${university.thumbnail_path}`}
                                    alt={university?.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">No Image</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-sm font-medium">{university?.name}</div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Location */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">📍</span>
                          <span>Location</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.get_city?.city_name || 'N/A'}, {university?.get_province?.province_name || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Established Year */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">📅</span>
                          <span>Established</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.established_year || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Rating */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">⭐</span>
                          <span>Rating</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.rating ? `★ ${university.rating}` : 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Total Students */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">👥</span>
                          <span>Total Students</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.students ? `${university.students.toLocaleString()}+` : 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Annual Fees */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">💰</span>
                          <span>Annual Fees (USD)</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.tuition_fee ? (
                              <span className="text-green-600 font-semibold">${university.tuition_fee}</span>
                            ) : 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Institute Type */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🏛️</span>
                          <span>Institute Type</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.institute_type?.institute_type || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Scholarship Information */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🎁</span>
                          <span>Scholarship</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.scholarship_name ? (
                              <div>
                                <div className="font-medium">{university.scholarship_name}</div>
                                {university.scholarship_amount && (
                                  <div className="text-sm text-green-600">${university.scholarship_amount}</div>
                                )}
                                {university.seats_available && (
                                  <div className="text-sm text-gray-600">{university.seats_available} seats available</div>
                                )}
                              </div>
                            ) : 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Approved By */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🏛️</span>
                          <span>Approved By</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.approved_by || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Featured Status */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">⭐</span>
                          <span>Featured</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.is_featured ? (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                Featured
                              </span>
                            ) : 'No'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Course Duration */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🎓</span>
                          <span>Course Duration</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.course_duration || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Medium of Instruction */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🌐</span>
                          <span>Medium of Instruction</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.medium_of_instruction || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* FMGE Pass Rate */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">📊</span>
                          <span>FMGE Pass Rate</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.fmge_pass_rate || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Eligibility */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">📋</span>
                          <span>Eligibility</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.eligibility || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* NEET Requirement */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🏥</span>
                          <span>NEET Requirement</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.neet_requirement || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* International Recognition */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🌍</span>
                          <span>International Recognition</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.international_recognition || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* English Medium */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🇬🇧</span>
                          <span>English Medium</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.english_medium || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Global Ranking */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🏆</span>
                          <span>Global Ranking</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.global_ranking || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Campus Area */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🏢</span>
                          <span>Campus Area</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.campus_area || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Labs */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🔬</span>
                          <span>Labs</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.labs || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Lecture Halls */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🎓</span>
                          <span>Lecture Halls</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.lecture_hall || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Hostel Buildings */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🏠</span>
                          <span>Hostel Buildings</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.hostel_building || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Parent Satisfaction */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">😊</span>
                          <span>Parent Satisfaction</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.parent_satisfaction || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Total Reviews */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">💬</span>
                          <span>Total Reviews</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.total_reviews || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Recommended Rate */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">👍</span>
                          <span>Recommended Rate</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.recommended_rate || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Year of Excellence */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">⭐</span>
                          <span>Year of Excellence</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.year_of_excellence || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Countries Represented */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🌎</span>
                          <span>Countries Represented</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.countries_represented || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Diverse Community */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">🤝</span>
                          <span>Diverse Community</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {university?.diverse_community || 'N/A'}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Recognition Status */}
                    <tr className="border-b border-gray-200">
                      <td className="p-6 font-medium text-gray-800 bg-gray-50">
                        <div className="flex items-center space-x-2">
                          <span className="text-red-600">✅</span>
                          <span>Recognition</span>
                        </div>
                      </td>
                      {compareList.map((id) => {
                        const university = getUniversityForComparison(id);
                        const recognitions = [];
                        if (university?.who_listed) recognitions.push('WHO Listed');
                        if (university?.nmc_approved) recognitions.push('NMC Approved');
                        if (university?.ministry_licensed) recognitions.push('Ministry Licensed');
                        if (university?.faimer_listed) recognitions.push('FAIMER Listed');
                        if (university?.mci_recognition) recognitions.push('MCI Recognition');
                        if (university?.ecfmg_eligible) recognitions.push('ECFMG Eligible');
                        
                        return (
                          <td key={id} className="p-6 text-center text-gray-700">
                            {recognitions.length > 0 ? (
                              <div className="space-y-1">
                                {recognitions.map((recognition, index) => (
                                  <div key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                    {recognition}
                                  </div>
                                ))}
                              </div>
                            ) : 'N/A'}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            )}

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={handleBackToList}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Back to List
              </button>
              <button
                onClick={clearCompare}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Clear Comparison
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extra Sections */}
      {!showComparison && (
        <>
          <WhyChooseKyrgyzstan/>
          
          {/* Additional Information Section */}
          <section className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Additional Information
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Learn more about the education system and opportunities in Kyrgyzstan
                </p>
              </div>
              
              {/* Page Content from API with Expandable Feature */}
              {pageContent && pageContent.content ? (
                <ExpandableContent 
                  content={pageContent.content}
                  maxChars={200}
                />
              ) : (
                <div className="w-full">
                  <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="text-gray-700 leading-relaxed">
                      {showMoreInfo ? (
                        <p>
                          Kyrgyzstan's education system has undergone significant reforms since independence in 1991, transitioning from the Soviet model to a more modern, internationally recognized system. The country has made substantial progress in aligning its educational standards with global benchmarks, particularly in medical education. The universities in Kyrgyzstan offer world-class medical programs that are recognized by major international medical councils including WHO, MCI, and ECFMG. Students benefit from state-of-the-art facilities, experienced faculty members, and comprehensive clinical training programs. The curriculum is designed to meet international standards while being affordable for students from various economic backgrounds. Additionally, the multicultural environment provides students with exposure to diverse cultures and medical practices, preparing them for global medical careers. The government has also implemented various scholarship programs and financial aid options to make quality education accessible to deserving students from around the world.
                        </p>
                      ) : (
                        <p>
                          Kyrgyzstan's education system has undergone significant reforms since independence in 1991, transitioning from the Soviet model to a more modern, internationally recognized system. The country has made substantial progress in...
                        </p>
                      )}
                      <button
                        onClick={() => setShowMoreInfo(!showMoreInfo)}
                        className="text-blue-600 hover:text-blue-800 underline mt-4 font-medium"
                      >
                        {showMoreInfo ? 'Show Less' : 'Show More'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
          
          <ApplicationProcess/>
          <Testimonials/>
          <FAQ2/>
        </>
      )}

      {selectedUniversityForDownload && (
        <DownloadFormPopup
          isOpen={showDownloadPopup}
          onClose={() => setShowDownloadPopup(false)}
          universityName={selectedUniversityForDownload.name}
        />
      )}
    </div>
  );
}

export default App;
