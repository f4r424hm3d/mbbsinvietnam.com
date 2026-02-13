
import { 
  Mountain, 
  Globe, 
  Users, 
  MapPin, 
  Utensils, 
  Building, 
  TrendingUp, 
  GraduationCap,
  Compass,
  Sun,
  Snowflake,
  Star,
  Flag,
  Heart,

  Plane,
  Calendar,
  Clock,
  DollarSign,
  Languages,
  Stethoscope,
  Car,
  Wifi,
  Award,
  TreePine,
  Waves
} from 'lucide-react';
import { Link } from 'react-router-dom';
import banner from "../yuriy.jpg"
import oha from "../oha.jpg"
import jalal from "../Jalal-Abad.jpg"
import Bishkek from "../bishkek.jpg"
import { useEffect, useState } from 'react';
import { getAboutCountry, IMAGE_BASE_URL, AboutCountryInfo } from '../../Api';

function App() {
  const [data, setData] = useState<AboutCountryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    fetchAboutCountry();
  }, []);

  const handleNavigateWithScroll = () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  };

  const fetchAboutCountry = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAboutCountry();
      setData(response.data.info);
    } catch (err) {
      console.error("Error fetching about country:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to parse JSON strings
  const parseJsonString = (str: string | null): string[] => {
    if (!str) return [];
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // Helper function to format independence day
  const formatIndependenceDay = (date: string | null): string => {
    if (!date) return '';
    try {
      const d = new Date(date);
      const month = d.toLocaleDateString('en-US', { month: 'long' });
      const day = d.getDate();
      const year = d.getFullYear();
      return `${month} ${day}, ${year}`;
    } catch {
      return date;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Failed to load data"}</p>
          <button
            onClick={fetchAboutCountry}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Parse JSON strings
  const mountainRanges = parseJsonString(data.mountain_ranges);
  const climateZones = parseJsonString(data.climate_zones);
  const transportation = parseJsonString(data.transportation);
  const visaConnectivity = parseJsonString(data.visa_connectivity);

  // Get banner image
  const bannerImage = data.banner_image 
    ? `${IMAGE_BASE_URL}/${data.banner_image}`
    : banner;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section
        className="relative text-white py-20"
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-red-600 opacity-80"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Mountain className="h-16 w-16 text-orange-200" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-200 to-white bg-clip-text text-transparent">
              {data.name}
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto">
              {data.tagline}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {mountainRanges.length > 0 && (
                <span className="bg-red-800/50 px-4 py-2 rounded-full">🏔️ {mountainRanges[0]}</span>
              )}
              {data.who_recognized === 1 && (
                <span className="bg-rose-800/50 px-4 py-2 rounded-full">🎓 WHO Recognized Universities</span>
              )}
              <span className="bg-orange-800/50 px-4 py-2 rounded-full">🌍 Silk Road Heritage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Essential Facts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Essential Information</h2>
            <p className="text-lg text-gray-600">Key facts about the Kyrgyz Republic</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.capital && (
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl hover:shadow-lg transition-shadow">
                <Building className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Capital</h3>
                <p className="text-gray-600">{data.capital}</p>
              </div>
            )}
            
            {data.population && (
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl hover:shadow-lg transition-shadow">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Population</h3>
                <p className="text-gray-600">{data.population}</p>
              </div>
            )}
            
            {data.languages && (
              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl hover:shadow-lg transition-shadow">
                <Languages className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Languages</h3>
                <p className="text-gray-600">{data.languages}</p>
              </div>
            )}
            
            {data.currency && (
              <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl hover:shadow-lg transition-shadow">
                <DollarSign className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Currency</h3>
                <p className="text-gray-600">{data.currency}</p>
              </div>
            )}
            
            {data.location && (
              <div className="text-center p-6 bg-gradient-to-br from-red-50 to-pink-100 rounded-xl hover:shadow-lg transition-shadow">
                <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Location</h3>
                <p className="text-gray-600">{data.location}</p>
              </div>
            )}
            
            {data.timezone && (
              <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-cyan-100 rounded-xl hover:shadow-lg transition-shadow">
                <Clock className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Timezone</h3>
                <p className="text-gray-600">{data.timezone}</p>
              </div>
            )}
            
            {data.independence_day && (
              <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-xl hover:shadow-lg transition-shadow">
                <Flag className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Independence</h3>
                <p className="text-gray-600">{formatIndependenceDay(data.independence_day)}</p>
              </div>
            )}
            
            {data.highest_peak && (
              <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl hover:shadow-lg transition-shadow">
                <Mountain className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-800">Highest Peak</h3>
                <p className="text-gray-600">{data.highest_peak} {data.highest_peak_height && `(${data.highest_peak_height})`}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Geography & Climate */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Mountain className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Geography & Climate</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The "Land of Celestial Mountains" with breathtaking landscapes and diverse climate zones
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Mountain Ranges & Features</h3>
              <div className="space-y-4">
                {mountainRanges.map((item, index) => {
                  const icons = [Mountain, Waves, TreePine, Globe];
                  const colors = ['text-blue-600', 'text-blue-400', 'text-green-600', 'text-purple-600'];
                  const IconComponent = icons[index % icons.length];
                  const colorClass = colors[index % colors.length];
                  return (
                    <div key={index} className="flex items-center">
                      <IconComponent className={`h-6 w-6 ${colorClass} mr-3`} />
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Climate Zones</h3>
              <div className="space-y-4">
                {climateZones.map((item, index) => {
                  const icons = [Sun, Snowflake, Mountain, Calendar];
                  const colors = ['text-yellow-500', 'text-blue-500', 'text-green-500', 'text-orange-500'];
                  const IconComponent = icons[index % icons.length];
                  const colorClass = colors[index % colors.length];
                  return (
                    <div key={index} className="flex items-center">
                      <IconComponent className={`h-6 w-6 ${colorClass} mr-3`} />
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Attractions */}
          {data.attractions && data.attractions.length > 0 && (
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Top Tourist Attractions</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.attractions.slice(0, 4).map((attraction, index) => {
                  const icons = [Waves, TreePine, Mountain, Compass];
                  const colors = ['text-blue-200', 'text-green-200', 'text-purple-200', 'text-yellow-200'];
                  const IconComponent = icons[index % icons.length];
                  const colorClass = colors[index % colors.length];
                  return (
                    <div key={attraction.id} className="text-center">
                      <IconComponent className={`h-8 w-8 mx-auto mb-2 ${colorClass}`} />
                      <h4 className="font-semibold">{attraction.attraction_name}</h4>
                      <p className="text-sm text-indigo-100">{attraction.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* History & Culture */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Compass className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Rich History & Culture</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From ancient Silk Road heritage to vibrant nomadic traditions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
              {data.ancient_silk_road && (
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">🏛️ Ancient Silk Road</h3>
                  <p className="text-gray-600">{data.ancient_silk_road}</p>
                </div>
              )}
              {data.nomadic_heritage && (
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">🏇 Nomadic Heritage</h3>
                  <p className="text-gray-600">{data.nomadic_heritage}</p>
                </div>
              )}
              {data.religion_diversity && (
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">🕌 Religion & Diversity</h3>
                  <p className="text-gray-600">{data.religion_diversity}</p>
                </div>
              )}
            </div>
            {data.cultural_highlights && (
              <div className="bg-gradient-to-br from-red-600 to-orange-700 p-8 rounded-2xl text-white">
                <Star className="h-16 w-16 mb-6 text-purple-200" />
                <h3 className="text-2xl font-bold mb-4">Cultural Highlights</h3>
                <div className="space-y-3 text-purple-100" dangerouslySetInnerHTML={{ __html: data.cultural_highlights }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Additional Information</h2>
            <p className="text-lg text-gray-600">
              Learn more about the education system and opportunities in Kyrgyzstan
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            {(() => {
              const fullText = `Kyrgyzstan's education system has undergone significant reforms since independence in 1991, transitioning from the Soviet model to a more modern, internationally recognized system. The country has made substantial progress in aligning its higher education with the Bologna Process, ensuring that degrees are recognized across Europe and beyond. This alignment has opened up numerous opportunities for international students seeking quality education at affordable costs. The government has invested heavily in modernizing educational infrastructure, improving teaching standards, and expanding access`;
              const words = fullText.split(' ');
              const maxWords = 30;
              const shouldTruncate = words.length > maxWords;
              
              return (
                <>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {shouldTruncate && !isExpanded
                      ? words.slice(0, maxWords).join(' ') + '...'
                      : fullText}
                  </p>
                  
                  {shouldTruncate && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                    >
                      {isExpanded ? "Show Less" : "Show More"}
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* MBBS & Education - High Priority Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <GraduationCap className="h-16 w-16 text-green-200 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">MBBS Education Hub</h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Growing destination for international medical students with WHO & NMC recognized universities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {data.who_recognized === 1 && (
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl hover:bg-white/20 transition-all">
                <Stethoscope className="h-12 w-12 text-green-200 mb-4" />
                <h3 className="text-xl font-bold mb-4">WHO Recognized</h3>
                <p className="text-green-100">Medical universities recognized by WHO and NMC for international practice</p>
              </div>
            )}
            
            {data.mbbs_affordable_education && (
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl hover:bg-white/20 transition-all">
                <DollarSign className="h-12 w-12 text-blue-200 mb-4" />
                <h3 className="text-xl font-bold mb-4">Affordable Education</h3>
                <p className="text-blue-100">{data.mbbs_affordable_education}</p>
              </div>
            )}
            
            {data.english_medium === 1 && (
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl hover:bg-white/20 transition-all">
                <Languages className="h-12 w-12 text-purple-200 mb-4" />
                <h3 className="text-xl font-bold mb-4">English Medium</h3>
                <p className="text-purple-100">MBBS programs taught in English for international students</p>
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-6 text-center">Why Choose Kyrgyzstan for MBBS?</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {data.academic_excellence && (
                <div>
                  <h4 className="text-lg font-semibold mb-4">Academic Excellence</h4>
                  <div className="text-green-100" dangerouslySetInnerHTML={{ __html: data.academic_excellence }} />
                </div>
              )}
              {data.student_life && (
                <div>
                  <h4 className="text-lg font-semibold mb-4">Student Life</h4>
                  <div className="text-blue-100" dangerouslySetInnerHTML={{ __html: data.student_life }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Economy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <TrendingUp className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Growing Economy</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Diverse economy with strong potential in mining, agriculture, hydropower, and tourism
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
            <div className="space-y-6">
              {data.key_sectors && (
                <div className="bg-gradient-to-br from-yellow-50 to-amber-100 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">🏆 Key Sectors</h3>
                  <p className="text-gray-600">{data.key_sectors}</p>
                </div>
              )}
              {data.major_exports && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">📈 Major Exports</h3>
                  <p className="text-gray-600">{data.major_exports}</p>
                </div>
              )}
              {data.investment_opportunities && (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">🌍 Investment Opportunities</h3>
                  <p className="text-gray-600">{data.investment_opportunities}</p>
                </div>
              )}
            </div>
            {(data.gdp_growth || data.main_industries || data.tourism_growth || data.hydropower_potential) && (
              <div className="bg-gradient-to-br from-green-600 to-blue-700 p-8 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-6">Economic Indicators</h3>
                <div className="space-y-4">
                  {data.gdp_growth && (
                    <div className="flex justify-between items-center">
                      <span>GDP Growth</span>
                      <span className="font-semibold">{data.gdp_growth}</span>
                    </div>
                  )}
                  {data.main_industries && (
                    <div className="flex justify-between items-center">
                      <span>Main Industries</span>
                      <span className="font-semibold">{data.main_industries}</span>
                    </div>
                  )}
                  {data.tourism_growth && (
                    <div className="flex justify-between items-center">
                      <span>Tourism Growth</span>
                      <span className="font-semibold">{data.tourism_growth}</span>
                    </div>
                  )}
                  {data.hydropower_potential && (
                    <div className="flex justify-between items-center">
                      <span>Hydropower Potential</span>
                      <span className="font-semibold">{data.hydropower_potential}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Food & Lifestyle */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Utensils className="h-16 w-16 text-orange-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Cuisine & Lifestyle</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Rich culinary traditions blending nomadic, Central Asian, and Russian influences
            </p>
          </div>

          {data.cuisines && data.cuisines.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {data.cuisines.map((cuisine) => (
                <div key={cuisine.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">🍖 {cuisine.dish_name}</h3>
                  <p className="text-gray-600 text-sm">{cuisine.dish_description}</p>
                </div>
              ))}
            </div>
          )}

          {data.cultures && data.cultures.length > 0 && (
            <div className="bg-gradient-to-r from-orange-600 to-red-700 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">Lifestyle & Culture</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {data.cultures.map((culture, index) => {
                  const icons = [Heart, Building, Users];
                  const colors = ['text-orange-200', 'text-red-200', 'text-yellow-200'];
                  const IconComponent = icons[index % icons.length];
                  const colorClass = colors[index % colors.length];
                  return (
                    <div key={culture.id} className="text-center">
                      <IconComponent className={`h-8 w-8 mx-auto mb-2 ${colorClass}`} />
                      <h4 className="font-semibold">{culture.title}</h4>
                      <p className="text-sm text-orange-100">{culture.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Major Cities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Building className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Major Cities</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Urban centers offering modern amenities and educational opportunities
            </p>
          </div>

          {data.major_cities && data.major_cities.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.major_cities.map((city, index) => {
                const gradients = [
                  'from-blue-600 to-purple-700',
                  'from-green-600 to-emerald-700',
                  'from-orange-600 to-red-700'
                ];
                const textColors = [
                  { main: 'text-blue-100', sub: 'text-blue-200' },
                  { main: 'text-green-100', sub: 'text-green-200' },
                  { main: 'text-orange-100', sub: 'text-orange-200' }
                ];
                const gradient = gradients[index % gradients.length];
                const colors = textColors[index % textColors.length];
                const cityImage = city.city_image 
                  ? `${IMAGE_BASE_URL}/${city.city_image}`
                  : index === 0 ? Bishkek : index === 1 ? oha : jalal;
                
                return (
                  <div key={city.id} className={`bg-gradient-to-br ${gradient} text-white p-8 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold mb-3">{city.city_name}</h3>
                      <img src={cityImage} alt={city.city_name} className="w-12 h-12 rounded-full object-cover" />
                    </div>
                    <p className={`${colors.main} mb-4`}>{city.description}</p>
                    <div className="space-y-2 text-sm">
                      {city.population && (
                        <div className={`flex items-center ${colors.sub}`}>
                          <Users className="h-4 w-4 mr-2" />
                          <span>{city.population}</span>
                        </div>
                      )}
                      {city.highlights && (
                        <div className={`flex items-center ${colors.sub}`}>
                          <Star className="h-4 w-4 mr-2" />
                          <span>{city.highlights}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Travel & Transport */}
      <section className="py-16 bg-gradient-to-r from-slate-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Plane className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Travel & Connectivity</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Easy access and excellent connectivity for international students
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Transportation</h3>
              <div className="space-y-4">
                {transportation.map((item, index) => {
                  const icons = [Plane, Plane, Car, Globe];
                  const colors = ['text-blue-600', 'text-green-600', 'text-orange-600', 'text-purple-600'];
                  const IconComponent = icons[index % icons.length];
                  const colorClass = colors[index % colors.length];
                  return (
                    <div key={index} className="flex items-center">
                      <IconComponent className={`h-6 w-6 ${colorClass} mr-3`} />
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Visa & Connectivity</h3>
              <div className="space-y-4">
                {visaConnectivity.map((item, index) => {
                  const icons = [Award, Wifi, Calendar, Heart];
                  const colors = ['text-green-600', 'text-blue-600', 'text-orange-600', 'text-red-600'];
                  const IconComponent = icons[index % icons.length];
                  const colorClass = colors[index % colors.length];
                  return (
                    <div key={index} className="flex items-center">
                      <IconComponent className={`h-6 w-6 ${colorClass} mr-3`} />
                      <span>{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Stethoscope className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Healthcare System</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Affordable healthcare facilities for locals and international students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {data.public_healthcare && (
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Public Healthcare</h3>
                <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: data.public_healthcare }} />
              </div>
            )}
            
            {data.private_healthcare && (
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Private Healthcare</h3>
                <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: data.private_healthcare }} />
              </div>
            )}
            
            {data.student_healthcare && (
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Student Healthcare</h3>
                <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: data.student_healthcare }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Star className="h-16 w-16 text-indigo-200 mx-auto mb-4" />
            <h2 className="text-4xl font-bold mb-4">Quick Facts</h2>
            <p className="text-xl text-indigo-100">Interesting facts about Kyrgyzstan</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.independence_day && (
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
                <Calendar className="h-8 w-8 mx-auto mb-3 text-indigo-200" />
                <h3 className="font-bold">Independence Day</h3>
                <p className="text-indigo-100">{formatIndependenceDay(data.independence_day)}</p>
              </div>
            )}
            
            {data.national_sport && (
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-purple-200" />
                <h3 className="font-bold">National Sport</h3>
                <p className="text-purple-100">{data.national_sport}</p>
              </div>
            )}
            
            {data.highest_peak && (
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
                <Mountain className="h-8 w-8 mx-auto mb-3 text-blue-200" />
                <h3 className="font-bold">Highest Peak</h3>
                <p className="text-blue-100">{data.highest_peak} {data.highest_peak_height && `(${data.highest_peak_height})`}</p>
              </div>
            )}
            
            {data.unesco_sites && (
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center">
                <Award className="h-8 w-8 mx-auto mb-3 text-green-200" />
                <h3 className="font-bold">UNESCO Sites</h3>
                <p className="text-green-100">{data.unesco_sites}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Start Your MBBS Journey in Kyrgyzstan</h2>
          <p className="text-xl text-blue-100 mb-8">
            Discover world-class medical education in the heart of Central Asia's most beautiful country
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/universities"
              onClick={handleNavigateWithScroll}
              className="bg-white text-indigo-700 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors"
            >
              Explore MBBS Programs
            </Link>
            <Link to="/contact-us"
            className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-700 transition-colors">
              Contact Universities
            </Link>
          </div>
        </div>
      </section>

    
    </div>
  );
}

export default App;