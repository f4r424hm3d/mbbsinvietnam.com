import { ExternalLink, Building2, Globe, FileText, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getMinistryLinks, MinistryLink } from '../../Api';

const MinistryLinks = () => {
  const [ministries, setMinistries] = useState<MinistryLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMinistryLinks = async () => {
      try {
        setLoading(true);
        const response = await getMinistryLinks();
        setMinistries(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching ministry links:', err);
        setError('Failed to load ministry links. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMinistryLinks();
  }, []);

  // Helper function to parse key_services JSON string
  const parseKeyServices = (keyServices: string): string[] => {
    try {
      return JSON.parse(keyServices);
    } catch {
      return [];
    }
  };

  const embassyInfo = {
    name: "Embassy of Kyrgyz Republic in India",
    address: "EP-34, Dr. APJ Abdul Kalam Road, New Delhi - 110011",
    phone: "+91-11-2634-2643, +91-11-2634-2644",
    email: "kyrgyzembassy.india@gmail.com",
    website: "http://www.kyrgyzembassy.in",
    consular: "consular.kyrgyzembassy@gmail.com",
    hours: "Monday to Friday: 9:00 AM - 6:00 PM"
  };

  return (
    <section className="py-8 bg-white -mt-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Official Government Links
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Direct access to official ministries and government agencies responsible 
            for education in Kyrgyzstan. Get authentic information and official support.
          </p>
        </div>

        {/* Embassy Information */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-3xl p-8 mb-8 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Embassy of Kyrgyz Republic, New Delhi</h3>
              <p className="text-red-100 mb-6">
                Your primary point of contact for all education-related queries, visa applications, 
                and official documentation for studying in Kyrgyzstan.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Building2 className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span className="text-red-100">{embassyInfo.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span className="text-red-100">{embassyInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="text-red-100">{embassyInfo.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 flex-shrink-0" />
                  <a href={embassyInfo.website} target="_blank" rel="noopener noreferrer" 
                     className="text-yellow-300 hover:text-yellow-200 transition-colors">
                    {embassyInfo.website}
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h4 className="text-xl font-semibold mb-4">Office Hours</h4>
              <p className="text-red-100 mb-4">{embassyInfo.hours}</p>
              <h4 className="text-xl font-semibold mb-4">Consular Services</h4>
              <p className="text-red-100 mb-4">{embassyInfo.consular}</p>
              <button className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors w-full">
                Contact Embassy
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-red-600 mb-4">
              <FileText className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Unable to Load Ministry Links</h3>
              <p className="text-red-700">{error}</p>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Ministry Links Grid */}
        {!loading && !error && (
          <div className="grid lg:grid-cols-2 gap-8">
            {ministries.map((ministry) => (
              <div key={ministry.id} className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{ministry.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{ministry.subtitle}</p>
                      <p className="text-gray-600">{ministry.description}</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Contact Information */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <a href={ministry.website} target="_blank" rel="noopener noreferrer" 
                           className="text-red-600 hover:text-red-700 transition-colors text-sm">
                          {ministry.website}
                        </a>
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{ministry.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{ministry.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-6 flex-grow">
                    <h4 className="font-semibold text-gray-800 mb-3">Key Services</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {parseKeyServices(ministry.key_services).map((service, serviceIndex) => (
                        <div key={serviceIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-600 text-sm">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button - Fixed at bottom */}
                  <div className="mt-auto">
                    <a href={ministry.website} target="_blank" rel="noopener noreferrer"
                       className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2">
                      <span>Visit Official Website</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Important Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-8">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-yellow-800" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-800 mb-3">Important Notice</h3>
              <p className="text-yellow-700 mb-4">
                Always verify information directly with official government sources. These links connect you 
                to authentic government websites for the most up-to-date and accurate information about 
                education policies, requirements, and procedures.
              </p>
              <ul className="space-y-2 text-yellow-700">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>All university accreditations should be verified through the Ministry of Education</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Visa and immigration matters must be handled through official embassy channels</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Medical education standards are regulated by the Ministry of Health</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        
        
      </div>
    </section>
  );
};

export default MinistryLinks;