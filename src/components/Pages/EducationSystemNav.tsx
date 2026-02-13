
import { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Users, Building2, Award, TrendingUp, Globe, Calendar,  Target, Clock, FileText, Languages, CheckCircle, School, CaseSensitive as University,  Code, Stethoscope, Calculator, PenTool, Layers, Home } from 'lucide-react';
import { getEducationSystem, EducationSystemInfo } from '../../Api';

function App() {
  const [educationData, setEducationData] = useState<EducationSystemInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const fetchEducationData = async () => {
      try {
        setLoading(true);
        const response = await getEducationSystem();
        setEducationData(response.data.info);
      } catch (err) {
        console.error('Error fetching education system data:', err);
        setError('Failed to load education system data');
      } finally {
        setLoading(false);
      }
    };

    fetchEducationData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading education system data...</p>
        </div>
      </div>
    );
  }

  if (error || !educationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  // Parse JSON strings
  const parseArray = (str: string): string[] => {
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  };

  // Map icons for education levels
  const levelIcons = [<Users className="w-6 h-6" />, <BookOpen className="w-6 h-6" />, <School className="w-6 h-6" />, <GraduationCap className="w-6 h-6" />];
  
  // Prepare education structure from API data
  const educationStructure = educationData.levels.map((level, index) => ({
    level: level.level,
    age: level.age_range,
    duration: `${level.duration_years} years`,
    compulsory: level.is_compulsory === 1,
    description: level.title,
    institutions: `${level.number_of_schools} schools`,
    icon: levelIcons[index % levelIcons.length],
    details: parseArray(level.description)
  }));

  // Prepare examinations from API data
  const examinations = educationData.examinations.map(exam => ({
    name: exam.exam_name,
    grade: exam.grade_level,
    subjects: parseArray(exam.subjects),
    type: exam.type
  }));

  // Prepare languages from API data
  const languages = [
    {
      language: educationData.official_state_language,
      status: "Official state language",
      usage: educationData.official_state_language_note,
      percentage: `${educationData.official_state_language_percentage}%`
    },
    {
      language: educationData.official_language,
      status: "Official language",
      usage: educationData.official_language_note,
      percentage: `${educationData.official_language_percentage}%`
    },
    {
      language: educationData.foreign_language,
      status: "Foreign language",
      usage: educationData.foreign_language_note,
      percentage: `${educationData.foreign_language_percentage}%`
    }
  ];

  // Prepare higher education types from API data
  const higherEducationTypes = [
    {
      type: "Universities",
      count: educationData.universities_count.toString(),
      description: educationData.universities_note,
      icon: <FileText className="w-8 h-8" />
    },
    {
      type: "Academies",
      count: educationData.academies_count.toString(),
      description: educationData.academies_note,
      icon: <Layers className="w-8 h-8" />
    },
    {
      type: "Institutes",
      count: educationData.institutes_count.toString(),
      description: educationData.institutes_note,
      icon: <Home className="w-8 h-8" />
    }
  ];

  // Field icons mapping
  const fieldIcons: { [key: string]: JSX.Element } = {
    'Medicine': <Stethoscope className="w-6 h-6" />,
    'Engineering': <Calculator className="w-6 h-6" />,
    'Information Technology': <Code className="w-6 h-6" />,
    'Humanities': <PenTool className="w-6 h-6" />
  };

  // Prepare popular fields from API data
  const popularFields = educationData.fields.map(field => ({
    field: field.field,
    icon: fieldIcons[field.field] || <BookOpen className="w-6 h-6" />,
    description: field.description,
    universities: field.number_of_institutions,
    duration: field.duration_years
  }));

  // Prepare degree recognition from API data
  const degreeRecognition = educationData.degrees.map(degree => ({
    level: degree.degree,
    duration: degree.duration,
    credits: degree.ects_credits,
    recognition: degree.recognition
  }));

  // Prepare statistics from API data
  const statistics = [
    { label: "Literacy Rate", value: `${educationData.literacy_rate}%`, icon: <BookOpen className="w-8 h-8" /> },
    { label: "Primary Enrollment", value: `${educationData.primary_enrollment}%`, icon: <Users className="w-8 h-8" /> },
    { label: "Secondary Completion", value: `${educationData.secondary_completion}%`, icon: <Award className="w-8 h-8" /> },
    { label: "Higher Education Institutions", value: educationData.higher_institutions_count.toString(), icon: <Building2 className="w-8 h-8" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <GraduationCap className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {educationData.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              {educationData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">{educationData.introduction_title}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {educationData.introduction_description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Government Regulation</h3>
              <p className="text-gray-600">{educationData.government_regulation}</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cultural Importance</h3>
              <p className="text-gray-600">{educationData.cultural_importance}</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Continuous Development</h3>
              <p className="text-gray-600">{educationData.continuous_development}</p>
            </div>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center border border-gray-200">
                <div className="text-red-600 mb-4 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* School Education Structure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">School Education Structure</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {educationData.school_education_structure_description}
          </p>
        </div>

        <div className="space-y-8">
          {educationStructure.map((level, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 rounded-full p-3 mr-4">
                      {level.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{level.level}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {level.age}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {level.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      level.compulsory 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {level.compulsory ? 'Compulsory' : 'Optional'}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Building2 className="w-4 h-4 mr-2" />
                    {level.institutions}
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <p className="text-gray-600 mb-6 leading-relaxed">{level.description}</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    {level.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Examinations System */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Examination System</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {educationData.examination_system_description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {examinations.map((exam, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold inline-block mb-4">
                    {exam.grade}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{exam.name}</h3>
                  <p className="text-red-600 font-semibold">{exam.type}</p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Subjects:</h4>
                  {exam.subjects.map((subject, subIndex) => (
                    <div key={subIndex} className="flex items-center">
                      <Award className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-gray-700">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Language of Instruction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <Languages className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Languages of Instruction</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {educationData.languages_instruction_description}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {languages.map((lang, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-red-600 mb-2">{lang.percentage}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{lang.language}</h3>
                <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold inline-block">
                  {lang.status}
                </div>
              </div>
              <p className="text-gray-600 text-center leading-relaxed">{lang.usage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Higher Education */}
      <div className="bg-gradient-to-br from-orange-600 via-red-600 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-6">
              <University className="w-8 h-8" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Higher Education in Kyrgyzstan</h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto">
              {educationData.higher_education_description}
            </p>
          </div>

          {/* Types of Institutions */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">Types of Higher Education Institutions</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {higherEducationTypes.map((type, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 text-center">
                  <div className="text-white mb-6 flex justify-center">
                    {type.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2">{type.count}</div>
                  <h4 className="text-xl font-bold mb-4">{type.type}</h4>
                  <p className="text-blue-100">{type.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Fields */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center mb-12">Popular Fields of Study</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularFields.map((field, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20">
                  <div className="flex items-center mb-4">
                    <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
                      {field.icon}
                    </div>
                    <h4 className="text-lg font-bold">{field.field}</h4>
                  </div>
                  <p className="text-blue-100 text-sm mb-4">{field.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-blue-200">
                      <Building2 className="w-4 h-4 mr-2" />
                      {field.universities}
                    </div>
                    <div className="flex items-center text-blue-200">
                      <Clock className="w-4 h-4 mr-2" />
                      {field.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Degree Recognition */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-12">Degree Recognition & Bologna Process</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {degreeRecognition.map((degree, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-4 py-2 rounded-full text-sm font-bold inline-block mb-4">
                      {degree.duration}
                    </div>
                    <h4 className="text-xl font-bold mb-2">{degree.level}</h4>
                    <p className="text-blue-200 text-sm">{degree.credits}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center text-green-300 mb-2">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-semibold">{degree.recognition}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20 max-w-4xl mx-auto">
                <h4 className="text-2xl font-bold mb-4">Bologna Process Alignment</h4>
                <p className="text-blue-100 leading-relaxed">
                  {educationData.bologna_process_alignment}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Section with Expandable Text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn more about the education system and opportunities in Kyrgyzstan
          </p>
        </div>
        
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <p className="text-gray-700 leading-relaxed mb-4">
              {(() => {
                const fullText = `Kyrgyzstan's education system has undergone significant reforms since independence in 1991, transitioning from the Soviet model to a more modern, internationally recognized system. The country has made substantial progress in aligning its higher education with the Bologna Process, ensuring that degrees are recognized across Europe and beyond. This alignment has opened up numerous opportunities for international students seeking quality education at affordable costs. The government has invested heavily in modernizing educational infrastructure, improving teaching standards, and expanding access to higher education. Today, Kyrgyzstan boasts a diverse range of universities, academies, and institutes offering programs in various fields including medicine, engineering, business, and humanities. The multilingual nature of education, with instruction available in Kyrgyz, Russian, and English, makes it an attractive destination for international students. Additionally, the country's strategic location in Central Asia provides students with unique cultural experiences and opportunities to learn about the region's rich history and traditions. The education system continues to evolve, with ongoing reforms aimed at improving quality, increasing international collaboration, and ensuring that graduates are well-prepared for the global job market.`;
                const words = fullText.split(' ');
                const maxWords = 30;
                const shouldTruncate = words.length > maxWords;
                
                if (shouldTruncate && !isExpanded) {
                  return words.slice(0, maxWords).join(' ') + '...';
                }
                return fullText;
              })()}
            </p>
            
            {(() => {
              const fullText = `Kyrgyzstan's education system has undergone significant reforms since independence in 1991, transitioning from the Soviet model to a more modern, internationally recognized system. The country has made substantial progress in aligning its higher education with the Bologna Process, ensuring that degrees are recognized across Europe and beyond. This alignment has opened up numerous opportunities for international students seeking quality education at affordable costs. The government has invested heavily in modernizing educational infrastructure, improving teaching standards, and expanding access to higher education. Today, Kyrgyzstan boasts a diverse range of universities, academies, and institutes offering programs in various fields including medicine, engineering, business, and humanities. The multilingual nature of education, with instruction available in Kyrgyz, Russian, and English, makes it an attractive destination for international students. Additionally, the country's strategic location in Central Asia provides students with unique cultural experiences and opportunities to learn about the region's rich history and traditions. The education system continues to evolve, with ongoing reforms aimed at improving quality, increasing international collaboration, and ensuring that graduates are well-prepared for the global job market.`;
              const words = fullText.split(' ');
              const maxWords = 30;
              const shouldTruncate = words.length > maxWords;
              
              return shouldTruncate && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200 text-left"
                >
                  {isExpanded ? "Show Less" : "Show More"}
                </button>
              );
            })()}
          </div>
        </div>
      </div>

    
    </div>
  );
}

export default App;