import React, { useState } from 'react';
import { BookOpen, Globe, Users, Award } from 'lucide-react';
import { UniversityDetails } from '../../Api';
import { IMAGE_BASE_URL } from '../../Api';

interface AboutUniversityProps {
  universityData: UniversityDetails;
}

const AboutUniversity: React.FC<AboutUniversityProps> = ({ universityData }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  
  const stats = [
    { icon: BookOpen, label: 'Years of Excellence', value: universityData.year_of_excellence || 'Not Available' },
    { icon: Globe, label: 'Countries Represented', value: universityData.countries_represented || 'Not Available' },
    { icon: Users, label: 'Total Students', value: universityData.students ? `${universityData.students}+` : 'Not Available' },
    { icon: Award, label: 'Global Ranking', value: universityData.global_ranking || 'Not Available' },
  ];

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

  // About content text
  const aboutContent = universityData.about_note || (universityData.established_year ? `Established in ${universityData.established_year}, we are one of the leading medical universities in Central Asia, committed to providing world-class medical education and producing skilled healthcare professionals.` : 'Not Available');
  
  const wordCount = countWords(aboutContent);
  const shouldTruncate = wordCount > 5;
  const displayText = shouldTruncate && !showFullContent 
    ? truncateText(aboutContent, 5) 
    : aboutContent;

  return (
    <section id="about" className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About {universityData.name}
          </h2>
          <div className="text-xl text-gray-600 max-w-3xl mx-auto">
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

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Why Choose Us Section - Sticky positioned */}
          <div className="md:sticky md:top-8 md:self-start">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Why Choose Us?</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">International Recognition</h4>
                  <p className="text-gray-600">
                    {universityData.international_recognition || 'Not Available'}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">English Medium</h4>
                  <p className="text-gray-600">
                    {universityData.english_medium || (universityData.medium_of_instruction ? `Complete MBBS program taught in ${universityData.medium_of_instruction} with experienced international faculty.` : 'Not Available')}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Diverse Community</h4>
                  <p className="text-gray-600">
                    {universityData.diverse_community || (universityData.countries_represented ? `Students from ${universityData.countries_represented} countries create a truly international learning environment.` : 'Not Available')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Content - Can vary in height */}
          <div className="bg-gradient-to-br from-blue-50 to-green-50 p-8 rounded-2xl">
            {universityData.thumbnail_path && (
              <img 
                src={`${IMAGE_BASE_URL}/${universityData.thumbnail_path}`}
                alt={`${universityData.name} campus`}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            <h4 className="text-xl font-semibold text-gray-900 mb-4">Modern Campus & Facilities</h4>
            <p className="text-gray-600">
              {universityData.section2_text || 'Not Available'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-gradient-to-br from-blue-600 to-green-600 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                <stat.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUniversity;