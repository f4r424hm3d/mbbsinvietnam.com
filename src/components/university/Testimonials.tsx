
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    country: "India",
    university: "Kyrgyz State Medical Academy",
    year: "Final Year",
    rating: 5,
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    testimonial: "Studying MBBS in Kyrgyzstan has been an incredible journey. The quality of education, affordable fees, and supportive faculty have exceeded my expectations. The practical exposure in hospitals is excellent."
  },
  {
    id: 2,
    name: "Ahmed Hassan",
    country: "Bangladesh",
    university: "International School of Medicine",
    year: "3rd Year",
    rating: 5,
    image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg",
    testimonial: "The international environment and modern facilities make learning enjoyable. The university provides great support for international students, and the clinical training is world-class."
  },
  {
    id: 3,
    name: "Sarah Johnson",
    country: "Nigeria",
    university: "Asian Medical Institute",
    year: "Graduate",
    rating: 5,
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    testimonial: "I successfully completed my MBBS and now working as a resident doctor. The education quality prepared me well for international medical practice. Highly recommend Kyrgyzstan for medical studies."
  }
];

const Testimonials = () => {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our successful students who are now practicing medicine worldwide. 
            Their experiences speak for the quality of education in Kyrgyzstan.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <Quote className="h-8 w-8 text-red-600 opacity-50" />
                <div className="flex ml-auto">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.testimonial}"
              </p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.country}</p>
                  <p className="text-xs text-red-600 font-medium">
                    {testimonial.university} • {testimonial.year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
          More<span>↓</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;