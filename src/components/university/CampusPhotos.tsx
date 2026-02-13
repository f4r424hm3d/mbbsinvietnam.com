import { useState, useEffect } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUniversityPhotos, UniversityPhoto, IMAGE_BASE_URL } from '../../Api';

interface CampusPhotosProps {
  universityId: number;
}

const CampusPhotos: React.FC<CampusPhotosProps> = ({ universityId }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [photos, setPhotos] = useState<UniversityPhoto[]>([]);
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

  // Campus gallery content text
  const galleryContent = "Take a virtual tour of our modern campus facilities and see where you'll be studying for the next six years of your medical education.";
  
  const wordCount = countWords(galleryContent);
  const shouldTruncate = wordCount > 5;
  const displayText = shouldTruncate && !showFullContent 
    ? truncateText(galleryContent, 5) 
    : galleryContent;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!universityId) {
          setError('No university specified');
          return;
        }
        
        // Fetch photos for the university
        const response = await getUniversityPhotos(universityId);
        console.log('Photos response:', response);
        setPhotos(response.data.photos);
      } catch (err) {
        console.error('Error fetching photos:', err);
        setError('Failed to load campus photos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (universityId) {
      fetchPhotos();
    }
  }, [universityId]);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % photos.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? photos.length - 1 : selectedImage - 1);
    }
  };

  if (loading) {
    return (
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Campus Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take a virtual tour of our modern campus facilities and see where you'll be 
              studying for the next six years of your medical education.
            </p>
          </div>
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg text-gray-600">Loading campus photos...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Campus Gallery
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take a virtual tour of our modern campus facilities and see where you'll be 
              studying for the next six years of your medical education.
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
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Campus Gallery
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

        {photos.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 text-lg">No campus photos available at the moment.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => {
              const imageUrl = photo.photo_path 
                ? `${IMAGE_BASE_URL}/${photo.photo_path}` 
                : 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg';
              
              return (
                <div 
                  key={photo.id}
                  className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={imageUrl}
                    alt={photo.alt_text}
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-lg font-semibold mb-2">{photo.alt_text}</h3>
                      <p className="text-sm text-gray-200">Campus Photo</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                        <Camera className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Campus Statistics */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-8 text-center">Campus at a Glance</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <h4 className="text-3xl font-bold mb-2">50+</h4>
              <p className="text-blue-100">Acres Campus</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-bold mb-2">25+</h4>
              <p className="text-blue-100">Modern Labs</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-bold mb-2">15+</h4>
              <p className="text-blue-100">Lecture Halls</p>
            </div>
            <div className="text-center">
              <h4 className="text-3xl font-bold mb-2">8</h4>
              <p className="text-blue-100">Hostel Buildings</p>
            </div>
          </div>
        </div>

        {/* Lightbox Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors z-10"
              >
                <X className="h-6 w-6" />
              </button>
              
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full text-white hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              <img 
                src={photos[selectedImage].photo_path 
                  ? `${IMAGE_BASE_URL}/${photos[selectedImage].photo_path}` 
                  : 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg'}
                alt={photos[selectedImage].alt_text}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg';
                }}
              />
              
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white rounded-b-lg">
                <h3 className="text-xl font-semibold mb-2">{photos[selectedImage].alt_text}</h3>
                <p className="text-gray-200">Campus Photo</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CampusPhotos;