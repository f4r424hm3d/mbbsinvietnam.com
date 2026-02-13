import  { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { ScholarshipCard } from './ScholarshipCard';

import { RequiredDocuments } from './RequiredDocuments';
import { FAQ } from './FAQ';

import { MBBSCoursePage } from './MBBSCoursePage';
import { getUniversityPrograms, UniversityProgram } from '../../../Api';

interface CoursesMainProps {
  universityId: number;
  universitySlug: string;
}

function CoursesMain({ universityId, universitySlug }: CoursesMainProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [activeSection] = useState('scholarships');
  const [showFullContent, setShowFullContent] = useState(false);
  const [programs, setPrograms] = useState<UniversityProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await getUniversityPrograms(universityId, { limit: 6 });
        setPrograms(response.data.programs);
        setError(null);
      } catch (err) {
        console.error("Error fetching university programs:", err);
        setError("Failed to load programs");
      } finally {
        setLoading(false);
      }
    };

    if (universityId) {
      fetchPrograms();
    }
  }, [universityId]);

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

  // Courses content text
  const coursesContent = "Discover available courses at top medical universities in Kyrgyzstan. Filter by course type, application mode, or search for specific universities.";
  
  const wordCount = countWords(coursesContent);
  const shouldTruncate = wordCount > 5;
  const displayText = shouldTruncate && !showFullContent 
    ? truncateText(coursesContent, 5) 
    : coursesContent;

  // Filter programs based on search and filters
  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const matchesSearch = 
        program.program_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.study_mode.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = !selectedType || program.study_mode === selectedType;
      const matchesMode = !selectedMode || program.study_mode === selectedMode;
      
      return matchesSearch && matchesType && matchesMode;
    });
  }, [programs, searchTerm, selectedType, selectedMode]);

  const handleViewDetails = (_universityId: string, program: UniversityProgram) => {
    // Navigate to the program details page with program slug
    navigate(`/universities/${universitySlug}/mbbscourses/${program.program_slug}`);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading programs...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Programs</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     

     

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeSection === 'scholarships' && (
          <>
           
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Courses</h2>
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

           

            {/* Programs Grid */}
            {filteredPrograms.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
                {filteredPrograms.map((program) => (
                  <ScholarshipCard
                    key={program.id}
                    program={program}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Calendar className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or clear the filters to see all available programs.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedType('');
                    setSelectedMode('');
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Show All Programs
                </button>
              </div>
            )}

       
            
          </>
        )}

        {activeSection === 'documents' && <RequiredDocuments />}
        {activeSection === 'course' && <MBBSCoursePage universityId={universityId} />}
        {activeSection === 'faq' && <FAQ />}
      </main>

    </div>
  );
}

export default CoursesMain;