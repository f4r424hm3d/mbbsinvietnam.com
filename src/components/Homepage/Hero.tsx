
import { ArrowRight, Users, GraduationCap, Globe, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
 import DownloadFormPopup from '../university/DownloadFormPopup';
import { useState } from 'react';

const Hero = () => {
   const [isPopupOpen, setIsPopupOpen] = useState(false);
  return (
    <section id="home" className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-red-200">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">Official Partner of Embassy of Kyrgyz Republic</span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Study in
                <span className="block text-yellow-300">Kyrgyzstan</span>
              </h1>
              <p className="text-xl text-red-100 leading-relaxed">
                Discover world-class education opportunities in the heart of Central Asia. 
                Quality medical and technical education at affordable costs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center space-x-2">
                <Link to="/universities">
                  <span>
                  Explore Universities

                </span>
                </Link>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button   onClick={() => setIsPopupOpen(true)}

                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors">
                Download Brochure
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-red-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">25+</div>
                <div className="text-red-200 text-sm">Universities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">10K+</div>
                <div className="text-red-200 text-sm">Indian Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">95%</div>
                <div className="text-red-200 text-sm">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
              <h3 className="text-2xl font-bold mb-6">Why Choose Kyrgyzstan?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">WHO Recognized Universities</h4>
                    <p className="text-red-100 text-sm">All universities are recognized by WHO, MCI, and other international bodies.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">English Medium</h4>
                    <p className="text-red-100 text-sm">Complete education in English with experienced international faculty.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Affordable Fees</h4>
                    <p className="text-red-100 text-sm">Quality education at fraction of the cost compared to other countries.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full opacity-20 animate-pulse delay-1000"></div>
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

export default Hero;