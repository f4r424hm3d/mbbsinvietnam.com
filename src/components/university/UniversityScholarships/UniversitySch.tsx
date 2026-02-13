import { useState, useMemo, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { ScholarshipCard } from './ScholarshipCard';
import { RequiredDocuments } from './RequiredDocuments';
import { FAQ } from '../UniversityCourses/FAQ';
import { getUniversityIntakes, UniversityIntake, getUniversityScholarships, UniversityScholarship } from '../../../Api';

interface UniversitySchProps {
  universityId: number;
}

function UniversitySch({ universityId }: UniversitySchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [activeSection] = useState('scholarships');
  const [intakeData, setIntakeData] = useState<UniversityIntake[] | null>(null);
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [scholarshipsData, setScholarshipsData] = useState<UniversityScholarship[] | null>(null);
  const [scholarshipsLoading, setScholarshipsLoading] = useState(false);
  const [scholarshipsError, setScholarshipsError] = useState<string | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);

  // Filter scholarships based on search and filters
  const filteredScholarships = useMemo(() => {
    if (!scholarshipsData) return [];
    
    return scholarshipsData.filter((scholarship) => {
      const matchesSearch = 
        scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.program.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !selectedType || scholarship.scholarship_type.toLowerCase() === selectedType.toLowerCase();
      const matchesMode = !selectedMode || scholarship.application_mode.toLowerCase() === selectedMode.toLowerCase();
      
      return matchesSearch && matchesType && matchesMode && scholarship.is_active === 1;
    });
  }, [scholarshipsData, searchTerm, selectedType, selectedMode]);

  // Function to count words in text
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Function to truncate text to specified word count
  const truncateText = (text: string, wordLimit: number) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  // Scholarship content text
  const scholarshipContent = "Scholarships play a vital role in supporting students to achieve their educational dreams without financial stress. They are awarded based on merit, need, talent, or specific criteria set by universities or organizations. Scholarships not only reduce tuition costs but also encourage academic excellence and personal growth. Many universities, including top medical institutions in Kyrgyzstan, offer scholarships to attract talented international students. These opportunities can cover partial or full expenses, depending on the program. Applying for scholarships requires careful research, timely submission of documents, and meeting eligibility requirements. Scholarships empower students to focus on learning and build successful global careers";
  
  const wordCount = countWords(scholarshipContent);
  const shouldTruncate = wordCount > 5;
  const displayText = shouldTruncate && !showFullContent 
    ? truncateText(scholarshipContent, 5) 
    : scholarshipContent;

  // Fetch university scholarships
  useEffect(() => {
    const fetchScholarships = async () => {
      if (!universityId) return;
      
      try {
        setScholarshipsLoading(true);
        setScholarshipsError(null);
        
        const response = await getUniversityScholarships(universityId);
        setScholarshipsData(response.data.scholarships);
      } catch (err) {
        console.error('Error fetching scholarships:', err);
        setScholarshipsError('Failed to load scholarships');
        setScholarshipsData(null);
      } finally {
        setScholarshipsLoading(false);
      }
    };

    fetchScholarships();
  }, [universityId]);

  // Fetch university intakes
  useEffect(() => {
    const fetchIntakes = async () => {
      if (!universityId) return;
      
      try {
        setIntakeLoading(true);
        
        // Fetch intakes for the university
        const response = await getUniversityIntakes(universityId);
        console.log('Intake API Response:', response);
        console.log('Intake Data:', response.data.intakes);
        setIntakeData(response.data.intakes);
      } catch (err) {
        console.error('Error fetching intakes:', err);
        // Don't set error state, just leave intakeData as null to show "not available" message
        setIntakeData(null);
      } finally {
        setIntakeLoading(false);
      }
    };

    fetchIntakes();
  }, [universityId]);



  return (
    <div className="min-h-screen bg-gray-50 -mt-10">
     

       
   

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'scholarships' && (
          <>
            {/* <StatsBanner /> */}
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Scholarships</h2>
              <div className="text-gray-600 text-lg mb-6">
                <p className="mb-4">
                  {displayText}
                </p>
                {shouldTruncate && (
                  <button
                    onClick={() => setShowFullContent(!showFullContent)}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 underline"
                  >
                    {showFullContent ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>

            

            {/* Scholarships Grid */}
            {scholarshipsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading scholarships...</span>
              </div>
            ) : scholarshipsError ? (
              <div className="text-center py-12">
                <div className="text-red-600 text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Scholarships</h3>
                <p className="text-gray-600">{scholarshipsError}</p>
              </div>
            ) : filteredScholarships.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {filteredScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                  />
                ))}
              </div>
            ) : (
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

            {/* Intake Information */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Academic Intakes</h3>
              
              {intakeLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading intake information...</span>
                </div>
              ) : intakeData && intakeData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {intakeData.map((intake) => (
                    <div key={intake.id} className="bg-white p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold text-green-700 mb-2">{intake.name}</h4>
                      <ul className="text-gray-700 space-y-1">
                        {intake.application_deadline && (
                          <li>• Application Deadline: {new Date(intake.application_deadline).toLocaleDateString()}</li>
                        )}
                        {intake.classes_begin && (
                          <li>• Classes Begin: {new Date(intake.classes_begin).toLocaleDateString()}</li>
                        )}
                        {intake.highlights && (
                          <>
                            {(() => {
                              try {
                                const highlights = JSON.parse(intake.highlights);
                                return Array.isArray(highlights) ? highlights.map((highlight: string, index: number) => (
                                  <li key={index}>• {highlight}</li>
                                )) : null;
                              } catch (error) {
                                console.error('Error parsing highlights:', error);
                                return <li>• {intake.highlights}</li>;
                              }
                            })()}
                          </>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-2">
                    <Calendar className="w-12 h-12 mx-auto mb-2" />
                  </div>
                  <p className="text-gray-600">
                    {intakeData === null 
                      ? "Intake data is not available." 
                      : "No intake information found for this university."
                    }
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeSection === 'documents' && <RequiredDocuments />}
        {activeSection === 'faq' && <FAQ />}
      </main>

     
    </div>
  );
}

export default UniversitySch;