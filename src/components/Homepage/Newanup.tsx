import  { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Minus, ChevronUp, ChevronDown, Calendar, Filter, Loader2, AlertCircle } from 'lucide-react';
import { getFMGERates } from '../../Api'

interface UniversityData {
  university_name: string;
  year: string;
  total_applications: number;
  accepted_students: number;
  acceptance_rate: string;
  trend: string;
}

interface ApiResponse {
  summary: {
    selected_year: string;
    total_applications: number;
    total_accepted: number;
    overall_acceptance_rate: string;
  };
  data: UniversityData[];
}


type SortField = 'university_name' | 'total_applications' | 'accepted_students' | 'acceptance_rate';
type SortDirection = 'asc' | 'desc';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string | 'all'>('all');
  const [selectedUniversity, setSelectedUniversity] = useState<string | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('total_applications');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [universitiesData, setUniversitiesData] = useState<UniversityData[]>([]);
  const [apiSummary, setApiSummary] = useState<ApiResponse['summary'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data: ApiResponse = await getFMGERates();
        console.log('FMGE API Response:', data);
        
        setUniversitiesData(data.data);
        setApiSummary(data.summary);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch FMGE data';
        setError(errorMessage);
        console.error('Error fetching FMGE data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const availableYears = [...new Set(universitiesData.map(uni => uni.year))].sort();
  const availableUniversities = [...new Set(universitiesData.map(uni => uni.university_name))].sort();

  const filteredData = universitiesData.filter(university => {
    const matchesSearch = university.university_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || university.year === selectedYear;
    const matchesUniversity = selectedUniversity === 'all' || university.university_name === selectedUniversity;
    return matchesSearch && matchesYear && matchesUniversity;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    
    // Handle acceptance_rate as string that needs to be converted to number
    if (sortField === 'acceptance_rate') {
      aVal = parseFloat(aVal as string);
      bVal = parseFloat(bVal as string);
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-yellow-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAcceptanceRateColor = (rate: string | number) => {
    const numericRate = typeof rate === 'string' ? parseFloat(rate) : rate;
    if (numericRate >= 30) return 'text-green-600 bg-green-50';
    if (numericRate >= 15) return 'text-blue-600 bg-blue-50';
    if (numericRate > 0) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const totalApplications = filteredData.reduce((sum, uni) => sum + uni.total_applications, 0);
  const totalAccepted = filteredData.reduce((sum, uni) => sum + uni.accepted_students, 0);
  const overallAcceptanceRate = totalApplications > 0 ? (totalAccepted / totalApplications) * 100 : 0;

  // Use API summary if available and showing all data, otherwise use calculated values
  const displaySummary = apiSummary && selectedYear === 'all' && selectedUniversity === 'all' && !searchTerm ? {
    totalApplications: apiSummary.total_applications,
    totalAccepted: apiSummary.total_accepted,
    overallAcceptanceRate: parseFloat(apiSummary.overall_acceptance_rate)
  } : {
    totalApplications,
    totalAccepted,
    overallAcceptanceRate
  };

  // Year-over-year comparison for selected universities
  const getYearOverYearData = (universityName: string) => {
    return universitiesData
      .filter(uni => uni.university_name === universityName)
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  };

  const getYearOverYearChange = (universityName: string, metric: keyof UniversityData) => {
    const yearData = getYearOverYearData(universityName);
    if (yearData.length < 2) return null;
    
    const latest = yearData[yearData.length - 1];
    const previous = yearData[yearData.length - 2];
    
    let latestVal: number, previousVal: number;
    
    if (metric === 'acceptance_rate') {
      latestVal = parseFloat(latest[metric] as string);
      previousVal = parseFloat(previous[metric] as string);
    } else {
      latestVal = latest[metric] as number;
      previousVal = previous[metric] as number;
    }
    
    if (previousVal !== 0) {
      const change = (latestVal - previousVal) / previousVal * 100;
      return change;
    }
    return null;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 -mt-10 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading FMGE Data</h2>
          <p className="text-gray-600">Fetching university admission statistics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 -mt-10 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 -mt-10">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">   
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-500 to-red-700 px-8 py-6 text-white">
            <h1 className="text-3xl font-bold mb-2">Kyrgyzstan Medical Universities</h1>
            <p className="text-blue-100 mb-4">FMGE (Foreign Medical Graduate Exam) Acceptance Rates & Performance Data</p>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-blue-200 text-sm">Selected Year</p>
                <p className="text-2xl font-bold">{selectedYear === 'all' ? 'All Years' : selectedYear}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-blue-200 text-sm">Total Applications</p>
                <p className="text-2xl font-bold">{displaySummary.totalApplications.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-blue-200 text-sm">Total Accepted</p>
                <p className="text-2xl font-bold">{displaySummary.totalAccepted.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-blue-200 text-sm">Overall Acceptance Rate</p>
                <p className="text-2xl font-bold">{displaySummary.overallAcceptanceRate.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search universities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              {/* University Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedUniversity}
                  onChange={(e) => setSelectedUniversity(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white min-w-[200px]"
                >
                  <option value="all">All Universities</option>
                  {availableUniversities.map(university => (
                    <option key={university} value={university}>
                      {university.length > 40 ? university.substring(0, 40) + '...' : university}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Year Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white min-w-[150px]"
                >
                  <option value="all">All Years</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              {/* Filter indicator */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Filter className="w-4 h-4" />
                <span>Showing {sortedData.length} results</span>
              </div>
            </div>
            
            {/* Active Filters Display */}
            {(selectedUniversity !== 'all' || selectedYear !== 'all' || searchTerm) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedUniversity !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    University: {selectedUniversity.length > 30 ? selectedUniversity.substring(0, 30) + '...' : selectedUniversity}
                    <button
                      onClick={() => setSelectedUniversity('all')}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {selectedYear !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Year: {selectedYear}
                    <button
                      onClick={() => setSelectedYear('all')}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* University-specific Analysis Section */}
          {selectedUniversity !== 'all' && (
            <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {selectedUniversity} - Year-wise Performance
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getYearOverYearData(selectedUniversity).map((yearData, index, array) => {
                  const prevYear = array[index - 1];
                  const applicationChange = prevYear ? 
                    ((yearData.total_applications - prevYear.total_applications) / prevYear.total_applications * 100) : null;
                  const acceptanceChange = prevYear ? 
                    ((yearData.accepted_students - prevYear.accepted_students) / prevYear.accepted_students * 100) : null;
                  const rateChange = prevYear ? 
                    (parseFloat(yearData.acceptance_rate) - parseFloat(prevYear.acceptance_rate)) : null;

                  return (
                    <div key={yearData.year} className="bg-white rounded-lg shadow-md p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{yearData.year}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAcceptanceRateColor(yearData.acceptance_rate)}`}>
                          {parseFloat(yearData.acceptance_rate).toFixed(2)}%
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Applications</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{yearData.total_applications.toLocaleString()}</span>
                              {applicationChange !== null && (
                                <span className={`text-xs px-1 py-0.5 rounded ${
                                  applicationChange > 0 ? 'bg-green-100 text-green-700' : 
                                  applicationChange < 0 ? 'bg-red-100 text-red-700' : 
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {applicationChange > 0 ? '+' : ''}{applicationChange.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Accepted</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{yearData.accepted_students.toLocaleString()}</span>
                              {acceptanceChange !== null && (
                                <span className={`text-xs px-1 py-0.5 rounded ${
                                  acceptanceChange > 0 ? 'bg-green-100 text-green-700' : 
                                  acceptanceChange < 0 ? 'bg-red-100 text-red-700' : 
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {acceptanceChange > 0 ? '+' : ''}{acceptanceChange.toFixed(1)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Rate Change</span>
                            <div className="flex items-center gap-2">
                              {rateChange !== null && (
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  rateChange > 0 ? 'bg-green-100 text-green-700' : 
                                  rateChange < 0 ? 'bg-red-100 text-red-700' : 
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {rateChange > 0 ? '+' : ''}{rateChange.toFixed(2)}pp
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => handleSort('university_name')}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      University Name
                      <SortIcon field="university_name" />
                    </button>
                  </th>
                  {selectedYear === 'all' && (
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      Year
                    </th>
                  )}
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => handleSort('total_applications')}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      Total Applications
                      <SortIcon field="total_applications" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => handleSort('accepted_students')}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      Accepted Students
                      <SortIcon field="accepted_students" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    <button
                      onClick={() => handleSort('acceptance_rate')}
                      className="flex items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      Acceptance Rate
                      <SortIcon field="acceptance_rate" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    Trend
                  </th>
                  {selectedYear !== 'all' && (
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      YoY Change
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedData.map((university, index) => {
                  const yoyChange = getYearOverYearChange(university.university_name, 'acceptance_rate');
                  return (
                    <tr 
                      key={`${university.university_name}-${university.year}`} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 leading-5">
                              {university.university_name}
                            </h3>
                          </div>
                        </div>
                      </td>
                      {selectedYear === 'all' && (
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {university.year}
                          </span>
                        </td>
                      )}
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-semibold text-gray-900">
                          {university.total_applications.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-lg font-semibold text-gray-900">
                          {university.accepted_students.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAcceptanceRateColor(university.acceptance_rate)}`}>
                          {parseFloat(university.acceptance_rate).toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          {getTrendIcon(university.trend)}
                        </div>
                      </td>
                      {selectedYear !== 'all' && (
                        <td className="px-6 py-4 text-center">
                          {yoyChange !== null ? (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              yoyChange > 0 ? 'bg-green-100 text-green-800' : 
                              yoyChange < 0 ? 'bg-red-100 text-red-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {yoyChange > 0 ? '+' : ''}{yoyChange.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Showing {sortedData.length} results 
              {selectedYear !== 'all' && ` for ${selectedYear}`}
              {selectedUniversity !== 'all' && ` for ${selectedUniversity.length > 40 ? selectedUniversity.substring(0, 40) + '...' : selectedUniversity}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>

        {/* Year-wise Insights - Only show when no specific university is selected */}
        {selectedUniversity === 'all' && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableYears.map(year => {
              const yearData = universitiesData.filter(uni => uni.year === year);
              const yearTotal = yearData.reduce((sum, uni) => sum + uni.total_applications, 0);
              const yearAccepted = yearData.reduce((sum, uni) => sum + uni.accepted_students, 0);
              const yearRate = yearTotal > 0 ? (yearAccepted / yearTotal) * 100 : 0;
              
              return (
                <div key={year} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{year} Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Applications:</span>
                      <span className="font-medium">{yearTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Accepted:</span>
                      <span className="font-medium">{yearAccepted.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rate:</span>
                      <span className="font-medium text-blue-600">{yearRate.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        
      </div>
    </div>
  );
}

export default App;