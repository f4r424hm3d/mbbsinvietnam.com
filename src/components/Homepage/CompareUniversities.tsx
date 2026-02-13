import  { useState , useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import Newanup from './Newanup';
import { getCompareUniversities, CompareUniversity, getUniversityDetail, UniversityDetailForComparison, IMAGE_BASE_URL, getPageContent, PageContentData } from '../../Api';
import ExpandableContent from '../ExpandableContent';

const CompareUniversities = () => {
  const location = useLocation();
  const isStandalonePage = location.pathname === '/compare';
  const [selectedUniversities, setSelectedUniversities] = useState<number[]>([]);
  const [universities, setUniversities] = useState<CompareUniversity[]>([]);
  const [universityDetails, setUniversityDetails] = useState<UniversityDetailForComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [pageContent, setPageContent] = useState<PageContentData | null>(null);

  const availableUniversities = universities.filter(u => !selectedUniversities.includes(u.id));

  const handleUniversityChange = (index: number, universityId: number) => {
    const newSelected = [...selectedUniversities];
    newSelected[index] = universityId;
    setSelectedUniversities(newSelected);
  };

  const toggleShowAllFeatures = () => {
    setShowAllFeatures(!showAllFeatures);
  };

  // Define the features that should be shown by default (up to Institute Type)
  const defaultFeatures = [
    'Location',
    'Established',
    'Rating',
    'Total Students',
    'Annual Fees (USD)',
    'Course Duration',
    'Institute Type'
  ];

  const shouldShowFeature = (featureName: string) => {
    // On standalone page, show all features. On homepage, show based on toggle.
    if (isStandalonePage) return true;
    return showAllFeatures || defaultFeatures.includes(featureName);
  };

  const getUniversityById = (id: number) => universities.find(u => u.id === id);
  const getUniversityDetailById = (id: number) => universityDetails.find(u => u.id === id);

  // Fetch universities from API
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCompareUniversities();
        setUniversities(response.data.universities);
        
        // Set initial selected universities (first 3 if available)
        if (response.data.universities.length > 0) {
          const initialSelection = response.data.universities.slice(0, 3).map(u => u.id);
          setSelectedUniversities(initialSelection);
        }
      } catch (err) {
        console.error('Error fetching universities:', err);
        setError('Failed to load universities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  // Fetch detailed university data when selected universities change
  useEffect(() => {
    const fetchUniversityDetails = async () => {
      if (selectedUniversities.length === 0) return;

      try {
        const detailPromises = selectedUniversities.map(id => getUniversityDetail(id));
        const detailResponses = await Promise.all(detailPromises);
        const details = detailResponses.map(response => response.data.university);
        setUniversityDetails(details);
      } catch (err) {
        console.error('Error fetching university details:', err);
        // Don't set error here as basic comparison can still work
      }
    };

    fetchUniversityDetails();
  }, [selectedUniversities]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // Fetch page content
  useEffect(() => {
    const fetchPageContent = async () => {
      if (!isStandalonePage) return; // Only fetch on standalone page
      
      try {
        const response = await getPageContent('compare');
        setPageContent(response.data.data);
      } catch (err) {
        console.error('Error fetching page content:', err);
        // Don't set error, just continue without content
      }
    };

    fetchPageContent();
  }, [isStandalonePage]);
  
  if (loading) {
    return (
      <section id="compare" className="py-20 bg-gray-50 -mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 -mt-10">
              Compare Universities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Loading universities...
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="compare" className="py-20 bg-gray-50 -mt-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 -mt-10">
              Compare Universities
            </h2>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="compare" className="py-20 bg-gray-50 -mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 -mt-10">
            Compare Universities
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select universities to compare their basic information.
          </p>
        </div>

        {/* University Selector */}
        <div className="mb-12">
          <div className="grid md:grid-cols-3 gap-6">
            {selectedUniversities.map((selectedId, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  University {index + 1}
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => handleUniversityChange(index, parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value={selectedId}>
                    {getUniversityById(selectedId)?.name}
                  </option>
                  {availableUniversities.map((university) => (
                    <option key={university.id} value={university.id}>
                      {university.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Comparison */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="text-left p-4 font-semibold">Features</th>
                  {selectedUniversities.map((id) => {
                    const university = getUniversityById(id);
                    const universityDetail = getUniversityDetailById(id);
                    return (
                      <th key={id} className="text-center p-4 font-semibold min-w-64">
                        <div className="space-y-2">
                          <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-white">
                            {universityDetail?.thumbnail_path ? (
                              <img 
                                src={`${IMAGE_BASE_URL}/${universityDetail.thumbnail_path}`}
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
                  <td className="p-3 font-medium text-gray-800 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">📍</span>
                      <span>Location</span>
                    </div>
                  </td>
                  {selectedUniversities.map((id) => {
                    const universityDetail = getUniversityDetailById(id);
                    return (
                      <td key={id} className="p-3 text-center text-gray-700">
                        {universityDetail?.get_city?.city_name || 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Established Year */}
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-800 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">📅</span>
                      <span>Established</span>
                    </div>
                  </td>
                  {selectedUniversities.map((id) => {
                    const universityDetail = getUniversityDetailById(id);
                    return (
                      <td key={id} className="p-3 text-center text-gray-700">
                        {universityDetail?.established_year || 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Rating */}
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-800 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">⭐</span>
                      <span>Rating</span>
                    </div>
                  </td>
                  {selectedUniversities.map((id) => {
                    const universityDetail = getUniversityDetailById(id);
                    return (
                      <td key={id} className="p-3 text-center text-gray-700">
                        {universityDetail?.rating ? `★ ${universityDetail.rating}` : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Total Students */}
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-800 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">👥</span>
                      <span>Total Students</span>
                    </div>
                  </td>
                  {selectedUniversities.map((id) => {
                    const universityDetail = getUniversityDetailById(id);
                    return (
                      <td key={id} className="p-3 text-center text-gray-700">
                        {universityDetail?.students ? `${universityDetail.students.toLocaleString()}+` : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Annual Fees */}
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-800 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">💰</span>
                      <span>Annual Fees (USD)</span>
                    </div>
                  </td>
                  {selectedUniversities.map((id) => {
                    const universityDetail = getUniversityDetailById(id);
                    return (
                      <td key={id} className="p-3 text-center text-gray-700">
                        {universityDetail?.tuition_fee ? (
                          <span className="text-green-600 font-semibold">${universityDetail.tuition_fee}</span>
                        ) : 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Course Duration */}
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-800 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">🎓</span>
                      <span>Course Duration</span>
                    </div>
                  </td>
                  {selectedUniversities.map((id) => {
                    const universityDetail = getUniversityDetailById(id);
                    return (
                      <td key={id} className="p-3 text-center text-gray-700">
                        {universityDetail?.course_duration || 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Institute Type */}
                <tr className="border-b border-gray-200">
                  <td className="p-3 font-medium text-gray-800 bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600">🏛️</span>
                      <span>Institute Type</span>
                    </div>
                  </td>
                  {selectedUniversities.map((id) => {
                    const universityDetail = getUniversityDetailById(id);
                    return (
                      <td key={id} className="p-3 text-center text-gray-700">
                        {universityDetail?.institute_type?.institute_type || 'N/A'}
                      </td>
                    );
                  })}
                </tr>

                {/* Medium of Instruction */}
                {shouldShowFeature('Medium of Instruction') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🌐</span>
                        <span>Medium of Instruction</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.medium_of_instruction || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Recognition Status */}
                {shouldShowFeature('Recognition') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">✅</span>
                        <span>Recognition</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      const recognitions = [];
                      if (universityDetail?.who_listed) recognitions.push('WHO Listed');
                      if (universityDetail?.nmc_approved) recognitions.push('NMC Approved');
                      if (universityDetail?.ministry_licensed) recognitions.push('Ministry Licensed');
                      if (universityDetail?.faimer_listed) recognitions.push('FAIMER Listed');
                      if (universityDetail?.mci_recognition) recognitions.push('MCI Recognition');
                      if (universityDetail?.ecfmg_eligible) recognitions.push('ECFMG Eligible');
                      
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
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
                )}

                {/* Scholarship Information */}
                {shouldShowFeature('Scholarship') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🎁</span>
                        <span>Scholarship</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.scholarship_name ? (
                            <div>
                              <div className="font-medium">{universityDetail.scholarship_name}</div>
                              {universityDetail.scholarship_amount && (
                                <div className="text-sm text-green-600">${universityDetail.scholarship_amount}</div>
                              )}
                            </div>
                          ) : 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* FMGE Pass Rate */}
                {shouldShowFeature('FMGE Pass Rate') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">📊</span>
                        <span>FMGE Pass Rate</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.fmge_pass_rate || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Seats Available */}
                {shouldShowFeature('Seats Available') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🪑</span>
                        <span>Seats Available</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.seats_available ? `${universityDetail.seats_available}` : 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Approved By */}
                {shouldShowFeature('Approved By') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🏛️</span>
                        <span>Approved By</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.approved_by || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Eligibility */}
                {shouldShowFeature('Eligibility') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">📋</span>
                        <span>Eligibility</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.eligibility || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* NEET Requirement */}
                {shouldShowFeature('NEET Requirement') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🏥</span>
                        <span>NEET Requirement</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.neet_requirement || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* International Recognition */}
                {shouldShowFeature('International Recognition') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🌍</span>
                        <span>International Recognition</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.international_recognition || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* English Medium */}
                {shouldShowFeature('English Medium') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🇬🇧</span>
                        <span>English Medium</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.english_medium || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Global Ranking */}
                {shouldShowFeature('Global Ranking') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🏆</span>
                        <span>Global Ranking</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.global_ranking || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Campus Area */}
                {shouldShowFeature('Campus Area') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🏢</span>
                        <span>Campus Area</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.campus_area || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Labs */}
                {shouldShowFeature('Labs') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🔬</span>
                        <span>Labs</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.labs || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Lecture Halls */}
                {shouldShowFeature('Lecture Halls') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🎓</span>
                        <span>Lecture Halls</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.lecture_hall || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Hostel Buildings */}
                {shouldShowFeature('Hostel Buildings') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🏠</span>
                        <span>Hostel Buildings</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.hostel_building || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Parent Satisfaction */}
                {shouldShowFeature('Parent Satisfaction') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">😊</span>
                        <span>Parent Satisfaction</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.parent_satisfaction || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Total Reviews */}
                {shouldShowFeature('Total Reviews') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">💬</span>
                        <span>Total Reviews</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.total_reviews || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Recommended Rate */}
                {shouldShowFeature('Recommended Rate') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">👍</span>
                        <span>Recommended Rate</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.recommended_rate || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Year of Excellence */}
                {shouldShowFeature('Year of Excellence') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">⭐</span>
                        <span>Year of Excellence</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.year_of_excellence || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Countries Represented */}
                {shouldShowFeature('Countries Represented') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🌎</span>
                        <span>Countries Represented</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.countries_represented || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}

                {/* Diverse Community */}
                {shouldShowFeature('Diverse Community') && (
                  <tr className="border-b border-gray-200">
                    <td className="p-3 font-medium text-gray-800 bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <span className="text-red-600">🤝</span>
                        <span>Diverse Community</span>
                      </div>
                    </td>
                    {selectedUniversities.map((id) => {
                      const universityDetail = getUniversityDetailById(id);
                      return (
                        <td key={id} className="p-3 text-center text-gray-700">
                          {universityDetail?.diverse_community || 'N/A'}
                        </td>
                      );
                    })}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Show More/Show Less Button - Only on homepage */}
          {!isStandalonePage && (
            <div className="flex justify-center py-6 bg-gray-50">
              <button
                onClick={toggleShowAllFeatures}
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>{showAllFeatures ? 'Show Less' : 'Show More'}</span>
                <span className="text-lg">
                  {showAllFeatures ? '▲' : '▼'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Newanup Component */}
        <div className="mt-4">
          <Newanup />
        </div>

        {/* Page Content from API with Expandable Feature - Above Footer */}
        {isStandalonePage && pageContent && pageContent.content && (
          <div className="mt-4 mb-4">
             <h2 className="text-3xl font-bold mb-2 text-center">Additional Information</h2>
            <ExpandableContent 
              content={pageContent.content}
              maxChars={200}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CompareUniversities;