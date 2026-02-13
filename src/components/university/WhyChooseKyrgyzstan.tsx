
import { DollarSign, Globe, Award, Clock, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
 import DownloadFormPopup from '../university/DownloadFormPopup';
import { useState } from 'react';
// import BrochureGenerator from './BrochureGenerator';

// Sample universities data for brochure
const sampleUniversities = [
  {
    id: 1,
    name: "Kyrgyz State Medical Academy",
    location: "Bishkek, Kyrgyzstan",
    establishedYear: 1939,
    tuitionFee: "$3,500/year",
    duration: "6 years",
    rating: 4.5,
    studentsCount: "8,000+",
    image: "https://images.pexels.com/photos/5427660/pexels-photo-5427660.jpeg",
    features: ["WHO Recognized", "English Medium", "Clinical Training", "Modern Labs"]
  },
  {
    id: 2,
    name: "International School of Medicine",
    location: "Bishkek, Kyrgyzstan",
    establishedYear: 2003,
    tuitionFee: "$4,200/year",
    duration: "6 years",
    rating: 4.7,
    studentsCount: "3,500+",
    image: "https://images.pexels.com/photos/8460137/pexels-photo-8460137.jpeg",
    features: ["International Faculty", "Research Opportunities", "Modern Campus", "Scholarships"]
  }
];
const benefits = [
  {
    icon: DollarSign,
    title: "Affordable Education",
    description: "Low tuition fees starting from $2,800/year with minimal living costs, making it accessible for all families."
  },
  {
    icon: Globe,
    title: "International Recognition",
    description: "Universities recognized by WHO, UNESCO, MCI, and other global medical councils for worldwide practice."
  },
  {
    icon: Award,
    title: "Quality Education",
    description: "World-class curriculum with experienced faculty and modern teaching methodologies."
  },
  {
    icon: Clock,
    title: "Quick Admission",
    description: "Fast-track admission process with minimal documentation and no entrance exams for most universities."
  },
  {
    icon: Heart,
    title: "Safe Environment",
    description: "Peaceful country with friendly locals, low crime rates, and excellent support for international students."
  },
  {
    icon: Shield,
    title: "No Donation/Capitation",
    description: "Transparent admission process with no hidden fees, donations, or capitation requirements."
  }
];

const WhyChooseKyrgyzstan = () => {
   const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Kyrgyzstan for MBBS?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Discover the compelling reasons why thousands of international students choose Kyrgyzstan 
            for their medical education. Experience world-class education at affordable costs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">{benefit.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Medical Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of successful students who chose Kyrgyzstan for their MBBS education. 
              Get personalized guidance from our expert counselors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
              to="/student/application-form"
              className="bg-gradient-to-r from-red-600 to-red-600 text-white px-8 py-4 rounded-lg hover:from-red-700 hover:to-red-700 transition-all duration-300 font-medium text-lg shadow-lg">
                Apply Now
              </Link>
               <button onClick={() => setIsPopupOpen(true)}

               className="bg-gradient-to-r from-red-600 to-red-600 text-white px-8 py-4 rounded-lg hover:from-red-700 hover:to-red-700 transition-all duration-300 font-medium text-lg shadow-lg">
                Download Brochure
              </button>
              {/* <BrochureGenerator universities={sampleUniversities} /> */}
            </div>
          </div>
        </div>
      </div>
      <DownloadFormPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        universityName="Kyrgyzstan Universities" 
      />
    </section>
  );
};

export default WhyChooseKyrgyzstan;