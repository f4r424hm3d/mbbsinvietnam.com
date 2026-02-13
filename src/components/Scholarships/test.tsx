import React, { useState, useEffect } from 'react';
import { Download, FileText, GraduationCap, CheckSquare, Square, Globe, MapPin, Calendar, DollarSign } from 'lucide-react';
import { generateScholarshipPDF } from './pdfGenerator';

interface University {
  id: string;
  name: string;
  location: string;
  establishedYear: number;
  scholarships: {
    name: string;
    eligibility: string[];
    amount: string;
    deadline: string;
    requirements: string[];
  }[];
  totalScholarships: number;
  averageAmount: string;
}

const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Kyrgyz State Medical Academy',
    location: 'Bishkek, Kyrgyzstan',
    establishedYear: 1939,
    scholarships: [
      {
        name: 'Merit-Based Scholarship',
        eligibility: ['Minimum 85% in 12th grade', 'NEET qualification'],
        amount: '$2,000 - $5,000',
        deadline: 'September 30, 2024',
        requirements: ['Academic transcripts', 'NEET scorecard', 'Medical certificate']
      },
      {
        name: 'International Student Scholarship',
        eligibility: ['International students', 'Good academic record'],
        amount: '$1,500 - $3,000',
        deadline: 'October 15, 2024',
        requirements: ['Passport copy', 'Academic transcripts', 'English proficiency']
      }
    ],
    totalScholarships: 2,
    averageAmount: '$3,250'
  },
  {
    id: '2',
    name: 'Osh State University Medical Faculty',
    location: 'Osh, Kyrgyzstan',
    establishedYear: 1951,
    scholarships: [
      {
        name: 'Excellence Scholarship',
        eligibility: ['Top 10% of applicants', 'Strong recommendation letters'],
        amount: '$3,000 - $6,000',
        deadline: 'August 31, 2024',
        requirements: ['Letters of recommendation', 'Personal statement', 'Academic records']
      },
      {
        name: 'Need-Based Financial Aid',
        eligibility: ['Demonstrated financial need', 'Satisfactory academic progress'],
        amount: '$1,000 - $4,000',
        deadline: 'September 15, 2024',
        requirements: ['Financial documents', 'Income statements', 'Family background']
      },
      {
        name: 'Research Scholarship',
        eligibility: ['Interest in medical research', 'Previous research experience'],
        amount: '$2,500 - $5,500',
        deadline: 'October 1, 2024',
        requirements: ['Research portfolio', 'Project proposal', 'Faculty endorsement']
      }
    ],
    totalScholarships: 3,
    averageAmount: '$4,000'
  },
  {
    id: '3',
    name: 'International School of Medicine',
    location: 'Bishkek, Kyrgyzstan',
    establishedYear: 2003,
    scholarships: [
      {
        name: 'Presidential Scholarship',
        eligibility: ['Exceptional academic performance', 'Leadership qualities'],
        amount: '$4,000 - $8,000',
        deadline: 'July 31, 2024',
        requirements: ['Leadership portfolio', 'Academic excellence proof', 'Interview']
      },
      {
        name: 'Sports Scholarship',
        eligibility: ['National/International sports achievements', 'Medical program enrollment'],
        amount: '$1,500 - $3,500',
        deadline: 'August 15, 2024',
        requirements: ['Sports certificates', 'Achievement records', 'Medical fitness']
      }
    ],
    totalScholarships: 2,
    averageAmount: '$4,250'
  },
  {
    id: '4',
    name: 'Jalal-Abad State University Medical Institute',
    location: 'Jalal-Abad, Kyrgyzstan',
    establishedYear: 1993,
    scholarships: [
      {
        name: 'Regional Development Scholarship',
        eligibility: ['Students from developing regions', 'Commitment to serve rural areas'],
        amount: '$2,000 - $4,500',
        deadline: 'September 20, 2024',
        requirements: ['Regional background proof', 'Service commitment letter', 'Academic records']
      }
    ],
    totalScholarships: 1,
    averageAmount: '$3,250'
  }
];

function App() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Simulate fetching data from the website
    const fetchUniversities = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUniversities(mockUniversities);
      setIsLoading(false);
    };

    fetchUniversities();
  }, []);

  const handleUniversitySelect = (universityId: string) => {
    setSelectedUniversities(prev => 
      prev.includes(universityId) 
        ? prev.filter(id => id !== universityId)
        : [...prev, universityId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUniversities.length === universities.length) {
      setSelectedUniversities([]);
    } else {
      setSelectedUniversities(universities.map(u => u.id));
    }
  };

  const handleDownload = async () => {
    if (selectedUniversities.length === 0) {
      alert('Please select at least one university');
      return;
    }

    setIsDownloading(true);
    
    try {
      const selectedData = universities.filter(u => selectedUniversities.includes(u.id));
      await generateScholarshipPDF(selectedData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
    
    setIsDownloading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <h3 className="text-xl font-semibold text-gray-800">Fetching Universities</h3>
            <p className="text-gray-600 text-center">
              Scanning scholarship opportunities from Kyrgyzstan medical universities...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">
              Kyrgyzstan Medical University
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-indigo-600 mb-2">
            Scholarship Guide Downloader
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select universities to download comprehensive scholarship guides. 
            Found {universities.length} universities with scholarship opportunities.
          </p>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                {selectedUniversities.length === universities.length ? (
                  <CheckSquare className="h-5 w-5 text-indigo-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-500" />
                )}
                <span className="font-medium text-gray-700">
                  {selectedUniversities.length === universities.length ? 'Deselect All' : 'Select All'}
                </span>
              </button>
              <div className="text-sm text-gray-600">
                {selectedUniversities.length} of {universities.length} selected
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={selectedUniversities.length === 0 || isDownloading}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Download className="h-5 w-5" />
              <span>
                {isDownloading ? 'Generating PDF...' : 'Download Guides'}
              </span>
            </button>
          </div>
        </div>

        {/* Universities Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {universities.map((university) => (
            <div
              key={university.id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                selectedUniversities.includes(university.id)
                  ? 'border-indigo-500 ring-4 ring-indigo-100'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => handleUniversitySelect(university.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {university.name}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{university.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">Est. {university.establishedYear}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {selectedUniversities.includes(university.id) ? (
                      <CheckSquare className="h-6 w-6 text-indigo-600" />
                    ) : (
                      <Square className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Scholarship Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-indigo-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <FileText className="h-5 w-5 text-indigo-600" />
                      <span className="text-xl font-bold text-indigo-600">
                        {university.totalScholarships}
                      </span>
                    </div>
                    <p className="text-sm text-indigo-700 mt-1">Scholarships</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      <span className="text-lg font-bold text-green-600">
                        {university.averageAmount}
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">Avg. Amount</p>
                  </div>
                </div>

                {/* Scholarship Preview */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700 text-sm">Available Scholarships:</h4>
                  {university.scholarships.slice(0, 2).map((scholarship, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-medium text-gray-800 text-sm">{scholarship.name}</h5>
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                          {scholarship.amount}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        Deadline: {scholarship.deadline}
                      </p>
                      <p className="text-xs text-gray-500">
                        {scholarship.eligibility.slice(0, 1).join(', ')}
                        {scholarship.eligibility.length > 1 && '...'}
                      </p>
                    </div>
                  ))}
                  {university.scholarships.length > 2 && (
                    <div className="text-xs text-indigo-600 text-center py-1">
                      +{university.scholarships.length - 2} more scholarships
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white p-6">
          <div className="flex items-start space-x-4">
            <Globe className="h-8 w-8 text-indigo-200 mt-1" />
            <div>
              <h3 className="text-xl font-bold mb-2">How It Works</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-1">1. Select Universities</h4>
                  <p className="text-indigo-100">Choose specific universities or select all to get comprehensive guides.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">2. Generate PDF</h4>
                  <p className="text-indigo-100">Our system compiles detailed scholarship information into professional PDFs.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">3. Download & Apply</h4>
                  <p className="text-indigo-100">Use the guides to understand requirements and application processes.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;