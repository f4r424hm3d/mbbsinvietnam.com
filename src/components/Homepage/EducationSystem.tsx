import { BookOpen, Users, Award, Globe, CheckCircle} from 'lucide-react';
import { useEffect } from 'react';
const EducationSystem = () => {
  const systemFeatures = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "International Standards",
      description: "Education system follows international standards with WHO, UNESCO recognition"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "English Medium",
      description: "All programs taught in English with experienced international faculty"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Small Class Sizes",
      description: "Low student-to-teacher ratio ensuring personalized attention"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Practical Learning",
      description: "Emphasis on hands-on experience and clinical practice"
    }
  ];

 useEffect(() => {
 
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);
  
  return (
    <section id="education-system" className="py-20 bg-gray-50 -mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 -mt-10">
            Education System in Kyrgyzstan
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understand the comprehensive education system that has produced thousands 
            of successful medical professionals and engineers worldwide.
          </p>
        </div>

        {/* System Overview */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                World-Class Education Standards
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Kyrgyzstan's higher education system is built on strong academic foundations 
                with international recognition. The country has been a preferred destination 
                for medical education for over two decades.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Universities follow the European Credit Transfer System (ECTS) making it 
                easier for students to transfer credits and pursue further studies globally.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h4 className="text-xl font-bold text-gray-800 mb-4">Key Highlights</h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Bologna Process compliant education system</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">ECTS credit system for international mobility</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Quality assurance and regular accreditation</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Modern teaching methodologies and technology</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Students in classroom"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-8 -left-8 bg-red-600 text-white p-6 rounded-2xl shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">25+</div>
                <div className="text-red-100">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Features */}
        <div className="mb-10">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Choose Kyrgyzstan's Education System?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {systemFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Structure */}
         
      </div>
    </section>
  );
};

export default EducationSystem;