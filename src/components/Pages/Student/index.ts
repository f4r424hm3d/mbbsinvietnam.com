export interface Student {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    nationality: string;
    passportNumber: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  academicInfo: {
    currentEducationLevel: string;
    institution: string;
    gpa: string;
    graduationDate: string;
    fieldOfStudy: string;
    englishProficiency: {
      testType: string;
      score: string;
      testDate: string;
    };
  };
  preferences: {
    preferredCountries: string[];
    preferredUniversities: string[];
    intakeYear: string;
    intakeSemester: string;
  };
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: number;
  logo: string;
  courses: Course[];
  requirements: {
    minGPA: number;
    englishRequirement: string;
    documents: string[];
  };
}

export interface Course {
  id: string;
  name: string;
  degree: string;
  duration: string;
  tuitionFee: number;
  currency: string;
  requirements: string[];
  description: string;
}

export interface Application {
  id: string;
  studentId: string;
  universityId: string;
  courseId: string;
  status: 'draft' | 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'waitlisted';
  progress: number;
  submittedDate?: string;
  lastUpdated: string;
  documents: Document[];
  timeline: TimelineEvent[];
  offerLetter?: OfferLetter;
  visaApplication?: VisaApplication;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadDate?: string;
  fileUrl?: string;
  comments?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

export interface OfferLetter {
  id: string;
  applicationId: string;
  status: 'pending' | 'received' | 'accepted' | 'declined';
  receivedDate?: string;
  responseDeadline?: string;
  conditions?: string[];
  tuitionFee: number;
  scholarshipAmount?: number;
}

export interface VisaApplication {
  id: string;
  applicationId: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'approved' | 'rejected';
  submittedDate?: string;
  appointmentDate?: string;
  visaType: string;
  documents: Document[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  isFromSupport: boolean;
}