import React, { useState, useEffect } from 'react';
import { Star, Quote, User, MapPin } from 'lucide-react';
import { getUniversityTestimonials, UniversityTestimonial, IMAGE_BASE_URL } from '../../Api';

interface ParentTestimonialsProps {
  universityId: number;
}

const ParentTestimonials: React.FC<ParentTestimonialsProps> = ({ universityId }) => {
  const [testimonials, setTestimonials] = useState<UniversityTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUniversityTestimonials(universityId);
        setTestimonials(response.data.testimonials);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError('Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    if (universityId) {
      fetchTestimonials();
    }
  }, [universityId]);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Parents Say About Us
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from parents of our international students about their experience 
            and why they trust us with their children's medical education.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-center space-x-4 mb-6">
                <img 
                  src={`${IMAGE_BASE_URL}/${testimonial.author_image}`}
                  alt={testimonial.author_name}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author_name}</h4>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3" />
                    <span>{testimonial.author_location}</span>
                  </div>
                  <p className="text-sm text-blue-600 font-medium">{testimonial.relation}</p>
                </div>
              </div>

              <div className="mb-4">
                <Quote className="h-8 w-8 text-blue-300 mb-3" />
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{testimonial.student_name}</p>
                  <p className="text-xs text-gray-600">{testimonial.student_year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Join Our Family of Satisfied Parents</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Over 3,000 parents trust us with their children's medical education. 
            Experience the same peace of mind and excellent results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Parent Satisfaction</p>
                <p className="text-blue-200">98% Positive Feedback</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-full">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Average Rating</p>
                <p className="text-blue-200">4.9/5 Stars</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParentTestimonials;