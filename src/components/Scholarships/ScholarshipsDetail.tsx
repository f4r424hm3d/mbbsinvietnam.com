import React, { useEffect, useState } from 'react';
import { Star, GraduationCap, Award, BookOpen, CheckCircle, FileText, Download, Calendar, AlertCircle, ArrowLeft, MapPin, Users, DollarSign, Mail, Phone } from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getUniversityScholarships, UniversityScholarship, getNonUniversityScholarships, NonUniversityScholarship, getScholarshipFaqs, ScholarshipFAQ } from '../../Api';
import DownloadFormPopup from '../university/DownloadFormPopup';
import ScholarshipApplicationPopup from './ScholarshipApplicationPopup';

// Union type for scholarship data
type ScholarshipData = UniversityScholarship | (NonUniversityScholarship & { university_id?: number });

const KyrgyzstanScholarshipPage: React.FC = () => {
  const { universityId, scholarshipId, slug } = useParams<{ universityId?: string; scholarshipId?: string; slug?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [scholarship, setScholarship] = useState<ScholarshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isApplicationPopupOpen, setIsApplicationPopupOpen] = useState(false);
  const [faqs, setFaqs] = useState<ScholarshipFAQ[]>([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [faqError, setFaqError] = useState<string | null>(null);
  const [faqFetched, setFaqFetched] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // Auto-open application popup if ?apply=true is in URL
  useEffect(() => {
    const shouldApply = searchParams.get('apply') === 'true';
    if (shouldApply && scholarship && !loading) {
      setIsApplicationPopupOpen(true);
      // Remove the query parameter from URL without page reload
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('apply');
      const newSearch = newSearchParams.toString();
      navigate(`${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
    }
  }, [scholarship, loading, searchParams, navigate]);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        setLoading(true);
        setError(null);

        // Handle slug-based routing (non-university scholarships)
        if (slug) {
          const response = await getNonUniversityScholarships();
          const foundScholarship = response.data.scholarships.find((s: NonUniversityScholarship) => s.slug === slug);
          
          if (foundScholarship) {
            setScholarship(foundScholarship);
          } else {
            setError("Scholarship not found");
          }
        }
        // Handle university-based routing
        else if (universityId && scholarshipId) {
          const response = await getUniversityScholarships(parseInt(universityId));
          const foundScholarship = response.data.scholarships.find((s: UniversityScholarship) => s.id.toString() === scholarshipId);
          
          if (foundScholarship) {
            setScholarship(foundScholarship);
          } else {
            setError("Scholarship not found");
          }
        } else {
          setError("Missing scholarship information");
        }
      } catch (err) {
        console.error("Error fetching scholarship:", err);
        setError("Failed to load scholarship details");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [universityId, scholarshipId, slug]);

  useEffect(() => {
    setFaqs([]);
    setFaqError(null);
    setFaqFetched(false);
  }, [scholarship?.id]);

  useEffect(() => {
    const fetchFaqs = async () => {
      if (!scholarship) return;
      try {
        setFaqLoading(true);
        setFaqError(null);
        const response = await getScholarshipFaqs(scholarship.id);
        const fetchedFaqs = response?.data?.faqs ?? [];
        setFaqs(fetchedFaqs);
      } catch (err) {
        console.error("Error fetching scholarship FAQs:", err);
        setFaqError("Failed to load FAQs. Please try again later.");
      } finally {
        setFaqLoading(false);
        setFaqFetched(true);
      }
    };

    if (activeTab === 'faq' && scholarship && !faqFetched) {
      fetchFaqs();
    }
  }, [activeTab, scholarship, faqFetched]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading scholarship details...</p>
        </div>
      </div>
    );
  }

  if (error || !scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Scholarship</h2>
          <p className="text-gray-600 mb-4">{error || "Scholarship not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatAmount = (min: string, max: string) => {
    const minNum = parseFloat(min);
    const maxNum = parseFloat(max);
    if (minNum === maxNum) {
      return `$${minNum.toLocaleString()}`;
    }
    return `$${minNum.toLocaleString()} - $${maxNum.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-red-600">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-red-600"></div>
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {slug ? 'Back to Scholarships' : 'Back to University'}
            </button>
          </div>
          
          <div className="text-center text-white">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-full p-4">
                <GraduationCap className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {scholarship.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {scholarship.program} {slug ? 'Scholarship Program' : 'Program at University in Kyrgyzstan'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setIsApplicationPopupOpen(true)}
                className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-red-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Apply Now
              </button>
              <button 
                onClick={() => setIsPopupOpen(true)}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all duration-300"
              >
                Download Brochure
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce">
          <Star className="w-8 h-8 text-yellow-300 opacity-70" />
        </div>
        <div className="absolute bottom-20 right-10 animate-pulse">
          <Award className="w-10 h-10 text-white opacity-50" />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Scholarship Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm text-gray-600">Amount</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatAmount(scholarship.amount_min, scholarship.amount_max)}</p>
            {scholarship.discount_percentage && (
              <p className="text-sm text-green-600">{scholarship.discount_percentage}% off tuition</p>
            )}
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-sm text-gray-600">Deadline</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{formatDate(scholarship.deadline)}</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-sm text-gray-600">Available Seats</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{scholarship.available_seats} seats</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-sm text-gray-600">Program</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{scholarship.program}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="sticky top-[calc(var(--app-header-height,3rem)+0.75rem)] z-30 mb-8">
          <div className="bg-white/95 backdrop-blur rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-nowrap  overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth px-2">
              {[
                { id: 'overview', label: 'Overview', icon: BookOpen },
                { id: 'eligibility', label: 'Eligibility', icon: CheckCircle },
                { id: 'application', label: 'How to Apply', icon: FileText },
                { id: 'documents', label: 'Documents', icon: Download },
                { id: 'dates', label: 'Important Dates', icon: Calendar },
                { id: 'faq', label: 'FAQ', icon: AlertCircle }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex flex-shrink-0 items-center gap-2 px-6 py-4 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === id
                      ? 'text-blue-600 border-blue-600 bg-blue-50'
                      : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
          </div>
        </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {activeTab === 'overview' && (
            <div className="md:flex gap-8">
              {/* LEFT: Overview info */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Scholarship Overview</h3>
                <p className="text-gray-700 mb-6">
                  This scholarship provides financial support for students pursuing {scholarship.program} {slug ? 'in Kyrgyzstan' : 'at our partner university in Kyrgyzstan'}.
                </p>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Coverage</h4>
                  <div className="flex flex-wrap gap-2">
                    {scholarship.coverage.map((item, index) => (
                      <span key={index} className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-md border border-green-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Sidebar info (no image, with icons, only 3 cards) */}
              <div className="w-full md:w-96 mt-8 md:mt-0 flex flex-col gap-6">
                {/* Contact Information */}
                <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="flex items-center text-blue-700 mb-2">
                    <Mail className="h-5 w-5 mr-2" />
                    <span>scholarships@alatoo.edu.kg</span>
                  </div>
                  <div className="flex items-center text-green-700 mb-2">
                    <Phone className="h-5 w-5 mr-2" />
                    <span>+996 312 915000</span>
                  </div>
                  <div className="flex items-center text-red-700">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>International Student Office, Main Campus Building</span>
                  </div>
                </div>
                {/* Processing Time */}
                <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-100">
                  <h4 className="font-semibold text-orange-700 flex items-center mb-2 gap-2"><Calendar className="w-5 h-5" />Processing Time</h4>
                  <p className="text-gray-700">4-6 weeks from application deadline</p>
                </div>
                {/* Ready to Apply info */}
                <div className="bg-blue-600 rounded-lg p-5 text-white text-center mt-2">
                  <h4 className="font-bold mb-2">Ready to Apply?</h4>
                  <p className="mb-4">Don't miss this opportunity. Application deadline is approaching.</p>
                  <button onClick={() => setIsApplicationPopupOpen(true)} className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50">Apply Now</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'eligibility' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Eligibility Criteria</h3>
              <ul className="space-y-3">
                {scholarship.eligibility.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'application' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">How to Apply</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Application Mode: {scholarship.application_mode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                  <p className="text-blue-800">Follow the specific application process for this scholarship type.</p>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700">1. Complete the online application form</p>
                  <p className="text-gray-700">2. Submit all required documents</p>
                  <p className="text-gray-700">3. Wait for review and approval</p>
                  <p className="text-gray-700">4. Receive confirmation and next steps</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Required Documents</h3>
              <div className="space-y-3">
                <p className="text-gray-700">• Academic transcripts</p>
                <p className="text-gray-700">• Passport copy</p>
                <p className="text-gray-700">• Statement of purpose</p>
                <p className="text-gray-700">• Recommendation letters</p>
                <p className="text-gray-700">• Financial documents</p>
              </div>
            </div>
          )}

          {activeTab === 'dates' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Important Dates</h3>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h4 className="font-semibold text-red-900 mb-1">Application Deadline</h4>
                  <p className="text-red-800 text-lg font-medium">{formatDate(scholarship.deadline)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">• Application review: 2-3 weeks after deadline</p>
                  <p className="text-gray-700">• Results announcement: 4-6 weeks after deadline</p>
                  <p className="text-gray-700">• Program start: Next academic session</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
              {faqLoading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                </div>
              )}
              {!faqLoading && faqError && (
                <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4">
                  {faqError}
                </div>
              )}
              {!faqLoading && !faqError && faqs.length > 0 && (
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                      <div
                        className="text-gray-700 prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: faq.answer }}
                      />
                    </div>
                  ))}
                </div>
              )}
              {!faqLoading && !faqError && faqs.length === 0 && (
                <p className="text-gray-600">No FAQs available for this scholarship yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Download Brochure Popup */}
      <DownloadFormPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        universityName={scholarship ? `${scholarship.title} - ${scholarship.program}` : "Kyrgyzstan Scholarship"} 
      />
      
      {/* Scholarship Application Popup */}
      <ScholarshipApplicationPopup 
        isOpen={isApplicationPopupOpen} 
        onClose={() => setIsApplicationPopupOpen(false)} 
        scholarshipTitle={scholarship ? scholarship.title : "Scholarship"}
        program={scholarship ? scholarship.program : "Program"}
      />
    </div>
  );
};

export default KyrgyzstanScholarshipPage;