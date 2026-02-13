import  { useState, useMemo ,useEffect } from 'react';
import {  Calendar, CheckSquare, Square, Download, Loader2, AlertCircle } from 'lucide-react';
import { ScholarshipCard } from './ScholarshipCard';
import { FilterBar } from './FilterBar';
import { RequiredDocuments } from './RequiredDocuments';
import { FAQ } from './FAQ';
import { StatsBanner } from './StatsBanner';
import { getScholarships, Scholarship, ScholarshipsFilters, getPageContent, PageContentData } from '../../Api';
import ExpandableContent from '../ExpandableContent';
import { generateScholarshipPDF } from './pdfGenerator'; // Assuming pdfGenerator exists or will be created

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [selectedScholarships, setSelectedScholarships] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // API State
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filters, setFilters] = useState<ScholarshipsFilters>({ scholarshipTypes: [], applicationModes: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalScholarships, setTotalScholarships] = useState(0);
  const [pageContent, setPageContent] = useState<PageContentData | null>(null);

  // Fetch scholarships from API
  const fetchScholarships = async (params: {
    search?: string;
    scholarship_type?: string;
    application_mode?: string;
    page?: number;
  } = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getScholarships({
        search: params.search || searchTerm || undefined,
        scholarship_type: params.scholarship_type || selectedType || undefined,
        application_mode: params.application_mode || selectedMode || undefined,
        page: params.page || currentPage,
      });
      
      setScholarships(response.data.scholarships.data);
      setFilters(response.data.filters);
      setCurrentPage(response.data.scholarships.current_page);
      setTotalPages(response.data.scholarships.last_page);
      setTotalScholarships(response.data.scholarships.total);
      
    } catch (err) {
      console.error('Error fetching scholarships:', err);
      setError('Failed to load scholarships. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchScholarships();
  }, []);

  // Fetch page content
  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const response = await getPageContent('scholarships');
        setPageContent(response.data.data);
      } catch (err) {
        console.error('Error fetching page content:', err);
        // Don't set error, just continue without content
      }
    };

    fetchPageContent();
  }, []);

  // Fetch when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!loading) {
        fetchScholarships();
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedType, selectedMode]);

  // Transform API data to match existing component structure
  const transformedScholarships = useMemo(() => {
    return scholarships.map(scholarship => ({
      university: {
        id: scholarship.university.id.toString(),
        name: scholarship.university.name,
        city: '', // Not provided by API
        country: 'Kyrgyzstan',
        scholarships: [] // Empty array to satisfy interface
      },
      scholarship: {
        id: scholarship.id.toString(),
        name: scholarship.title,
        levels: [scholarship.program],
        amount: scholarship.amount_min && scholarship.amount_max 
          ? `$${scholarship.amount_min} - $${scholarship.amount_max}` 
          : 'Contact for details',
        percentage: scholarship.discount_percentage,
        deadline: scholarship.deadline,
        eligibility: scholarship.eligibility,
        seats: scholarship.available_seats.toString(),
        applicationMode: scholarship.application_mode.toLowerCase().replace(' ', '_') as any,
        detailsSlug: scholarship.slug,
        type: scholarship.scholarship_type.toLowerCase() as any,
        coverage: scholarship.coverage,
        duration: 'Contact for details', // Not provided by API
        renewalConditions: [] // Not provided by API
      },
      uniqueId: `${scholarship.university.id}-${scholarship.id}`
    }));
  }, [scholarships]);

  const handleScholarshipSelect = (uniqueId: string) => {
    setSelectedScholarships(prev =>
      prev.includes(uniqueId)
        ? prev.filter(id => id !== uniqueId)
        : [...prev, uniqueId]
    );
  };

  const handleSelectAllScholarships = () => {
    if (selectedScholarships.length === transformedScholarships.length) {
      setSelectedScholarships([]);
    } else {
      setSelectedScholarships(transformedScholarships.map(s => s.uniqueId));
    }
  };

  const handleDownloadScholarshipGuides = async () => {
    if (selectedScholarships.length === 0) {
      alert('Please select at least one scholarship to download.');
      return;
    }

    setIsDownloading(true);

    try {
      const selectedData = transformedScholarships.filter(s => selectedScholarships.includes(s.uniqueId));
      await generateScholarshipPDF(selectedData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }

    setIsDownloading(false);
  };

  const handleViewDetails = (universityId: string, scholarshipId: string) => {
    // In a real app, this would navigate to a detailed page
    alert(`View details for ${scholarshipId} at ${universityId}`);
  };
useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
       
          <>
            <StatsBanner />
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 p-2">Available Scholarships</h2>
              <p className="text-gray-600 text-lg mb-6 p-2">
                Discover scholarship opportunities at top medical universities in Kyrgyzstan. 
                Filter by scholarship type, application mode.
              </p>
              
            </div>

            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              selectedMode={selectedMode}
              onModeChange={setSelectedMode}
              availableTypes={filters.scholarshipTypes}
              availableModes={filters.applicationModes}
            />

            {/* Control Panel for Selection and Download */}
            <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleSelectAllScholarships}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                  >
                    {selectedScholarships.length === transformedScholarships.length && transformedScholarships.length > 0 ? (
                      <CheckSquare className="h-5 w-5 text-red-600" />
                    ) : (
                      <Square className="h-5 w-5 text-gray-500" />
                    )}
                    <span className="font-medium text-gray-700">
                      {selectedScholarships.length === transformedScholarships.length && transformedScholarships.length > 0 ? 'Deselect All' : 'Select All'}
                    </span>
                  </button>
                  <div className="text-sm text-gray-600">
                    {selectedScholarships.length} of {transformedScholarships.length} selected
                  </div>
                </div>

                <button
                  onClick={handleDownloadScholarshipGuides}
                  disabled={selectedScholarships.length === 0 || isDownloading}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  <Download className="h-5 w-5" />
                  <span>
                    {isDownloading ? 'Generating PDF...' : 'Download Guides'}
                  </span>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                <p className="text-gray-600">Loading scholarships...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-800">{error}</p>
                </div>
                <button
                  onClick={() => fetchScholarships()}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Results Summary */}
            {!loading && !error && (
              <div className="mb-6 flex items-center justify-between pl-2">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{transformedScholarships.length}</span> of{' '}
                  <span className="font-semibold">{totalScholarships}</span> scholarship
                  {totalScholarships !== 1 ? 's' : ''}
                  {(searchTerm || selectedType || selectedMode) && (
                    <span> matching your criteria</span>
                  )}
                </p>
                
                {(searchTerm || selectedType || selectedMode) && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedType('');
                      setSelectedMode('');
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Scholarships Grid */}
            {!loading && !error && transformedScholarships.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {transformedScholarships.map(({ university, scholarship, uniqueId }) => (
                  <ScholarshipCard
                    key={uniqueId}
                    university={university}
                    scholarship={scholarship}
                    onViewDetails={handleViewDetails}
                    isSelected={selectedScholarships.includes(uniqueId)}
                    onSelect={() => handleScholarshipSelect(uniqueId)}
                  />
                ))}
              </div>
            )}

            {/* No Results State */}
            {!loading && !error && transformedScholarships.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Calendar className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No scholarships found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or clear the filters to see all available scholarships.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                    setSelectedMode('');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Show All Scholarships
                </button>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mb-8">
                <button
                  onClick={() => fetchScholarships({ page: currentPage - 1 })}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => fetchScholarships({ page: pageNum })}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => fetchScholarships({ page: currentPage + 1 })}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* Intake Information */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Academic Intakes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-green-700 mb-2">September Intake (Main)</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Application Deadline: July 31st</li>
                    <li>• Classes Begin: September 1st</li>
                    <li>• Most scholarships available</li>
                    <li>• Recommended for fresh graduates</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h4 className="text-lg font-semibold text-blue-700 mb-2">February Intake</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Application Deadline: December 31st</li>
                    <li>• Classes Begin: February 1st</li>
                    <li>• Limited scholarships available</li>
                    <li>• Good for gap year students</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
 

         <RequiredDocuments />
     <FAQ />
     
     {/* Page Content from API above footer with Expandable Feature */}
     {pageContent && pageContent.content && (
       <div className="max-w-7xl mx-auto px-4 py-8">
         <h2 className="text-3xl font-bold mb-2 text-center">Additional Information</h2>
         <ExpandableContent 
           content={pageContent.content}
           maxChars={200}
         />
       </div>
     )}
      </main>

     
    </div>
  );
}

export default App;