import { Microscope, BookOpen, Home, Utensils, Wifi, Car } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUniversityFacilities, UniversityFacility, IMAGE_BASE_URL } from '../../Api';

interface FacilitiesProps {
  universityId: number;
}

const Facilities: React.FC<FacilitiesProps> = ({ universityId }) => {
  const [facilities, setFacilities] = useState<UniversityFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Facilities content text
  const facilitiesContent = "Our campus is equipped with modern facilities designed to provide the best learning environment for medical students from around the world.";
  
  const wordCount = countWords(facilitiesContent);
  const shouldTruncate = wordCount > 5;
  const displayText = shouldTruncate && !showFullContent 
    ? truncateText(facilitiesContent, 5) 
    : facilitiesContent;

  // Default icon mapping for facilities
  const getIconForFacility = (facilityId: number) => {
    const iconMap: { [key: number]: any } = {
      1: Microscope,
      2: BookOpen,
      3: Home,
      4: Utensils,
      5: Wifi,
      6: Car,
    };
    return iconMap[facilityId] || Microscope;
  };

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!universityId) {
          setError('No university specified');
          return;
        }
        
        // Fetch facilities for the university
        const response = await getUniversityFacilities(universityId);
        console.log('Facilities response:', response);
        setFacilities(response.data.facilities);
      } catch (err) {
        console.error('Error fetching facilities:', err);
        setError('Failed to load facilities. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (universityId) {
      fetchFacilities();
    }
  }, [universityId]);

  if (loading) {
    return (
      <section id="facilities" className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              World-Class Facilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our campus is equipped with modern facilities designed to provide the best learning 
              environment for medical students from around the world.
            </p>
          </div>
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading facilities...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="facilities" className="py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              World-Class Facilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our campus is equipped with modern facilities designed to provide the best learning 
              environment for medical students from around the world.
            </p>
          </div>
          <div className="text-center py-10">
            <div className="text-red-600 text-lg mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="facilities" className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            World-Class Facilities
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

        {facilities.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No facilities information available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility) => {
              const IconComponent = getIconForFacility(facility.facility_id);
              const imageUrl = facility.thumbnail_path 
                ? `${IMAGE_BASE_URL}/${facility.thumbnail_path}` 
                : 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg';
              
              return (
                <div 
                  key={facility.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={imageUrl}
                      alt={facility.facility?.name || `Facility ${facility.facility_id}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {facility.facility?.name || `Facility ${facility.facility_id}`}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{facility.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Facilities;