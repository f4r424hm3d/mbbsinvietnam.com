import { University,  Application, Student } from './index';

export const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Harvard University',
    country: 'United States',
    city: 'Cambridge, MA',
    ranking: 1,
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    courses: [
      {
        id: '1',
        name: 'Computer Science',
        degree: 'Master of Science',
        duration: '2 years',
        tuitionFee: 55000,
        currency: 'USD',
        requirements: ['Bachelor\'s degree', 'GRE scores', 'TOEFL/IELTS'],
        description: 'Advanced computer science program with focus on AI and machine learning.'
      },
      {
        id: '2',
        name: 'Business Administration',
        degree: 'Master of Business Administration',
        duration: '2 years',
        tuitionFee: 73000,
        currency: 'USD',
        requirements: ['Bachelor\'s degree', 'GMAT scores', 'Work experience'],
        description: 'Comprehensive MBA program for future business leaders.'
      }
    ],
    requirements: {
      minGPA: 3.7,
      englishRequirement: 'TOEFL 100+ or IELTS 7.0+',
      documents: ['Transcripts', 'Letters of Recommendation', 'Personal Statement', 'Resume']
    }
  },
  {
    id: '2',
    name: 'University of Oxford',
    country: 'United Kingdom',
    city: 'Oxford',
    ranking: 2,
    logo: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    courses: [
      {
        id: '3',
        name: 'Engineering Science',
        degree: 'Master of Engineering',
        duration: '1 year',
        tuitionFee: 32000,
        currency: 'GBP',
        requirements: ['Bachelor\'s degree in Engineering', 'IELTS 7.0+'],
        description: 'Intensive engineering program with research opportunities.'
      }
    ],
    requirements: {
      minGPA: 3.5,
      englishRequirement: 'IELTS 7.0+ or TOEFL 100+',
      documents: ['Academic Transcripts', 'Personal Statement', 'References']
    }
  },
  {
    id: '3',
    name: 'University of Toronto',
    country: 'Canada',
    city: 'Toronto, ON',
    ranking: 18,
    logo: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    courses: [
      {
        id: '4',
        name: 'Data Science',
        degree: 'Master of Science',
        duration: '16 months',
        tuitionFee: 45000,
        currency: 'CAD',
        requirements: ['Bachelor\'s in related field', 'Programming experience'],
        description: 'Cutting-edge data science program with industry partnerships.'
      }
    ],
    requirements: {
      minGPA: 3.3,
      englishRequirement: 'IELTS 6.5+ or TOEFL 93+',
      documents: ['Transcripts', 'Statement of Purpose', 'Letters of Reference']
    }
  }
];

export const mockStudent: Student = {
  id: '1',
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-123-4567',
    dateOfBirth: '1998-05-15',
    nationality: 'Indian',
    passportNumber: 'A12345678',
    address: {
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      zipCode: '400001'
    }
  },
  academicInfo: {
    currentEducationLevel: 'Bachelor\'s Degree',
    institution: 'Indian Institute of Technology',
    gpa: '3.8',
    graduationDate: '2023-06-15',
    fieldOfStudy: 'Computer Engineering',
    englishProficiency: {
      testType: 'IELTS',
      score: '7.5',
      testDate: '2023-08-20'
    }
  },
  preferences: {
    preferredCountries: ['United States', 'Canada', 'United Kingdom'],
    preferredUniversities: ['Harvard University', 'University of Toronto'],
    intakeYear: '2024',
    intakeSemester: 'Fall'
  }
};

export const mockApplications: Application[] = [
  {
    id: '1',
    studentId: '1',
    universityId: '1',
    courseId: '1',
    status: 'under-review',
    progress: 75,
    submittedDate: '2024-01-15',
    lastUpdated: '2024-02-01',
    documents: [
      {
        id: '1',
        name: 'Academic Transcripts',
        type: 'transcript',
        status: 'verified',
        uploadDate: '2024-01-10',
        fileUrl: '#'
      },
      {
        id: '2',
        name: 'Personal Statement',
        type: 'essay',
        status: 'verified',
        uploadDate: '2024-01-12',
        fileUrl: '#'
      },
      {
        id: '3',
        name: 'Letters of Recommendation',
        type: 'recommendation',
        status: 'pending',
        uploadDate: '2024-01-14',
        fileUrl: '#'
      }
    ],
    timeline: [
      {
        id: '1',
        date: '2024-01-15',
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted.',
        status: 'completed'
      },
      {
        id: '2',
        date: '2024-01-20',
        title: 'Document Verification',
        description: 'Documents are being verified by the admissions team.',
        status: 'completed'
      },
      {
        id: '3',
        date: '2024-02-01',
        title: 'Under Review',
        description: 'Application is currently under review by the admissions committee.',
        status: 'current'
      },
      {
        id: '4',
        date: '2024-02-15',
        title: 'Decision Expected',
        description: 'Admission decision expected by this date.',
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    studentId: '1',
    universityId: '3',
    courseId: '4',
    status: 'accepted',
    progress: 100,
    submittedDate: '2024-01-10',
    lastUpdated: '2024-02-05',
    documents: [
      {
        id: '4',
        name: 'Academic Transcripts',
        type: 'transcript',
        status: 'verified',
        uploadDate: '2024-01-08',
        fileUrl: '#'
      }
    ],
    timeline: [
      {
        id: '5',
        date: '2024-01-10',
        title: 'Application Submitted',
        description: 'Your application has been successfully submitted.',
        status: 'completed'
      },
      {
        id: '6',
        date: '2024-02-05',
        title: 'Accepted',
        description: 'Congratulations! You have been accepted.',
        status: 'completed'
      }
    ],
    offerLetter: {
      id: '1',
      applicationId: '2',
      status: 'received',
      receivedDate: '2024-02-05',
      responseDeadline: '2024-03-05',
      conditions: ['Maintain current GPA', 'Submit final transcripts'],
      tuitionFee: 45000,
      scholarshipAmount: 5000
    }
  }
];