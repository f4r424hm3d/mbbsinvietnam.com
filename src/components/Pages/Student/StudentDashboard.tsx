import { useState, useEffect, useRef } from 'react';
import { User, Pencil, LogOut, Info, BookOpen, Lock, Settings, Edit, Trash2, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Homepage/Header';
import Footer from '../../Homepage/Footer';
import { getStudentProfile, logoutStudent, updateEducationSummary, addSchool, updateSchool, getAttendedSchools, deleteSchool, updateTestScore, uploadStudentDocument, getStudentDocuments, updatePersonalInformation, getPersonalInformation, IMAGE_BASE_URL, StudentProfile, PersonalInformationData, UpdateTestScoreParams } from '../../../Api';
import { isAuthenticated, clearAuthData, redirectToAuth } from '../../../utils/auth';

function StudentDashboardContainer() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState<string>('profile');
  const [activeTab, setActiveTab] = useState<string>('general');
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [headerHeight, setHeaderHeight] = useState<number>(80);
  const [tabsHeight, setTabsHeight] = useState<number>(0);
  const [tabsOriginalTop, setTabsOriginalTop] = useState<number>(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const isStickyRef = useRef<boolean>(false);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    countryCode: '',
    mobile: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    firstLanguage: '',
    countryOfCitizenship: '',
    passportNumber: '',
    passportExpiryDate: '',
    maritalStatus: '',
    gender: '',
    
    // Address Detail
    address: '',
    country: '',
    cityTown: '',
    provinceState: '',
    postalZipCode: '',
    homeContactNumber: '',
    
    // Education Summary
    countryOfEducation: '',
    highestLevelOfEducation: '',
    gradingScheme: '',
    gradeAverage: '',
    
    // Test Scores
    englishExamType: '',
    dateOfExam: '',
    listening: '',
    reading: '',
    writing: '',
    speaking: '',
    overallScore: '',
    
    // Upload Documents
    documentName: '',
    uploadedDocument: null as File | null
  });
  
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [attendedSchools, setAttendedSchools] = useState<any[]>([]);
  const [showAddSchoolForm, setShowAddSchoolForm] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingSchool, setIsSavingSchool] = useState<boolean>(false);
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);
  const [studentDocuments, setStudentDocuments] = useState<any[]>([]);
  const [schoolFormData, setSchoolFormData] = useState({
    countryOfInstitution: '',
    nameOfInstitution: '',
    levelOfEducation: '',
    primaryLanguageOfInstruction: '',
    attendedFrom: '',
    attendedTo: '',
    degreeName: '',
    hasGraduated: 'Yes',
    graduationDate: '',
    hasPhysicalCertificate: false,
    address: '',
    cityTown: '',
    province: '',
    postalZipCode: ''
  });
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Field-specific error states for each section
  const [personalInfoErrors, setPersonalInfoErrors] = useState<Record<string, string>>({});
  const [educationErrors, setEducationErrors] = useState<Record<string, string>>({});
  const [testScoreErrors, setTestScoreErrors] = useState<Record<string, string>>({});
  const [documentErrors, setDocumentErrors] = useState<Record<string, string>>({});
  const [schoolErrors, setSchoolErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const message = sessionStorage.getItem('dashboardFlashMessage');
    if (message) {
      setFlashMessage(message);
      sessionStorage.removeItem('dashboardFlashMessage');
    }
  }, []);

  useEffect(() => {
    if (!flashMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setFlashMessage(null);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [flashMessage]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    // Scroll to top when success message is shown
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage(null);
    }, 10000); // 10 seconds

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [successMessage]);

  const populateFormDataFromProfile = (student: StudentProfile, personalInfo?: PersonalInformationData | null) => {
    const fallbackString = (value: any, fallback: string = '') => {
      if (value === null || value === undefined) return fallback;
      return String(value);
    };

    // Normalize country value to match dropdown option values
    // Valid dropdown options are: "INDIA", "USA", "UK"
    const normalizeCountryValue = (value: string | null | undefined): string => {
      if (!value) return '';
      
      const trimmed = String(value).trim();
      
      // If already a valid dropdown option, return as-is
      const validOptions = ['INDIA', 'USA', 'UK'];
      if (validOptions.includes(trimmed.toUpperCase())) {
        return trimmed.toUpperCase();
      }
      
      // Normalize and map common variations to dropdown option values
      const normalized = trimmed.toUpperCase();
      const countryMapping: Record<string, string> = {
        'INDIA': 'INDIA',
        'IND': 'INDIA',
        'IN': 'INDIA',
        'USA': 'USA',
        'US': 'USA',
        'UNITED STATES': 'USA',
        'UNITED STATES OF AMERICA': 'USA',
        'UK': 'UK',
        'UNITED KINGDOM': 'UK',
        'GB': 'UK',
        'GBR': 'UK'
      };
      
      // Try direct mapping first
      if (countryMapping[normalized]) {
        return countryMapping[normalized];
      }
      
      // Try partial matching for common variations
      if (normalized.includes('INDIA') || normalized.includes('IND')) {
        return 'INDIA';
      }
      if (normalized.includes('UNITED STATES') || normalized.includes('USA') || normalized.includes('US ') || normalized === 'US') {
        return 'USA';
      }
      if (normalized.includes('UNITED KINGDOM') || normalized.includes('UK ') || normalized === 'UK') {
        return 'UK';
      }
      
      // If no match found, return empty string (will fall back to previous value or empty)
      return '';
    };

    // Get country of citizenship from various sources
    const rawCountryValue = personalInfo?.country_of_citizenship || 
                           personalInfo?.nationality || 
                           student.country_of_citizenship || 
                           student.nationality || 
                           '';

    setFormData(prev => ({
      ...prev,
      fullName: personalInfo?.name || student.name || '',
      email: personalInfo?.email || student.email || '',
      countryCode: personalInfo?.country_code !== undefined && personalInfo?.country_code !== null
        ? fallbackString(personalInfo.country_code)
        : student.country_code !== null && student.country_code !== undefined
          ? student.country_code.toString()
          : prev.countryCode || '',
      mobile: personalInfo?.phone || student.phone || '',
      fatherName: personalInfo?.father_name || student.father_name || '',
      motherName: personalInfo?.mother_name || student.mother_name || '',
      dateOfBirth: personalInfo?.date_of_birth
        ? personalInfo.date_of_birth.split('T')[0]
        : student.date_of_birth
          ? student.date_of_birth.split('T')[0]
          : '',
      firstLanguage: personalInfo?.first_language || student.first_language || '',
      countryOfCitizenship: normalizeCountryValue(rawCountryValue) || prev.countryOfCitizenship || '',
      passportNumber: personalInfo?.passport_number || student.passport_number || '',
      passportExpiryDate: personalInfo?.passport_expiry_date
        ? personalInfo.passport_expiry_date.split('T')[0]
        : student.passport_expiry_date
          ? student.passport_expiry_date.split('T')[0]
          : prev.passportExpiryDate || '',
      maritalStatus: personalInfo?.marital_status || student.marital_status || prev.maritalStatus || '',
      gender: personalInfo?.gender || student.gender || prev.gender || '',
      address: personalInfo?.address || student.address || '',
      country: personalInfo?.country || student.country || '',
      cityTown: personalInfo?.city || student.city || '',
      provinceState: personalInfo?.state || student.state || '',
      postalZipCode: personalInfo?.zipcode || student.zipcode || '',
      homeContactNumber: personalInfo?.home_contact_number || student.home_contact_number || '',
      countryOfEducation: student.country_of_education || '',
      highestLevelOfEducation: student.highest_level_of_education || '',
      gradingScheme: student.grading_scheme || '',
      gradeAverage: student.grade_average || '',
      englishExamType: student.english_exam_type || '',
      dateOfExam: student.date_of_exam ? student.date_of_exam.split('T')[0] : '',
      listening: student.listening_score || '',
      reading: student.reading_score || '',
      writing: student.writing_score || '',
      speaking: student.speaking_score || '',
      overallScore: student.overall_score || '',
    }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (personalInfoErrors[field]) {
      setPersonalInfoErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (educationErrors[field]) {
      setEducationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (testScoreErrors[field]) {
      setTestScoreErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    if (documentErrors[field]) {
      setDocumentErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        uploadedDocument: file
      }));
      // Clear error when file is selected
      if (documentErrors.uploadedDocument) {
        setDocumentErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.uploadedDocument;
          return newErrors;
        });
      }
    }
  };

  // Validation functions for each section
  const validatePersonalInformation = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!formData.fullName?.trim()) errors.fullName = 'Full Name is required';
    if (!formData.email?.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email address';
    if (!formData.countryCode?.trim()) errors.countryCode = 'Country code is required';
    if (!formData.mobile?.trim()) errors.mobile = 'Mobile number is required';
    if (!formData.fatherName?.trim()) errors.fatherName = 'Father Name is required';
    if (!formData.motherName?.trim()) errors.motherName = 'Mother Name is required';
    if (!formData.dateOfBirth?.trim()) errors.dateOfBirth = 'Date of Birth is required';
    if (!formData.firstLanguage?.trim()) errors.firstLanguage = 'First Language is required';
    if (!formData.countryOfCitizenship?.trim()) errors.countryOfCitizenship = 'Country of Citizenship is required';
    if (!formData.passportNumber?.trim()) errors.passportNumber = 'Passport Number is required';
    if (!formData.maritalStatus?.trim()) errors.maritalStatus = 'Marital Status is required';
    if (!formData.gender?.trim()) errors.gender = 'Gender is required';
    if (!formData.address?.trim()) errors.address = 'Address is required';
    if (!formData.cityTown?.trim()) errors.cityTown = 'City is required';
    if (!formData.provinceState?.trim()) errors.provinceState = 'State is required';
    if (!formData.country?.trim()) errors.country = 'Country is required';
    if (!formData.homeContactNumber?.trim()) errors.homeContactNumber = 'Home Contact Number is required';
    
    return errors;
  };

  const validateEducationSummary = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!formData.countryOfEducation?.trim()) errors.countryOfEducation = 'Country of Education is required';
    if (!formData.highestLevelOfEducation?.trim()) errors.highestLevelOfEducation = 'Highest Level of Education is required';
    if (!formData.gradingScheme?.trim()) errors.gradingScheme = 'Grading Scheme is required';
    if (!formData.gradeAverage?.trim()) errors.gradeAverage = 'Grade Average is required';
    
    return errors;
  };

  const validateTestScores = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!formData.englishExamType?.trim()) {
      errors.englishExamType = 'English Exam Type is required';
      return errors; // Return early if no exam type
    }
    
    if (!formData.dateOfExam?.trim()) {
      errors.dateOfExam = 'Date of Exam is required';
    }

    const examType = formData.englishExamType;
    const showFourSkills = examType === 'IELTS' || examType === 'TOEFL' || examType === 'PTE';
    const showOverall = examType === 'PTE' || examType === 'Duolingo';

    if (showFourSkills) {
      if (!formData.listening?.trim()) errors.listening = 'Listening score is required';
      if (!formData.reading?.trim()) errors.reading = 'Reading score is required';
      if (!formData.writing?.trim()) errors.writing = 'Writing score is required';
      if (!formData.speaking?.trim()) errors.speaking = 'Speaking score is required';
    }

    if (showOverall && !formData.overallScore?.trim()) {
      errors.overallScore = 'Overall score is required';
    }
    
    return errors;
  };

  const validateUploadDocuments = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!formData.documentName?.trim()) errors.documentName = 'Document Name is required';
    if (!formData.uploadedDocument) errors.uploadedDocument = 'Please select a document to upload';
    
    return errors;
  };

  const validateSchoolForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!schoolFormData.countryOfInstitution?.trim()) errors.countryOfInstitution = 'Country of Institution is required';
    if (!schoolFormData.nameOfInstitution?.trim()) errors.nameOfInstitution = 'Name of Institution is required';
    if (!schoolFormData.levelOfEducation?.trim()) errors.levelOfEducation = 'Level of Education is required';
    if (!schoolFormData.primaryLanguageOfInstruction?.trim()) errors.primaryLanguageOfInstruction = 'Primary Language of Instruction is required';
    if (!schoolFormData.attendedFrom?.trim()) errors.attendedFrom = 'Attended Institution From date is required';
    if (!schoolFormData.attendedTo?.trim()) errors.attendedTo = 'Attended Institution To date is required';
    if (!schoolFormData.degreeName?.trim()) errors.degreeName = 'Degree Name is required';
    if (!schoolFormData.address?.trim()) errors.address = 'Address is required';
    if (!schoolFormData.cityTown?.trim()) errors.cityTown = 'City/Town is required';
    
    return errors;
  };

  // Helper function to map API field names to form field names
  const mapApiErrorsToFormFields = (apiErrors: any, fieldMapping: Record<string, string>): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (apiErrors && typeof apiErrors === 'object') {
      Object.keys(apiErrors).forEach(apiField => {
        const formField = fieldMapping[apiField] || apiField;
        const errorMessages = Array.isArray(apiErrors[apiField]) 
          ? apiErrors[apiField].join(', ') 
          : apiErrors[apiField];
        errors[formField] = errorMessages;
      });
    }
    
    return errors;
  };

  const handleSave = async (section: string) => {
    console.log(`Saving ${section}:`, formData);
    setIsSaving(true);
    
    // Clear previous errors
    setPersonalInfoErrors({});
    setEducationErrors({});
    setTestScoreErrors({});
    setDocumentErrors({});
    
    try {
      if (section === 'Personal Information and Address Detail') {
        // Validate before saving
        const validationErrors = validatePersonalInformation();
        if (Object.keys(validationErrors).length > 0) {
          setPersonalInfoErrors(validationErrors);
          setIsSaving(false);
          return;
        }

        const personalInfoData = {
          name: formData.fullName || '',
          email: formData.email || '',
          phone: formData.mobile || '',
          country_code: formData.countryCode || '',
          father_name: formData.fatherName || '',
          mother_name: formData.motherName || '',
          date_of_birth: formData.dateOfBirth || '',
          first_language: formData.firstLanguage || '',
          nationality: formData.countryOfCitizenship || '',
          passport_number: formData.passportNumber || '',
          passport_expiry_date: formData.passportExpiryDate || '',
          marital_status: formData.maritalStatus || '',
          gender: formData.gender || '',
          address: formData.address || '',
          city: formData.cityTown || '',
          state: formData.provinceState || '',
          country: formData.country || '',
          zipcode: formData.postalZipCode || '',
          home_contact_number: formData.homeContactNumber || '',
        };

        const response = await updatePersonalInformation(personalInfoData);

        setSuccessMessage(response?.message || 'Personal information updated successfully!');
        setPersonalInfoErrors({}); // Clear errors on success

        // Refresh profile data to reflect updates
        const [profileResponse, personalInformation] = await Promise.all([
          getStudentProfile(),
          getPersonalInformation().catch(() => null)
        ]);
        if (profileResponse?.data?.student) {
          populateFormDataFromProfile(profileResponse.data.student, personalInformation || undefined);
        }
      } else if (section === 'Education Summary') {
        // Validate before saving
        const validationErrors = validateEducationSummary();
        if (Object.keys(validationErrors).length > 0) {
          setEducationErrors(validationErrors);
          setIsSaving(false);
          return;
        }

        const educationData = {
          country_of_education: formData.countryOfEducation,
          highest_level_of_education: formData.highestLevelOfEducation,
          grading_scheme: formData.gradingScheme,
          grade_average: formData.gradeAverage
        };
        
        const response = await updateEducationSummary(educationData);
        
        if (response.status) {
          setSuccessMessage('Education summary updated successfully!');
          setEducationErrors({}); // Clear errors on success
        } else {
          // Handle API errors - show message on first field
          setEducationErrors({ countryOfEducation: response.message || 'Failed to update education summary' });
        }
      } else if (section === 'Test Scores') {
        // Validate before saving
        const validationErrors = validateTestScores();
        if (Object.keys(validationErrors).length > 0) {
          setTestScoreErrors(validationErrors);
          setIsSaving(false);
          return;
        }

        const examType = formData.englishExamType;
        const showFourSkills = examType === 'IELTS' || examType === 'TOEFL' || examType === 'PTE';
        const showOverall = examType === 'PTE' || examType === 'Duolingo';

        // Build test score data object - API expects all fields, use empty strings for unused fields
        const testScoreData: UpdateTestScoreParams = {
          english_exam_type: formData.englishExamType,
          date_of_exam: formData.dateOfExam,
          // Always include all fields, but use empty strings for fields not applicable to exam type
          listening_score: showFourSkills ? formData.listening : '',
          reading_score: showFourSkills ? formData.reading : '',
          speaking_score: showFourSkills ? formData.speaking : '',
          writing_score: showFourSkills ? formData.writing : '',
          overall_score: showOverall ? formData.overallScore : '',
        };

        const response = await updateTestScore(testScoreData);

        if (response?.message) {
          setSuccessMessage(response.message);
          setTestScoreErrors({}); // Clear errors on success
        } else {
          setSuccessMessage('Test score updated successfully!');
          setTestScoreErrors({}); // Clear errors on success
        }

        // Refresh profile data to reflect updates
        try {
          const [profileResponse, personalInformation] = await Promise.all([
            getStudentProfile(),
            getPersonalInformation().catch(() => null)
          ]);
          if (profileResponse?.data?.student) {
            populateFormDataFromProfile(profileResponse.data.student, personalInformation || undefined);
          }
        } catch (refreshError) {
          console.error('Error refreshing profile after test score update:', refreshError);
          // Don't show error to user as the save was successful
        }
      } else if (section === 'Upload Documents') {
        // Validate before saving
        const validationErrors = validateUploadDocuments();
        if (Object.keys(validationErrors).length > 0) {
          setDocumentErrors(validationErrors);
          setIsSaving(false);
          return;
        }

        const response = await uploadStudentDocument({
          document_name: formData.documentName,
          file: formData.uploadedDocument!,
        });

        setSuccessMessage(response?.message || 'Document uploaded successfully!');
        setDocumentErrors({}); // Clear errors on success

        setFormData(prev => ({
          ...prev,
          documentName: '',
          uploadedDocument: null,
        }));

        await fetchStudentDocuments();
      } else {
        // Handle other sections
        console.log('Save functionality for this section is not implemented yet');
      }
    } catch (error: any) {
      console.error(`Error saving ${section}:`, error);
      
      // Handle validation errors (422) with field-specific mapping
      if (error.response?.status === 422) {
        const apiErrors = error.response?.data?.errors || error.response?.data?.message;
        
        if (section === 'Personal Information and Address Detail') {
          const fieldMapping: Record<string, string> = {
            name: 'fullName',
            email: 'email',
            phone: 'mobile',
            country_code: 'countryCode',
            father_name: 'fatherName',
            mother_name: 'motherName',
            date_of_birth: 'dateOfBirth',
            first_language: 'firstLanguage',
            nationality: 'countryOfCitizenship',
            country_of_citizenship: 'countryOfCitizenship',
            passport_number: 'passportNumber',
            passport_expiry_date: 'passportExpiryDate',
            marital_status: 'maritalStatus',
            gender: 'gender',
            address: 'address',
            city: 'cityTown',
            state: 'provinceState',
            country: 'country',
            zipcode: 'postalZipCode',
            home_contact_number: 'homeContactNumber'
          };
          const mappedErrors = mapApiErrorsToFormFields(apiErrors, fieldMapping);
          setPersonalInfoErrors(mappedErrors);
        } else if (section === 'Education Summary') {
          const fieldMapping: Record<string, string> = {
            country_of_education: 'countryOfEducation',
            highest_level_of_education: 'highestLevelOfEducation',
            grading_scheme: 'gradingScheme',
            grade_average: 'gradeAverage'
          };
          const mappedErrors = mapApiErrorsToFormFields(apiErrors, fieldMapping);
          setEducationErrors(mappedErrors);
        } else if (section === 'Test Scores') {
          const fieldMapping: Record<string, string> = {
            english_exam_type: 'englishExamType',
            date_of_exam: 'dateOfExam',
            listening_score: 'listening',
            reading_score: 'reading',
            writing_score: 'writing',
            speaking_score: 'speaking',
            overall_score: 'overallScore'
          };
          const mappedErrors = mapApiErrorsToFormFields(apiErrors, fieldMapping);
          setTestScoreErrors(mappedErrors);
        } else if (section === 'Upload Documents') {
          const fieldMapping: Record<string, string> = {
            document_name: 'documentName',
            file: 'uploadedDocument',
            uploaded_document: 'uploadedDocument'
          };
          const mappedErrors = mapApiErrorsToFormFields(apiErrors, fieldMapping);
          setDocumentErrors(mappedErrors);
        }
      } else {
        // For non-422 errors, show general error on first field (can be customized)
        if (section === 'Personal Information and Address Detail') {
          setPersonalInfoErrors({ fullName: error.response?.data?.message || error.message || 'An error occurred. Please try again.' });
        } else if (section === 'Education Summary') {
          setEducationErrors({ countryOfEducation: error.response?.data?.message || error.message || 'An error occurred. Please try again.' });
        } else if (section === 'Test Scores') {
          setTestScoreErrors({ englishExamType: error.response?.data?.message || error.message || 'An error occurred. Please try again.' });
        } else if (section === 'Upload Documents') {
          setDocumentErrors({ documentName: error.response?.data?.message || error.message || 'An error occurred. Please try again.' });
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form or navigate away
    console.log('Cancel clicked');
  };

  const handleSchoolInputChange = (field: string, value: any) => {
    setSchoolFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field when user starts typing
    if (schoolErrors[field]) {
      setSchoolErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleTabClick = (tabId: string, buttonElement?: HTMLButtonElement) => {
    setActiveTab(tabId);
    // Scroll tab button into view on mobile
    if (buttonElement) {
      buttonElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
    // Scroll content section into view
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSaveSchool = async () => {
    // Clear previous errors
    setSchoolErrors({});
    
    // Validate required fields
    const validationErrors = validateSchoolForm();
    if (Object.keys(validationErrors).length > 0) {
      setSchoolErrors(validationErrors);
      return;
    }

    setIsSavingSchool(true);
    try {
      const schoolData = {
        country_of_institution: schoolFormData.countryOfInstitution,
        name_of_institution: schoolFormData.nameOfInstitution,
        level_of_education: schoolFormData.levelOfEducation,
        primary_language_of_instruction: schoolFormData.primaryLanguageOfInstruction,
        attended_institution_from: schoolFormData.attendedFrom,
        attended_institution_to: schoolFormData.attendedTo,
        degree_name: schoolFormData.degreeName,
        graduated_from_this: schoolFormData.hasGraduated === 'Yes' ? 1 : 0,
        address: schoolFormData.address,
        city: schoolFormData.cityTown,
        state: schoolFormData.province || '',
        zipcode: schoolFormData.postalZipCode || '',
      };

      let response;
      if (editingSchoolId) {
        // Update existing school
        response = await updateSchool({
          ...schoolData,
          id: editingSchoolId
        });
        setSuccessMessage(response.message || 'School updated successfully!');
      } else {
        // Add new school
        response = await addSchool(schoolData);
        setSuccessMessage(response.message || 'School added successfully!');
      }
      
      if (response.message) {
        // Fetch updated schools from API
        await fetchAttendedSchools();
        
        setShowAddSchoolForm(false);
        setEditingSchoolId(null);
        setSchoolErrors({}); // Clear errors on success
        // Reset form
        setSchoolFormData({
          countryOfInstitution: '',
          nameOfInstitution: '',
          levelOfEducation: '',
          primaryLanguageOfInstruction: '',
          attendedFrom: '',
          attendedTo: '',
          degreeName: '',
          hasGraduated: 'Yes',
          graduationDate: '',
          hasPhysicalCertificate: false,
          address: '',
          cityTown: '',
          province: '',
          postalZipCode: ''
        });
      }
    } catch (error: any) {
      console.error(`Error ${editingSchoolId ? 'updating' : 'adding'} school:`, error);
      
      // Handle validation errors (422) with field-specific mapping
      if (error.response?.status === 422) {
        const apiErrors = error.response?.data?.errors || error.response?.data?.message;
        const fieldMapping: Record<string, string> = {
          country_of_institution: 'countryOfInstitution',
          name_of_institution: 'nameOfInstitution',
          level_of_education: 'levelOfEducation',
          primary_language_of_instruction: 'primaryLanguageOfInstruction',
          attended_institution_from: 'attendedFrom',
          attended_institution_to: 'attendedTo',
          degree_name: 'degreeName',
          address: 'address',
          city: 'cityTown',
          state: 'province',
          zipcode: 'postalZipCode'
        };
        const mappedErrors = mapApiErrorsToFormFields(apiErrors, fieldMapping);
        setSchoolErrors(mappedErrors);
      } else {
        // For non-422 errors, show general error on first field
        setSchoolErrors({ countryOfInstitution: error.response?.data?.message || error.message || 'An error occurred. Please try again.' });
      }
    } finally {
      setIsSavingSchool(false);
    }
  };

  const handleCancelSchool = () => {
    setShowAddSchoolForm(false);
    setEditingSchoolId(null);
    setSchoolErrors({}); // Clear errors
    setSchoolFormData({
      countryOfInstitution: '',
      nameOfInstitution: '',
      levelOfEducation: '',
      primaryLanguageOfInstruction: '',
      attendedFrom: '',
      attendedTo: '',
      degreeName: '',
      hasGraduated: 'Yes',
      graduationDate: '',
      hasPhysicalCertificate: false,
      address: '',
      cityTown: '',
      province: '',
      postalZipCode: ''
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleEditSchool = (school: any) => {
    setEditingSchoolId(school.id);
    setShowAddSchoolForm(true);
    setSchoolErrors({}); // Clear errors when editing
    setSchoolFormData({
      countryOfInstitution: school.country_of_institution || school.countryOfInstitution || '',
      nameOfInstitution: school.name_of_institution || school.nameOfInstitution || '',
      levelOfEducation: school.level_of_education || school.levelOfEducation || '',
      primaryLanguageOfInstruction: school.primary_language_of_instruction || school.primaryLanguageOfInstruction || '',
      attendedFrom: school.attended_institution_from || school.attendedFrom || '',
      attendedTo: school.attended_institution_to || school.attendedTo || '',
      degreeName: school.degree_name || school.degreeName || '',
      hasGraduated: school.graduated_from_this === 1 || school.graduated_from_this === '1' || school.hasGraduated === 'Yes' ? 'Yes' : 'No',
      graduationDate: school.graduation_date || school.graduationDate || '',
      hasPhysicalCertificate: school.have_physical_certificate === 1 || school.have_physical_certificate === '1' || school.hasPhysicalCertificate || false,
      address: school.address || '',
      cityTown: school.city || school.cityTown || '',
      province: school.state || school.province || '',
      postalZipCode: school.zipcode || school.postalZipCode || ''
    });
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById('school-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleDeleteSchool = async (schoolId: string | number) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      try {
        const response = await deleteSchool(schoolId);
        
        if (response.status) {
          alert(response.message || 'School deleted successfully!');
          // Fetch updated schools from API
          await fetchAttendedSchools();
        } else {
          alert('Failed to delete school: ' + (response.message || 'Unknown error'));
        }
      } catch (error: any) {
        console.error('Error deleting school:', error);
        alert(`Failed to delete school: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      }
    }
  };

  // Function to fetch attended schools from API
  const fetchAttendedSchools = async () => {
    try {
      const response = await getAttendedSchools();
      // Handle different possible response structures
      const schools = (response.data && response.data.schools) ? response.data.schools : [];
      
      if (Array.isArray(schools) && schools.length > 0) {
        // Map API response to component state format
        const mappedSchools = schools.map((school) => ({
          id: school.id?.toString() || String(Date.now() + Math.random()),
          countryOfInstitution: school.country_of_institution || '',
          nameOfInstitution: school.name_of_institution || '',
          levelOfEducation: school.level_of_education || '',
          primaryLanguageOfInstruction: school.primary_language_of_instruction || '',
          attendedFrom: school.attended_institution_from || '',
          attendedTo: school.attended_institution_to || '',
          degreeName: school.degree_name || '',
          hasGraduated: school.graduated_from_this === 1 ? 'Yes' : 'No',
          graduationDate: school.graduation_date || '',
          hasPhysicalCertificate: school.have_physical_certificate === 1,
          address: school.address || '',
          cityTown: school.city || '',
          province: school.state || '',
          postalZipCode: school.zipcode || ''
        }));
        setAttendedSchools(mappedSchools);
      } else {
        setAttendedSchools([]);
      }
    } catch (error: any) {
      console.error('Error fetching attended schools:', error);
      // Only show error if we already have schools loaded (refresh scenario)
      // On initial load, just set empty array silently
      const currentSchoolsCount = attendedSchools.length;
      if (currentSchoolsCount > 0) {
        setError('Failed to refresh schools data. Please try again.');
      } else {
        // On initial load, just set empty array
        setAttendedSchools([]);
      }
    }
  };

  const fetchStudentDocuments = async () => {
    try {
      const response = await getStudentDocuments();
      const documents = response?.data?.student_documents || response?.student_documents || [];

      if (Array.isArray(documents)) {
        setStudentDocuments(documents);
      } else {
        setStudentDocuments([]);
      }
    } catch (error: any) {
      console.error('Error fetching student documents:', error);
      // keep existing documents to avoid clearing on transient errors
    }
  };

  // Check authentication on mount and redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      redirectToAuth();
      return;
    }
  }, []);

  // Fetch student profile data and attended schools on component mount
  useEffect(() => {
    // Don't fetch if not authenticated
    if (!isAuthenticated()) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [profileResponse, personalInformation] = await Promise.all([
          getStudentProfile(),
          getPersonalInformation().catch(() => null)
        ]);

        const student = profileResponse.data.student;

        populateFormDataFromProfile(student, personalInformation || undefined);

        // Fetch attended schools
        await fetchAttendedSchools();
        await fetchStudentDocuments();
      } catch (err: any) {
        console.error('Error fetching student data:', err);
        // If unauthorized, redirect to auth
        if (err.response?.status === 401 || err.response?.status === 403) {
          redirectToAuth();
          return;
        }
        setError(err.response?.data?.message || 'Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync ref with state
  useEffect(() => {
    isStickyRef.current = isSticky;
  }, [isSticky]);

  // Measure tabs height and original position on mount and resize
  useEffect(() => {
    const measureTabs = () => {
      if (tabsRef.current && !isStickyRef.current) {
        setTabsHeight(tabsRef.current.offsetHeight);
        // Store the original top position relative to the document
        const rect = tabsRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setTabsOriginalTop(rect.top + scrollTop);
      }
    };

    // Measure on mount
    const timer = setTimeout(measureTabs, 100);
    
    // Measure on resize
    window.addEventListener('resize', measureTabs);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', measureTabs);
    };
  }, [isSticky]);

  // Handle scroll detection for sticky tabs
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('header');
      if (header) {
        setHeaderHeight(header.getBoundingClientRect().height);
      }
    };

    const handleScroll = () => {
      if (tabsRef.current && tabsContainerRef.current && tabsOriginalTop > 0) {
        const header = document.querySelector('header');
        const currentHeaderHeight = header ? header.getBoundingClientRect().height : headerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Calculate where the tabs would be in the viewport based on their original document position
        // tabsOriginalTop is the absolute position in the document
        // tabsViewportTop is where they would appear in the viewport
        const tabsViewportTop = tabsOriginalTop - scrollTop;
        
        // Update tabs height when they're about to become sticky (still in normal flow)
        if (!isStickyRef.current && tabsViewportTop <= currentHeaderHeight + 10 && tabsRef.current) {
          setTabsHeight(tabsRef.current.offsetHeight);
        }
        
        // Tabs should stick when their viewport position would be at or above the header
        const shouldBeSticky = tabsViewportTop <= currentHeaderHeight;
        
        if (shouldBeSticky && !isStickyRef.current) {
          setIsSticky(true);
        } else if (!shouldBeSticky && isStickyRef.current) {
          setIsSticky(false);
        }
      }
    };

    // Update header height and original position on mount and resize
    updateHeaderHeight();
    if (tabsRef.current && tabsOriginalTop === 0) {
      const rect = tabsRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setTabsOriginalTop(rect.top + scrollTop);
    }
    
    window.addEventListener('resize', () => {
      updateHeaderHeight();
      // Recalculate original position on resize (only when not sticky)
      if (tabsRef.current && !isStickyRef.current) {
        const rect = tabsRef.current.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setTabsOriginalTop(rect.top + scrollTop);
      }
    });
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerHeight, isSticky, tabsOriginalTop]);

  const renderPersonalInformation = () => (
    <div id="general" className="space-y-6 scroll-mt-8">
      {/* Combined Personal Information and Address Detail Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        {/* Personal Information Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-black-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black-600">Personal Information</h3>
              <p className="text-sm text-gray-600">Fill in your personal and passport details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Anup Singh"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {personalInfoErrors.fullName && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-pink-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="heron12609@aminating.com"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {personalInfoErrors.email && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile <span className="text-pink-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => handleInputChange('countryCode', e.target.value)}
                    className={`w-24 px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      personalInfoErrors.countryCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Code</option>
                    <option value="91">+91</option>
                    <option value="1">+1</option>
                    <option value="44">+44</option>
                  </select>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    placeholder="8804204365"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      personalInfoErrors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
              {(personalInfoErrors.countryCode || personalInfoErrors.mobile) && (
                <p className="mt-1 text-sm text-red-600">
                  {personalInfoErrors.countryCode || personalInfoErrors.mobile}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Father Name <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fatherName}
                onChange={(e) => handleInputChange('fatherName', e.target.value)}
                placeholder="Father Name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.fatherName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {personalInfoErrors.fatherName && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.fatherName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mother Name <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={formData.motherName}
                onChange={(e) => handleInputChange('motherName', e.target.value)}
                placeholder="Mother Name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.motherName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {personalInfoErrors.motherName && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.motherName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    personalInfoErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input && input.type === 'date') {
                      if (input.showPicker) {
                        input.showPicker();
                      } else {
                        input.focus();
                        input.click();
                      }
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                  aria-label="Open date picker"
                >
                </button>
              </div>
              {personalInfoErrors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Language <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstLanguage}
                onChange={(e) => handleInputChange('firstLanguage', e.target.value)}
                placeholder="First Language"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.firstLanguage ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {personalInfoErrors.firstLanguage && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.firstLanguage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country of Citizenship <span className="text-pink-500">*</span>
              </label>
              <select
                value={formData.countryOfCitizenship}
                onChange={(e) => handleInputChange('countryOfCitizenship', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.countryOfCitizenship ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Country</option>
                <option value="INDIA">INDIA</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
              {personalInfoErrors.countryOfCitizenship && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.countryOfCitizenship}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Number <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                placeholder="Passport Number"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.passportNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {personalInfoErrors.passportNumber && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.passportNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passport Expiry Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.passportExpiryDate}
                  onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)}
                  placeholder="Passport Expiry Date"
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input && input.type === 'date') {
                      if (input.showPicker) {
                        input.showPicker();
                      } else {
                        input.focus();
                        input.click();
                      }
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                  aria-label="Open date picker"
                >
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marital Status <span className="text-pink-500">*</span>
              </label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.maritalStatus ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
              {personalInfoErrors.maritalStatus && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.maritalStatus}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-pink-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {personalInfoErrors.gender && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.gender}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Detail Section */}
        <div className="space-y-6 pt-8 border-t border-gray-200 mt-8">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-xl font-semibold text-black-600">Address Detail</h3>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              Please make sure to enter the student's residential address. Organization address will not be accepted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter Address"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {personalInfoErrors.address && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={formData.cityTown}
                onChange={(e) => handleInputChange('cityTown', e.target.value)}
                placeholder="Enter City"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.cityTown ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {personalInfoErrors.cityTown && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.cityTown}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={formData.provinceState}
                onChange={(e) => handleInputChange('provinceState', e.target.value)}
                placeholder="Enter State"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.provinceState ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {personalInfoErrors.provinceState && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.provinceState}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className="text-pink-500">*</span>
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Country</option>
                <option value="INDIA">India</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
              {personalInfoErrors.country && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.country}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal / Zipcode
              </label>
              <input
                type="text"
                value={formData.postalZipCode}
                onChange={(e) => handleInputChange('postalZipCode', e.target.value)}
                placeholder="Enter Postal / Zipcode"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Contact Number <span className="text-pink-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.homeContactNumber}
                onChange={(e) => handleInputChange('homeContactNumber', e.target.value)}
                placeholder="Enter Home Contact Number"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  personalInfoErrors.homeContactNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {personalInfoErrors.homeContactNumber && (
                <p className="mt-1 text-sm text-red-600">{personalInfoErrors.homeContactNumber}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave('Personal Information and Address Detail')}
            className="px-6 py-2.5 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors w-full sm:w-auto"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  const renderEducationSummary = () => (
    <div id="education" className="space-y-6 scroll-mt-8">
      <h3 className="text-xl font-semibold text-gray-900">Education Summary</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country of Education <span className="text-pink-500">*</span>
          </label>
          <select
            value={formData.countryOfEducation}
            onChange={(e) => handleInputChange('countryOfEducation', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
              educationErrors.countryOfEducation ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select</option>
            <option value="INDIA">India</option>
            <option value="USA">United States</option>
            <option value="UK">United Kingdom</option>
          </select>
          {educationErrors.countryOfEducation && (
            <p className="mt-1 text-sm text-red-600">{educationErrors.countryOfEducation}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highest Level of Education <span className="text-pink-500">*</span>
          </label>
          <select
            value={formData.highestLevelOfEducation}
            onChange={(e) => handleInputChange('highestLevelOfEducation', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
              educationErrors.highestLevelOfEducation ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select</option>
            <option value="High School">High School</option>
            <option value="Bachelor's">Bachelor's Degree</option>
            <option value="Master's">Master's Degree</option>
            <option value="PhD">PhD</option>
          </select>
          {educationErrors.highestLevelOfEducation && (
            <p className="mt-1 text-sm text-red-600">{educationErrors.highestLevelOfEducation}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grading Scheme <span className="text-pink-500">*</span>
          </label>
          <select
            value={formData.gradingScheme}
            onChange={(e) => handleInputChange('gradingScheme', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
              educationErrors.gradingScheme ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select</option>
            <option value="Percentage">Percentage</option>
            <option value="CGPA">CGPA</option>
            <option value="GPA">GPA</option>
          </select>
          {educationErrors.gradingScheme && (
            <p className="mt-1 text-sm text-red-600">{educationErrors.gradingScheme}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade Average <span className="text-pink-500">*</span>
          </label>
          <input
            type="text"
            value={formData.gradeAverage}
            onChange={(e) => handleInputChange('gradeAverage', e.target.value)}
            placeholder="Enter Grade Average"
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
              educationErrors.gradeAverage ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {educationErrors.gradeAverage && (
            <p className="mt-1 text-sm text-red-600">{educationErrors.gradeAverage}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave('Education Summary')}
          disabled={isSaving}
          className="px-6 py-2.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : "Save"}
        </button>
      </div>
    </div>
  );

  const renderSchoolsAttended = () => (
    <div className="space-y-6 pt-8 border-t border-gray-200 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-semibold text-gray-900">Schools Attended</h3>
        <button 
          onClick={() => {
            setShowAddSchoolForm(!showAddSchoolForm);
            setEditingSchoolId(null);
            if (!showAddSchoolForm) {
              // Reset form when opening
              setSchoolErrors({}); // Clear errors when opening
              setSchoolFormData({
                countryOfInstitution: '',
                nameOfInstitution: '',
                levelOfEducation: '',
                primaryLanguageOfInstruction: '',
                attendedFrom: '',
                attendedTo: '',
                degreeName: '',
                hasGraduated: 'Yes',
                graduationDate: '',
                hasPhysicalCertificate: false,
                address: '',
                cityTown: '',
                province: '',
                postalZipCode: ''
              });
            }
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 w-full sm:w-auto"
        >
          <span>Add Attended School</span>
          <span className="text-xl">+</span>
        </button>
      </div>

      {/* Inline Form */}
      {showAddSchoolForm && renderAddSchoolForm()}

      {attendedSchools.length === 0 && !showAddSchoolForm && (
        <div className="text-center py-8 text-gray-500">
          No schools added yet. Click "Add Attended School +" to add one.
        </div>
      )}

      {attendedSchools.length > 0 && (
        <div className="space-y-4">
          {attendedSchools.map((school) => (
            <div key={school.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold text-gray-900 text-lg">
                    {school.nameOfInstitution || 'N/A'}
                  </h4>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Degree:</span> {school.degreeName || 'N/A'}
                  </p>
                  {school.levelOfEducation && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Level:</span> {school.levelOfEducation}
                    </p>
                  )}
                  {school.attendedFrom && school.attendedTo && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Attended from</span> {formatDate(school.attendedFrom)} <span className="font-medium">to</span> {formatDate(school.attendedTo)}
                    </p>
                  )}
                  {school.primaryLanguageOfInstruction && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Language of instruction:</span> {school.primaryLanguageOfInstruction}
                    </p>
                  )}
                  {school.address && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Address:</span> {school.address}
                      {school.cityTown && `, ${school.cityTown}`}
                      {school.province && `, ${school.province}`}
                      {school.postalZipCode && ` ${school.postalZipCode}`}
                    </p>
                  )}
                  {school.countryOfInstitution && (
                    <p className="text-sm text-gray-700 font-medium">
                      {school.countryOfInstitution}
                    </p>
                  )}
                  {school.hasGraduated && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Has Graduated:</span> {school.hasGraduated}
                    </p>
                  )}
                  {school.hasGraduated === 'Yes' && school.graduationDate && (
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Graduation Date:</span> {formatDate(school.graduationDate)}
                    </p>
                  )}
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Has Physical Certificate:</span> {school.hasPhysicalCertificate ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEditSchool(school)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSchool(school.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddSchoolForm = () => (
    <div id="school-form" className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Schools Attended Section */}
      <div className="space-y-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-900">
          {editingSchoolId ? 'Edit Attended School' : 'Add Attended School'}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country of Institution <span className="text-red-500">*</span>
            </label>
            <select
              value={schoolFormData.countryOfInstitution}
              onChange={(e) => handleSchoolInputChange('countryOfInstitution', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                schoolErrors.countryOfInstitution ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select</option>
              <option value="INDIA">India</option>
              <option value="USA">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CANADA">Canada</option>
            </select>
            {schoolErrors.countryOfInstitution && (
              <p className="mt-1 text-sm text-red-600">{schoolErrors.countryOfInstitution}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name of Institution <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={schoolFormData.nameOfInstitution}
              onChange={(e) => handleSchoolInputChange('nameOfInstitution', e.target.value)}
              placeholder="Enter Name of Institution"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                schoolErrors.nameOfInstitution ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {schoolErrors.nameOfInstitution && (
              <p className="mt-1 text-sm text-red-600">{schoolErrors.nameOfInstitution}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level of Education <span className="text-red-500">*</span>
            </label>
            <select
              value={schoolFormData.levelOfEducation}
              onChange={(e) => handleSchoolInputChange('levelOfEducation', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                schoolErrors.levelOfEducation ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select</option>
              <option value="High School">High School</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor's">Bachelor's Degree</option>
              <option value="Master's">Master's Degree</option>
              <option value="PhD">PhD</option>
            </select>
            {schoolErrors.levelOfEducation && (
              <p className="mt-1 text-sm text-red-600">{schoolErrors.levelOfEducation}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Language of Instruction <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={schoolFormData.primaryLanguageOfInstruction}
              onChange={(e) => handleSchoolInputChange('primaryLanguageOfInstruction', e.target.value)}
              placeholder="Enter Primary Language of Instruction"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                schoolErrors.primaryLanguageOfInstruction ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {schoolErrors.primaryLanguageOfInstruction && (
              <p className="mt-1 text-sm text-red-600">{schoolErrors.primaryLanguageOfInstruction}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attended Institution From <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={schoolFormData.attendedFrom}
                onChange={(e) => handleSchoolInputChange('attendedFrom', e.target.value)}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  schoolErrors.attendedFrom ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input && input.type === 'date') {
                    input.showPicker?.();
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                aria-label="Open date picker"
              >
              </button>
            </div>
            {schoolErrors.attendedFrom && (
              <p className="mt-1 text-sm text-red-600">{schoolErrors.attendedFrom}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attended Institution To <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={schoolFormData.attendedTo}
                onChange={(e) => handleSchoolInputChange('attendedTo', e.target.value)}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  schoolErrors.attendedTo ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input && input.type === 'date') {
                    input.showPicker?.();
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                aria-label="Open date picker"
              >
              </button>
            </div>
            {schoolErrors.attendedTo && (
              <p className="mt-1 text-sm text-red-600">{schoolErrors.attendedTo}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Degree Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={schoolFormData.degreeName}
              onChange={(e) => handleSchoolInputChange('degreeName', e.target.value)}
              placeholder="Enter Degree Name"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                schoolErrors.degreeName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {schoolErrors.degreeName && (
              <p className="mt-1 text-sm text-red-600">{schoolErrors.degreeName}</p>
            )}
            <div className="mt-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={schoolFormData.hasPhysicalCertificate}
                  onChange={(e) => handleSchoolInputChange('hasPhysicalCertificate', e.target.checked)}
                  className="w-4 h-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">I have the physical certificate for this degree</span>
              </label>
            </div>
          </div>

          <div className="flex items-end">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I have graduated from this institution <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasGraduated"
                    value="Yes"
                    checked={schoolFormData.hasGraduated === 'Yes'}
                    onChange={(e) => handleSchoolInputChange('hasGraduated', e.target.value)}
                    className="w-4 h-4 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="hasGraduated"
                    value="No"
                    checked={schoolFormData.hasGraduated === 'No'}
                    onChange={(e) => handleSchoolInputChange('hasGraduated', e.target.value)}
                    className="w-4 h-4 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Graduation Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={schoolFormData.graduationDate}
                onChange={(e) => handleSchoolInputChange('graduationDate', e.target.value)}
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input && input.type === 'date') {
                    input.showPicker?.();
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                aria-label="Open date picker"
              >
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* School Address Detail Section */}
      <div className="space-y-6 mb-8">
        <h4 className="text-lg font-semibold text-gray-900">School Address Detail</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={schoolFormData.address}
              onChange={(e) => handleSchoolInputChange('address', e.target.value)}
              placeholder="Enter address"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                schoolErrors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {schoolErrors.address && (
              <p className="mt-1 text-sm text-red-600">{schoolErrors.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City/Town <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={schoolFormData.cityTown}
              onChange={(e) => handleSchoolInputChange('cityTown', e.target.value)}
              placeholder="Enter city"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                schoolErrors.cityTown ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {schoolErrors.cityTown && (
              <p className="mt-1 text-sm text-red-600">{schoolErrors.cityTown}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Province
            </label>
            <input
              type="text"
              value={schoolFormData.province}
              onChange={(e) => handleSchoolInputChange('province', e.target.value)}
              placeholder="Enter State/Province..."
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Postal/Zip Code
            </label>
            <input
              type="text"
              value={schoolFormData.postalZipCode}
              onChange={(e) => handleSchoolInputChange('postalZipCode', e.target.value)}
              placeholder="Enter Postal/Zipcode"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          onClick={handleCancelSchool}
          disabled={isSavingSchool}
          className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveSchool}
          disabled={isSavingSchool}
          className="px-6 py-2.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSavingSchool ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : "Save"}
        </button>
      </div>
    </div>
  );

  const renderTestScores = () => {
    const examType = formData.englishExamType;
    const showFourSkills = examType === 'IELTS' || examType === 'TOEFL' || examType === 'PTE';
    const showOverall = examType === 'PTE' || examType === 'Duolingo';

    return (
      <div id="test" className="space-y-6 scroll-mt-8">
        <h3 className="text-xl font-semibold text-gray-900">Test Scores</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              English Exam Type <span className="text-pink-500">*</span>
            </label>
            <select
              value={formData.englishExamType}
              onChange={(e) => {
                const newExamType = e.target.value;
                // Clear fields when exam type changes
                setFormData(prev => ({
                  ...prev,
                  englishExamType: newExamType,
                  listening: '',
                  reading: '',
                  writing: '',
                  speaking: '',
                  overallScore: ''
                }));
                // Clear errors
                setTestScoreErrors({});
              }}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                testScoreErrors.englishExamType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select</option>
              <option value="IELTS">IELTS</option>
              <option value="TOEFL">TOEFL</option>
              <option value="PTE">PTE</option>
              <option value="Duolingo">Duolingo</option>
            </select>
            {testScoreErrors.englishExamType && (
              <p className="mt-1 text-sm text-red-600">{testScoreErrors.englishExamType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Exam <span className="text-pink-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.dateOfExam}
                onChange={(e) => handleInputChange('dateOfExam', e.target.value)}
                className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  testScoreErrors.dateOfExam ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input && input.type === 'date') {
                    if (input.showPicker) {
                      input.showPicker();
                    } else {
                      input.focus();
                      input.click();
                    }
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                aria-label="Open date picker"
              >
              </button>
            </div>
            {testScoreErrors.dateOfExam && (
              <p className="mt-1 text-sm text-red-600">{testScoreErrors.dateOfExam}</p>
            )}
          </div>

          {showFourSkills && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Listening <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.listening}
                  onChange={(e) => handleInputChange('listening', e.target.value)}
                  placeholder="Enter Exact Score Listening"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    testScoreErrors.listening ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {testScoreErrors.listening && (
                  <p className="mt-1 text-sm text-red-600">{testScoreErrors.listening}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reading <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.reading}
                  onChange={(e) => handleInputChange('reading', e.target.value)}
                  placeholder="Enter Exact Score Reading"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    testScoreErrors.reading ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {testScoreErrors.reading && (
                  <p className="mt-1 text-sm text-red-600">{testScoreErrors.reading}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Writing <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.writing}
                  onChange={(e) => handleInputChange('writing', e.target.value)}
                  placeholder="Enter Exact Score Writing"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    testScoreErrors.writing ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {testScoreErrors.writing && (
                  <p className="mt-1 text-sm text-red-600">{testScoreErrors.writing}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speaking <span className="text-pink-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.speaking}
                  onChange={(e) => handleInputChange('speaking', e.target.value)}
                  placeholder="Enter Exact Score Speaking"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                    testScoreErrors.speaking ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {testScoreErrors.speaking && (
                  <p className="mt-1 text-sm text-red-600">{testScoreErrors.speaking}</p>
                )}
              </div>
            </>
          )}

          {showOverall && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Score <span className="text-pink-500">*</span>
              </label>
              <input
                type="text"
                value={formData.overallScore}
                onChange={(e) => handleInputChange('overallScore', e.target.value)}
                placeholder="Enter Exact overall score"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  testScoreErrors.overallScore ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {testScoreErrors.overallScore && (
                <p className="mt-1 text-sm text-red-600">{testScoreErrors.overallScore}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave('Test Scores')}
            className="px-6 py-2.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors w-full sm:w-auto"
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  const renderUploadDocuments = (documents: any[]) => (
    <div id="documents" className="space-y-6 scroll-mt-8">
      <h3 className="text-xl font-semibold text-gray-900">Upload Documents</h3>
      
      <p className="text-sm text-gray-600">
        The acceptable formats of the photocopy are .PDF, .JPEG or .PNG
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Name
          </label>
          <input
            type="text"
            value={formData.documentName}
            onChange={(e) => handleInputChange('documentName', e.target.value)}
            placeholder="Enter Document Name..."
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
              documentErrors.documentName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {documentErrors.documentName && (
            <p className="mt-1 text-sm text-red-600">{documentErrors.documentName}</p>
          )}
        </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Document
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.uploadedDocument?.name || ''}
              placeholder="Select file"
              readOnly
              className={`flex-1 px-4 py-2.5 border rounded-lg bg-gray-50 ${
                documentErrors.uploadedDocument ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <label className="px-6 py-2.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors cursor-pointer">
              Browse
              <input
                type="file"
                accept=".pdf,.jpeg,.jpg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          {documentErrors.uploadedDocument && (
            <p className="mt-1 text-sm text-red-600">{documentErrors.uploadedDocument}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {documents.length === 0 ? (
          <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-lg p-4">
            No documents uploaded yet. Use the form above to add your documents.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Document Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">File</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Uploaded On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {documents.map((document) => {
                  const documentUrl = document.file_path
                    ? `${IMAGE_BASE_URL}/${document.file_path}`
                    : null;
                  return (
                    <tr key={document.id}>
                      <td className="px-4 py-3 text-sm text-gray-700">{document.document_name || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm">
                        {documentUrl ? (
                          <a
                            href={documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-pink-600 hover:text-pink-700 underline"
                          >
                            {document.file_name || 'View Document'}
                          </a>
                        ) : (
                          <span className="text-gray-500">Not available</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {document.document_status || 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {document.created_at ? formatDate(document.created_at) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
        <button
          onClick={handleCancel}
          className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
        >
          Cancel
        </button>
        <button
          onClick={() => handleSave('Upload Documents')}
          className="px-6 py-2.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors w-full sm:w-auto"
        >
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {flashMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{flashMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-4 py-3 text-sm flex items-center justify-between gap-2 shadow-md">
          <div className="flex items-center gap-2 flex-1 justify-center">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full p-1 transition-colors flex-shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex flex-col lg:flex-row flex-1 relative">
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 bg-gray-100 flex-shrink-0 lg:static">
          <div className="p-4 md:p-6 space-y-6 lg:h-full lg:overflow-y-auto">
            {/* Profile Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-300 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 md:w-8 md:h-8 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Pencil className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </button>
              </div>
              <h2 className="mt-4 text-base md:text-lg font-semibold text-gray-900">{formData.fullName}</h2>
              <p className="text-xs md:text-sm text-gray-600">{formData.email}</p>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveNav('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeNav === 'profile'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <User className="w-5 h-5" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => navigate('/student-dashboard/applied-college')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeNav === 'applied'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Applied colleges</span>
              </button>
              <button
                onClick={() => navigate('/student-dashboard/change-password')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeNav === 'password'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Lock className="w-5 h-5" />
                <span>Change Password</span>
              </button>
              <button
                onClick={() => navigate('/student-dashboard/account-setting')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${
                  activeNav === 'account-setting'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Account settings</span>
              </button>
              <button
                onClick={async () => {
                  try {
                    // Call logout API
                    await logoutStudent();
                  } catch (error) {
                    console.error('Logout error:', error);
                    // Continue with logout even if API call fails
                  } finally {
                    // Clear all auth data
                    clearAuthData();
                    
                    // Use window.location.replace to prevent back button access
                    // This removes the current page from browser history
                    window.location.replace('/auth');
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors text-gray-700 hover:bg-gray-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white min-w-0">
          <div className="p-4 md:p-6 lg:p-8" ref={tabsContainerRef}>
            {/* Placeholder to prevent layout shift when tabs become fixed */}
            {isSticky && tabsHeight > 0 && (
              <div 
                style={{ height: `${tabsHeight}px` }}
                className="mb-6"
              />
            )}

            {/* Top Tabs - Horizontally Scrollable on Mobile */}
            <div 
              ref={tabsRef}
              className={`mb-6 transition-all duration-200 ${
                isSticky 
                  ? 'fixed left-0 right-0 z-40 bg-white shadow-md' 
                  : 'relative'
              }`}
              style={isSticky ? { top: `${headerHeight}px` } : {}}
            >
              <div className={`flex gap-1 border-b border-gray-200 overflow-x-auto scrollbar-hide scroll-smooth ${
                isSticky 
                  ? 'px-4 md:px-6 lg:px-8' 
                  : '-mx-4 md:mx-0 px-4 md:px-0'
              }`}>
                <button
                  onClick={(e) => handleTabClick('general', e.currentTarget)}
                  className={`flex-shrink-0 px-4 md:px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap touch-manipulation ${
                    activeTab === 'general'
                      ? 'border-pink-500 text-pink-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  General Information
                </button>
                <button
                  onClick={(e) => handleTabClick('education', e.currentTarget)}
                  className={`flex-shrink-0 px-4 md:px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap touch-manipulation ${
                    activeTab === 'education'
                      ? 'border-pink-500 text-pink-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Education History
                </button>
                <button
                  onClick={(e) => handleTabClick('test', e.currentTarget)}
                  className={`flex-shrink-0 px-4 md:px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap touch-manipulation ${
                    activeTab === 'test'
                      ? 'border-pink-500 text-pink-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Test Scores
                </button>
                <button
                  onClick={(e) => handleTabClick('documents', e.currentTarget)}
                  className={`flex-shrink-0 px-4 md:px-6 py-3 font-medium transition-colors border-b-2 whitespace-nowrap touch-manipulation ${
                    activeTab === 'documents'
                      ? 'border-pink-500 text-pink-600 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  Upload Documents
                </button>
              </div>
            </div>

          {/* Loading and Error States */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                <p className="mt-4 text-gray-600">Loading profile data...</p>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error loading profile</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Form Content - All sections visible */}
          {!isLoading && (
            <div className="space-y-8">
              {renderPersonalInformation()}
              {renderEducationSummary()}
              {renderSchoolsAttended()}
              {renderTestScores()}
              {renderUploadDocuments(studentDocuments)}
            </div>
          )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

// Export both for backwards compatibility
export default StudentDashboardContainer;
export { StudentDashboardContainer as StudentDashboard };
