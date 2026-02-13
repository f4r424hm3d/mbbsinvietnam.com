import React, { useState } from 'react';
import { FileText, CheckCircle, CreditCard, Plane, Calendar, Mail, Phone } from 'lucide-react';
import { UniversityDetails } from '../../Api';

interface ApplicationProcedureProps {
  universityData: UniversityDetails;
}

const ApplicationProcedure: React.FC<ApplicationProcedureProps> = ({ universityData }) => {
  const [showFullContent, setShowFullContent] = useState(false);

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

  // Application procedure content text
  const procedureContent = "Our streamlined admission process ensures a smooth journey from application to enrollment. Follow these simple steps to begin your medical education.";
  
  const wordCount = countWords(procedureContent);
  const shouldTruncate = wordCount > 5;
  const displayText = shouldTruncate && !showFullContent 
    ? truncateText(procedureContent, 5) 
    : procedureContent;
  const steps = [
    {
      icon: FileText,
      title: 'Submit Application',
      description: 'Complete the online application form with all required documents',
      timeframe: '1-2 days',
      color: 'blue'
    },
    {
      icon: CheckCircle,
      title: 'Document Verification',
      description: 'Our admissions team verifies your documents and academic eligibility',
      timeframe: '3-5 days',
      color: 'green'
    },
    {
      icon: CreditCard,
      title: 'Fee Payment',
      description: 'Pay the initial fee and receive official admission letter',
      timeframe: '1-2 days',
      color: 'purple'
    },
    {
      icon: Plane,
      title: 'Visa Processing',
      description: 'We assist with visa application and provide invitation letter',
      timeframe: '15-20 days',
      color: 'orange'
    },
    {
      icon: Calendar,
      title: 'Arrival & Enrollment',
      description: 'Arrive in Kyrgyzstan and complete enrollment process',
      timeframe: '2-3 days',
      color: 'pink'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600'
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Application Procedure
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

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-200 to-green-200"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col lg:space-x-8`}
              >
                <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <div className="bg-white p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-start space-x-4">
                      <div className={`p-4 rounded-full ${colorClasses[step.color as keyof typeof colorClasses]}`}>
                        <step.icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                            {step.timeframe}
                          </span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">{index + 1}</span>
                  </div>
                </div>

                <div className="w-full lg:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
          <p className="text-blue-100 mb-6">
            Our dedicated admissions team is here to help you throughout the application process
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-full border-2 border-blue-600">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Email Support</p>
                <p className="text-blue-200">admissions@kmu.edu.kg</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-full border-2 border-green-600">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Phone Support</p>
                <p className="text-blue-200">+996 312 123 456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApplicationProcedure;