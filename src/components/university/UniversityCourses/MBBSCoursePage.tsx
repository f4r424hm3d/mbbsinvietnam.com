import React, { useEffect, useState } from 'react';
import {
  GraduationCap, 
  Clock, 
  DollarSign, 
  BookOpen, 
  Building2, 
  Stethoscope,
  Users,
  Award,
  Globe,
  CheckCircle,
  Calendar,
  MapPin,
  Activity,
  Microscope,
  FileText,
  ChevronDown,
  ChevronUp,
  ArrowRight
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import DownloadFormPopup from '../DownloadFormPopup';
import { getUniversityBySlug, getUniversityHospitals, getProgramDetails, ProgramDetails as ProgramDetailsType } from '../../../Api';

type HospitalAffiliation = {
  id: number;
  name: string;
  type: string;
  beds: string;
  location: string;
  specialties: string[];
};

const parseHospitalSpecialties = (specialities: string | null): string[] => {
  if (!specialities) {
    return [];
  }

  try {
    const parsed = JSON.parse(specialities);

    if (Array.isArray(parsed)) {
      return parsed
        .flatMap((item) => {
          if (typeof item === 'string') {
            return item
              .split(/\r?\n|,/)
              .map((speciality) => speciality.trim())
              .filter(Boolean);
          }

          return [];
        });
    }

    if (typeof parsed === 'string') {
      return parsed
        .split(/\r?\n|,/)
        .map((speciality) => speciality.trim())
        .filter(Boolean);
    }
  } catch (error) {
    // Fallback to manual parsing below
  }

  return specialities
    .split(/\r?\n|,/)
    .map((speciality) => speciality.trim())
    .filter(Boolean);
};

interface MBBSCoursePageProps {
  universityId?: number;
  programSlug?: string;
}

export const MBBSCoursePage: React.FC<MBBSCoursePageProps> = ({ universityId, programSlug: propProgramSlug }) => {
  const { slug, programSlug: urlProgramSlug } = useParams<{ slug?: string; programSlug?: string }>();
  const programSlug = propProgramSlug || urlProgramSlug;
  const [activeYear, setActiveYear] = useState(1);
  const [openFacility, setOpenFacility] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showFullContent, setShowFullContent] = useState(false);
  const [resolvedUniversityId, setResolvedUniversityId] = useState<number | null | undefined>(
    typeof universityId === 'number' ? universityId : undefined
  );
  const [hospitalAffiliations, setHospitalAffiliations] = useState<HospitalAffiliation[]>([]);
  const [isHospitalsLoading, setIsHospitalsLoading] = useState<boolean>(true);
  const [hospitalStatusMessage, setHospitalStatusMessage] = useState<string | null>(null);
  const [programDetails, setProgramDetails] = useState<ProgramDetailsType | null>(null);
  const [isProgramLoading, setIsProgramLoading] = useState<boolean>(true);
  const [programError, setProgramError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof universityId === 'number') {
      setResolvedUniversityId(universityId);
      return;
    }

    if (!slug) {
      setResolvedUniversityId(null);
      return;
    }

    let isMounted = true;

    const resolveUniversity = async () => {
      setResolvedUniversityId(undefined);
      setHospitalStatusMessage(null);
      setIsHospitalsLoading(true);

      try {
        const university = await getUniversityBySlug(slug);
        if (!isMounted) {
          return;
        }
        setResolvedUniversityId(university.id);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        console.error("Failed to resolve university by slug:", error);
        setResolvedUniversityId(null);
        setHospitalStatusMessage("Unable to determine the university for hospital affiliations.");
        setIsHospitalsLoading(false);
      }
    };

    resolveUniversity();

    return () => {
      isMounted = false;
    };
  }, [universityId, slug]);

  // Fetch program details
  useEffect(() => {
    if (resolvedUniversityId === undefined || !programSlug) {
      return;
    }

    if (resolvedUniversityId === null) {
      setProgramDetails(null);
      setIsProgramLoading(false);
      setProgramError("University information not available.");
      return;
    }

    let isMounted = true;

    const fetchProgramDetails = async () => {
      setIsProgramLoading(true);
      setProgramError(null);

      try {
        const response = await getProgramDetails(resolvedUniversityId, programSlug, { limit: 6 });
        
        if (!isMounted) {
          return;
        }

        setProgramDetails(response.data.program);
        setProgramError(null);
        
        // Set active year to first year with content, or Year 1
        const yearFields = ['year1_syllabus', 'year2_syllabus', 'year3_syllabus', 'year4_syllabus', 'year5_syllabus', 'year6_syllabus'];
        for (let i = 0; i < yearFields.length; i++) {
          const content = response.data.program[yearFields[i] as keyof typeof response.data.program] as string;
          if (content) {
            setActiveYear(i + 1);
            break;
          }
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to load program details:", error);
        setProgramDetails(null);
        setProgramError("Unable to load program details at the moment.");
      } finally {
        if (isMounted) {
          setIsProgramLoading(false);
        }
      }
    };

    fetchProgramDetails();

    return () => {
      isMounted = false;
    };
  }, [resolvedUniversityId, programSlug]);

  useEffect(() => {
    if (resolvedUniversityId === undefined) {
      return;
    }

    if (resolvedUniversityId === null) {
      setHospitalAffiliations([]);
      setIsHospitalsLoading(false);
      setHospitalStatusMessage((current) => current ?? "Hospital affiliations are currently unavailable.");
      return;
    }

    let isMounted = true;

    const fetchHospitals = async () => {
      setIsHospitalsLoading(true);
      setHospitalStatusMessage(null);

      try {
        const response = await getUniversityHospitals(resolvedUniversityId, { limit: 6 });
        const hospitals = response.data ?? [];

        if (!isMounted) {
          return;
        }

        if (!hospitals.length) {
          setHospitalAffiliations([]);
          setHospitalStatusMessage("Hospital affiliations are currently unavailable.");
          return;
        }

        const transformedHospitals = hospitals.map((hospital) => {
          const specialties = parseHospitalSpecialties(hospital.specialities);

          return {
            id: hospital.id,
            name: hospital.name,
            type: hospital.type,
            location: hospital.location,
            beds: hospital.beds !== null ? `${hospital.beds} Beds` : "Beds information not available",
            specialties: specialties.length ? specialties : ["Speciality details coming soon"]
          };
        });

        setHospitalAffiliations(transformedHospitals);
        setHospitalStatusMessage(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error("Failed to load hospital affiliations:", error);
        setHospitalAffiliations([]);
        setHospitalStatusMessage("Unable to load hospital affiliations at the moment.");
      } finally {
        if (isMounted) {
          setIsHospitalsLoading(false);
        }
      }
    };

    fetchHospitals();

    return () => {
      isMounted = false;
    };
  }, [resolvedUniversityId]);

  // Helper function to strip HTML tags
  const stripHtml = (html: string | null | undefined): string => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Get course highlights from program details or use defaults
  const courseHighlights = programDetails ? [
    { icon: <Clock className="w-6 h-6" />, title: `${programDetails.duration} Duration`, description: programDetails.duration },
    { icon: <Globe className="w-6 h-6" />, title: "Recognition", description: programDetails.recognition || "Globally recognized" },
    { icon: <DollarSign className="w-6 h-6" />, title: "Annual Fee", description: `${programDetails.currency} ${programDetails.annual_tuition_fee}` },
    { icon: <Users className="w-6 h-6" />, title: "Medium", description: programDetails.medium_of_instruction || "English" }
  ] : [
    { icon: <Clock className="w-6 h-6" />, title: "6 Years Duration", description: "5 years academic + 1 year internship" },
    { icon: <Globe className="w-6 h-6" />, title: "WHO/MCI Recognized", description: "Globally accepted medical degree" },
    { icon: <DollarSign className="w-6 h-6" />, title: "Affordable Fees", description: "Starting from $3,000/year" },
    { icon: <Users className="w-6 h-6" />, title: "English Medium", description: "Complete instruction in English" }
  ];

  // Parse eligibility from program details or use defaults
  const getEligibilityCriteria = (): string[] => {
    if (programDetails?.eligibility) {
      const eligibilityText = stripHtml(programDetails.eligibility);
      // Split by common delimiters
      const criteria = eligibilityText
        .split(/\n|\.|•|-\s*/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
      return criteria.length > 0 ? criteria : [
        "NEET qualification mandatory for Indian students",
        "Minimum 50% in Physics, Chemistry, Biology (PCB) in Class 12",
        "Age limit: 17-25 years as on December 31st of admission year",
        "English proficiency (IELTS 6.0 or equivalent preferred)",
        "Medical fitness certificate required",
        "Valid passport with minimum 2 years validity"
      ];
    }
    return [
      "NEET qualification mandatory for Indian students",
      "Minimum 50% in Physics, Chemistry, Biology (PCB) in Class 12",
      "Age limit: 17-25 years as on December 31st of admission year",
      "English proficiency (IELTS 6.0 or equivalent preferred)",
      "Medical fitness certificate required",
      "Valid passport with minimum 2 years validity"
    ];
  };

  const eligibilityCriteria = getEligibilityCriteria();

  // Get year-wise syllabus from program details or use defaults
  type SyllabusYear = {
    year: number;
    title: string;
    content: string;
    htmlContent: string;
  };

  const getYearWiseSyllabus = (): SyllabusYear[] => {
    if (!programDetails) {
      return [
        {
          year: 1,
          title: "First Year - Foundation Sciences",
          content: "Anatomy, Physiology, Biochemistry, Histology, Medical Terminology, Medical Ethics, Russian Language. Basic medical sciences and human body structure.",
          htmlContent: ""
        },
        {
          year: 2,
          title: "Second Year - Advanced Basic Sciences",
          content: "Pathology, Microbiology, Pharmacology, Pathophysiology, Medical Psychology, Biostatistics. Disease processes and drug mechanisms.",
          htmlContent: ""
        },
        {
          year: 3,
          title: "Third Year - Clinical Introduction",
          content: "Internal Medicine, Surgery, Obstetrics & Gynecology, Pediatrics, Clinical Skills, Medical Imaging. Introduction to clinical practice and patient care.",
          htmlContent: ""
        },
        {
          year: 4,
          title: "Fourth Year - Clinical Specialties",
          content: "Cardiology, Neurology, Orthopedics, Dermatology, Psychiatry, Ophthalmology, ENT. Specialized medical fields and advanced diagnostics.",
          htmlContent: ""
        },
        {
          year: 5,
          title: "Fifth Year - Advanced Clinical Practice",
          content: "Emergency Medicine, Intensive Care, Radiology, Anesthesiology, Clinical Research, Medical Management. Advanced clinical skills and research methodology.",
          htmlContent: ""
        },
        {
          year: 6,
          title: "Sixth Year - Internship",
          content: "Hospital Rotations, Clinical Practice, Patient Management, Medical Documentation, Professional Development. Hands-on clinical experience and professional preparation.",
          htmlContent: ""
        }
      ];
    }

    const syllabusYears: SyllabusYear[] = [];
    const yearFields = [
      { year: 1, field: 'year1_syllabus', title: 'First Year' },
      { year: 2, field: 'year2_syllabus', title: 'Second Year' },
      { year: 3, field: 'year3_syllabus', title: 'Third Year' },
      { year: 4, field: 'year4_syllabus', title: 'Fourth Year' },
      { year: 5, field: 'year5_syllabus', title: 'Fifth Year' },
      { year: 6, field: 'year6_syllabus', title: 'Sixth Year' }
    ];

    yearFields.forEach(({ year, field, title }) => {
      const htmlContent = programDetails[field as keyof ProgramDetailsType] as string;
      const textContent = htmlContent ? stripHtml(htmlContent) : `Year ${year} syllabus content will be available soon.`;
      
      syllabusYears.push({
        year,
        title: `${title} - Syllabus`,
        content: textContent,
        htmlContent: htmlContent || ""
      });
    });

    // If no syllabus data from API, return default
    if (syllabusYears.length === 0) {
      return [
        {
          year: 1,
          title: "First Year",
          content: "Course curriculum details will be available soon.",
          htmlContent: ""
        }
      ];
    }

    return syllabusYears;
  };

  const yearWiseSyllabus = getYearWiseSyllabus();

  const facilities = [
    {
      title: "Modern Laboratories",
      description: "State-of-the-art pathology, microbiology, and biochemistry labs with latest equipment",
      icon: <Microscope className="w-8 h-8 text-blue-600" />,
      details: [
        "Digital microscopy systems",
        "Automated analyzers",
        "PCR and molecular diagnostic equipment",
        "Tissue processing units"
      ]
    },
    {
      title: "Simulation Centers",
      description: "Advanced medical simulation labs for hands-on training before real patient interaction",
      icon: <Activity className="w-8 h-8 text-green-600" />,
      details: [
        "High-fidelity patient simulators",
        "Surgical training models",
        "Emergency response scenarios",
        "Virtual reality medical training"
      ]
    },
    {
      title: "Digital Libraries",
      description: "Comprehensive medical libraries with access to international journals and databases",
      icon: <BookOpen className="w-8 h-8 text-purple-600" />,
      details: [
        "Access to PubMed and medical databases",
        "Digital textbooks and journals",
        "Research paper repositories",
        "24/7 online access"
      ]
    },
    {
      title: "Student Accommodation",
      description: "Comfortable hostel facilities with modern amenities for international students",
      icon: <Building2 className="w-8 h-8 text-orange-600" />,
      details: [
        "Furnished rooms with Wi-Fi",
        "Common areas and study rooms",
        "Cafeteria with Indian food options",
        "24/7 security and support"
      ]
    }
  ];

  const admissionProcess = [
    {
      step: 1,
      title: "NEET Qualification",
      description: "Clear NEET with minimum qualifying percentile",
      timeline: "May-June"
    },
    {
      step: 2,
      title: "University Selection",
      description: "Choose university and submit application with documents",
      timeline: "June-July"
    },
    {
      step: 3,
      title: "Document Verification",
      description: "University verifies documents and academic credentials",
      timeline: "July-August"
    },
    {
      step: 4,
      title: "Admission Letter",
      description: "Receive official admission letter and fee payment details",
      timeline: "August"
    },
    {
      step: 5,
      title: "Visa Processing",
      description: "Apply for student visa with admission documents",
      timeline: "August-September"
    },
    {
      step: 6,
      title: "Travel & Enrollment",
      description: "Travel to Kyrgyzstan and complete enrollment process",
      timeline: "September"
    }
  ];

  // Additional Information content from program details or default
  const additionalInfoContent = programDetails?.additional_information 
    ? stripHtml(programDetails.additional_information)
    : programDetails?.why_choose_kyrgyzstan
    ? stripHtml(programDetails.why_choose_kyrgyzstan)
    : "Kyrgyzstan's education system has undergone significant reforms since independence in 1991, transitioning from the Soviet model to a more modern, internationally recognized system. The country has made substantial progress in aligning its medical education standards with international benchmarks, particularly WHO and UNESCO guidelines. Medical universities in Kyrgyzstan offer comprehensive MBBS programs that combine rigorous theoretical learning with extensive practical training. The curriculum is designed to meet global medical education standards while incorporating local healthcare needs. Students benefit from experienced faculty members, many of whom have international training and research experience. The education system emphasizes both academic excellence and practical skills, ensuring graduates are well-prepared for medical practice worldwide. With increasing recognition and accreditation, Kyrgyzstan's medical universities continue to attract students from across the globe, particularly from India, Pakistan, and other South Asian countries seeking quality medical education at affordable costs.";

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

  const wordCount = countWords(additionalInfoContent);
  const shouldTruncate = wordCount > 30;
  const displayText = shouldTruncate && !showFullContent 
    ? truncateText(additionalInfoContent, 30) 
    : additionalInfoContent;

  // Show loading state while fetching program details
  if (isProgramLoading && !programDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading program details...</p>
        </div>
      </div>
    );
  }

  // Show error state if program fetch failed
  if (programError && !programDetails && programSlug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Program</h2>
          <p className="text-gray-600 mb-4">{programError}</p>
          <Link to="/universities" className="text-blue-600 hover:text-blue-800 underline">
            Go back to universities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-white bg-opacity-20 rounded-full p-4">
                <GraduationCap className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">
              {programDetails ? programDetails.program_name : "MBBS in Kyrgyzstan"}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {programDetails?.overview 
                ? stripHtml(programDetails.overview).substring(0, 200) + (stripHtml(programDetails.overview).length > 200 ? '...' : '')
                : "Pursue your medical dreams with world-class education at affordable costs. WHO/MCI recognized universities offering quality medical education in English medium."
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {programDetails?.recognition && (
                <span className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                  {programDetails.recognition}
                </span>
              )}
              {programDetails?.medium_of_instruction && (
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold">
                  {programDetails.medium_of_instruction} Medium
                </span>
              )}
              {programDetails?.duration && (
                <span className="bg-purple-500 text-white px-4 py-2 rounded-full font-semibold">
                  {programDetails.duration}
                </span>
              )}
              {!programDetails && (
                <>
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                    WHO Recognized
                  </span>
                  <span className="bg-purple-500 text-white px-4 py-2 rounded-full font-semibold">
                    MCI Approved
                  </span>
                  <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-semibold">
                    English Medium
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Course Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseHighlights.map((highlight, index) => (
              <div key={index} className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-blue-200 mb-3">{highlight.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{highlight.title}</h3>
                <p className="text-blue-100 text-sm">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Course Overview */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-8 h-8 text-red-600 mr-3" />
              Course Overview
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Program Structure</h3>
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <p className="font-semibold text-blue-900">Duration: {programDetails?.duration || "6 Years"}</p>
                      <p className="text-blue-700 text-sm">{programDetails?.duration || "5 years academic study + 1 year internship"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <Globe className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold text-green-900">Medium of Instruction</p>
                      <p className="text-green-700 text-sm">{programDetails?.medium_of_instruction || "Complete course taught in English"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <Award className="w-6 h-6 text-purple-600 mr-3" />
                    <div>
                      <p className="font-semibold text-purple-900">Recognition</p>
                      <p className="text-purple-700 text-sm">{programDetails?.recognition || "WHO, MCI, UNESCO approved"}</p>
                    </div>
                  </div>
                  
                  {programDetails && (
                    <>
                      <div className="flex items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <DollarSign className="w-6 h-6 text-yellow-600 mr-3" />
                        <div>
                          <p className="font-semibold text-yellow-900">Annual Tuition Fee</p>
                          <p className="text-yellow-700 text-sm">{programDetails.currency} {programDetails.annual_tuition_fee}</p>
                        </div>
                      </div>
                      {programDetails.intake && (
                        <div className="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <Calendar className="w-6 h-6 text-indigo-600 mr-3" />
                          <div>
                            <p className="font-semibold text-indigo-900">Intake</p>
                            <p className="text-indigo-700 text-sm">{programDetails.intake}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose This Program?</h3>
                {programDetails?.why_choose_kyrgyzstan ? (
                  <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: programDetails.why_choose_kyrgyzstan }} />
                ) : (
                  <ul className="space-y-3">
                    {[
                      "Affordable tuition fees compared to private colleges in India",
                      "No donation or capitation fees required",
                      "Direct admission without entrance exams (NEET qualified)",
                      "Safe and student-friendly environment",
                      "Similar climate and culture to India",
                      "Easy visa process for Indian students",
                      "Quality education with modern facilities",
                      "Opportunity to practice in India after clearing MCI screening"
                    ].map((point, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Eligibility Criteria */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              Eligibility Criteria
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eligibilityCriteria.map((criterion, index) => (
                <div key={index} className="flex items-start p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{criterion}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Note for Indian Students</h3>
              <p className="text-yellow-800">
                NEET qualification is mandatory for Indian students as per MCI guidelines. Students must also 
                clear the Foreign Medical Graduate Examination (FMGE) to practice in India after graduation.
              </p>
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="mb-16">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Additional Information</h2>
            <p className="text-gray-600 text-lg">Learn more about the education system and opportunities in Kyrgyzstan</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-gray-700 text-lg leading-relaxed">
              <p>{displayText}</p>
              {shouldTruncate && (
                <button
                  onClick={() => setShowFullContent(!showFullContent)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 underline mt-4 block"
                >
                  {showFullContent ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Syllabus */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="w-8 h-8 text-red-600 mr-3" />
              Year-wise Syllabus
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {yearWiseSyllabus.map((year) => (
                <button
                  key={year.year}
                  onClick={() => setActiveYear(year.year)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeYear === year.year
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Year {year.year}
                </button>
              ))}
            </div>
            
            {yearWiseSyllabus.map((year) => (
              activeYear === year.year && (
                <div key={year.year} className="bg-red-50 rounded-xl p-6 border border-red-200">
                  <h3 className="text-2xl font-bold text-red-900 mb-4">{year.title}</h3>
                  
                  {/* Display HTML content if available, otherwise show plain text in textarea */}
                  {year.htmlContent ? (
                    <div className="bg-white rounded-lg p-6 border border-red-200 shadow-sm min-h-[300px]">
                      <div 
                        className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: year.htmlContent }}
                      />
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-red-200 shadow-sm">
                      <textarea
                        readOnly
                        value={year.content}
                        className="w-full p-6 min-h-[300px] text-gray-700 leading-relaxed resize-none border-none focus:outline-none focus:ring-0 bg-transparent"
                        style={{ 
                          fontFamily: 'inherit',
                          fontSize: 'inherit',
                          lineHeight: '1.75',
                          whiteSpace: 'pre-wrap',
                          wordWrap: 'break-word'
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </section>

        {/* Facilities */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Building2 className="w-8 h-8 text-orange-600 mr-3" />
              University Facilities
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facilities.map((facility, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div 
                    className="p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setOpenFacility(openFacility === index ? null : index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {facility.icon}
                        <div className="ml-4">
                          <h3 className="text-xl font-semibold text-gray-900">{facility.title}</h3>
                          <p className="text-gray-600 mt-1">{facility.description}</p>
                        </div>
                      </div>
                      {openFacility === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                  
                  {openFacility === index && (
                    <div className="p-6 bg-white border-t border-gray-200">
                      <ul className="space-y-2">
                        {facility.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-3" />
                            <span className="text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hospital Affiliations */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <Stethoscope className="w-8 h-8 text-red-600 mr-3" />
              Hospital Affiliations & Clinical Training
            </h2>
            
            <p className="text-gray-600 mb-8 text-lg">
              Students get hands-on clinical experience at top-tier hospitals and medical centers 
              across Kyrgyzstan, ensuring comprehensive practical training.
            </p>
            
            {isHospitalsLoading ? (
              <div className="py-8 text-center text-gray-500">
                Loading hospital affiliations...
              </div>
            ) : (
              <>
                {hospitalStatusMessage && (
                  <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
                    {hospitalStatusMessage}
                  </div>
                )}
                {hospitalAffiliations.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {hospitalAffiliations.map((hospital) => {
                      const specialties = hospital.specialties.length
                        ? hospital.specialties
                        : ["Speciality details coming soon"];

                      return (
                        <div
                          key={hospital.id}
                          className="rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-lg"
                        >
                          <div className="mb-4 flex items-start justify-between">
                            <div>
                              <h3 className="mb-1 text-xl font-bold text-gray-900">{hospital.name}</h3>
                              <p className="font-medium text-red-600">{hospital.type}</p>
                              <p className="mt-1 flex items-center text-gray-600">
                                <MapPin className="mr-1 h-4 w-4" />
                                {hospital.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                                {hospital.beds}
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="mb-2 font-semibold text-gray-900">Specialties:</h4>
                            <div className="flex flex-wrap gap-2">
                              {specialties.map((specialty, idx) => (
                                <span key={idx} className="rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-800">
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  !hospitalStatusMessage && (
                    <div className="py-8 text-center text-gray-500">
                      Hospital affiliations will be available soon.
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </section>

        {/* Admission Process */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <FileText className="w-8 h-8 text-red-600 mr-3" />
              Admission Process
            </h2>
            
            <div className="space-y-6">
              {admissionProcess.map((process, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-6">
                    {process.step}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{process.title}</h3>
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                        {process.timeline}
                      </span>
                    </div>
                    <p className="text-gray-700">{process.description}</p>
                  </div>
                  {index < admissionProcess.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-gray-400 ml-6 mt-3" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section>
          <div className="bg-red-600 rounded-xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Medical Journey?</h2>
            <p className="text-red-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of Indian students who have successfully completed their MBBS from Kyrgyzstan. 
              Get personalized guidance and support throughout your admission process.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/student/application-form"
                className="rounded-lg bg-white px-8 py-3 font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                Apply Now
              </Link>
              <button onClick={() => setIsPopupOpen(true)}
                className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-red-600"
              >
                Download Brochure
              </button>
              <Link to="/contact-us"
                className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-red-600"
              >
                Contact Counselor
              </Link>
            </div>
          </div>
        </section>
        <DownloadFormPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          universityName="Kyrgyzstan Universities"
        />
      </div>
    </div>
  );
};