
import { Users, GraduationCap, Globe, Award, Handshake as Target, CheckCircle, Building, Phone, Mail, MapPin, Star, TrendingUp, Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAboutUs, AboutUsInfo } from '../../Api';
import DownloadBrochurePopup from './DownloadBrochurePopup';

const AboutUs = () => {
  const [aboutData, setAboutData] = useState<AboutUsInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBrochurePopupOpen, setIsBrochurePopupOpen] = useState(false);
  const [showMoreText, setShowMoreText] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      setLoading(true);
      const response = await getAboutUs();
      setAboutData(response.data.info);
    } catch (err) {
      setError('Failed to fetch about us data');
      console.error('Error fetching about us data:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };

  // Parse JSON strings from API
  const parseJsonString = (jsonString: string) => {
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
    }
  };

  const services = aboutData ? [
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
      title: "University Listings",
      description: aboutData.university_listings
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Student Counseling",
      description: aboutData.student_counseling
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Admission Assistance",
      description: aboutData.admission_assistance
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-600" />,
      title: "International Support",
      description: aboutData.international_support
    }
  ] : [];

  const partnerBenefits = aboutData ? parseJsonString(aboutData.partner_benefits) : [];
  const whyChooseUs = aboutData ? parseJsonString(aboutData.why_choose_us) : [];

  const stats = aboutData ? [
    { number: `${aboutData.partner_universities}+`, label: "Partner Universities" },
    { number: `${aboutData.students_placed}+`, label: "Students Placed" },
    { number: `${aboutData.channel_partners}+`, label: "Channel Partners" },
    { number: `${aboutData.years_experience}+`, label: "Years Experience" }
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !aboutData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error || 'Failed to load data'}</p>
          <button 
            onClick={fetchAboutData}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-red-700 via-red-600 to-red-700 opacity-95"></div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {aboutData.hero_title}
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              {aboutData.hero_description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleNavigate('/universities')}
                className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {aboutData.button1_label || 'Explore Universities'}
              </button>
              <button
                onClick={() => handleNavigate('/our-partners')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
              >
                {aboutData.button2_label || 'Become a Partner'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission & Vision
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Target className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Mission</h3>
                    <p className="text-gray-600">
                      {aboutData.mission}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Award className="w-6 h-6 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Vision</h3>
                    <p className="text-gray-600">
                      {aboutData.vision}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                {whyChooseUs.map((item: string, index: number) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Additional Information</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn more about the education system and opportunities in Kyrgyzstan
            </p>
          </div>
          
          <div className="w-full">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {showMoreText ? (
                    <>
                      Kyrgyzstan's education system has undergone significant reforms since independence in 1991, transitioning from the Soviet model to a more modern, internationally recognized system. The country has made substantial progress in aligning its educational standards with global best practices, particularly in medical education. With over 50 universities offering MBBS programs, Kyrgyzstan has become a preferred destination for international students seeking quality medical education at affordable costs. The government has invested heavily in infrastructure, faculty development, and curriculum modernization to ensure that graduates are well-prepared for global medical practice. Additionally, the country's strategic location in Central Asia provides students with unique cultural experiences and exposure to diverse medical cases, making it an ideal choice for aspiring medical professionals worldwide.
                    </>
                  ) : (
                    <>
                      Kyrgyzstan's education system has undergone significant reforms since independence in 1991, transitioning from the Soviet model to a more modern, internationally recognized system. The country has made substantial progress in...
                    </>
                  )}
                </p>
                
                <button
                  onClick={() => setShowMoreText(!showMoreText)}
                  className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {showMoreText ? (
                    <>
                      Show Less
                      <ChevronUp className="w-4 h-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Show More
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {aboutData.service_description}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channel Partners */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-red-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Channel Partners</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              We work with trusted education consultants and agencies worldwide to reach students globally
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Partner With Us</h3>
              <p className="text-white opacity-90 mb-8 text-lg">
                {aboutData.partner_with_us}
              </p>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">Partner Benefits:</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {partnerBenefits.map((benefit: string, index: number) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Become Our Partner</h3>
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Organization Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Tell us about your organization and experience in education consulting"
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Apply for Partnership
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Why Kyrgyzstan */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{aboutData.why_study_mbbs_title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutData.why_study_mbbs_description}
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Building className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">MCI/WHO Approved</h3>
              <p className="text-gray-600">
                All universities are recognized by MCI, WHO, and other international medical councils
              </p>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Affordable Fees</h3>
              <p className="text-gray-600">
                Cost-effective medical education with fees starting from $3000 per year
              </p>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-xl">
              <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">English Medium</h3>
              <p className="text-gray-600">
                Complete MBBS program taught in English with experienced international faculty
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to start your MBBS journey? Contact us today for personalized guidance
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-800 rounded-xl">
              <Phone className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Call Us</h3>
              <p className="text-gray-300">{aboutData.contact1}</p>
              <p className="text-gray-300">{aboutData.contact2}</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-xl">
              <Mail className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Email Us</h3>
              <p className="text-gray-300">{aboutData.email1}</p>
              <p className="text-gray-300">{aboutData.email2}</p>
            </div>
            
            <div className="text-center p-6 bg-gray-800 rounded-xl">
              <MapPin className="w-8 h-8 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Visit Us</h3>
              <p className="text-gray-300">{aboutData.address}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Your Medical Journey Today
          </h2>
          <p className="text-xl text-white opacity-90 mb-8">
            Join thousands of successful doctors who started their journey with us
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link  to="/student/application-form"
            className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Apply Now
            </Link>
            <button 
              onClick={() => setIsBrochurePopupOpen(true)}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors"
            >
              Download Brochure
            </button>
          </div>
        </div>
      </section>

      {/* Download Brochure Popup */}
      <DownloadBrochurePopup 
        isOpen={isBrochurePopupOpen}
        onClose={() => setIsBrochurePopupOpen(false)}
      />
    </div>
  );
};

export default AboutUs;