export interface University {
  id: string;
  name: string;
  city: string;
  country: string;
  scholarships: Scholarship[];
}

export interface Scholarship {
  id: string;
  name: string;
  levels: string[];
  amount: string;
  percentage?: number;
  deadline: string;
  eligibility: string[];
  seats: string;
  applicationMode: 'direct' | 'through_university' | 'through_ministry';
  detailsSlug: string;
  type: 'merit' | 'need' | 'government' | 'private' | 'alumni';
  coverage: string[];
  duration: string;
  renewalConditions?: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}
export interface ScholarshipDetail extends Scholarship {
  description: string;
  selectionProcess: {
    steps: string[];
    weights?: {
      academics: number;
      interview: number;
      other: number;
    };
  };
  applicationProcess: {
    steps: string[];
    portalLink?: string;
    processingTime: string;
  };
  importantDates: {
    applicationOpen: string;
    applicationDeadline: string;
    interviewPeriod?: string;
    resultAnnouncement: string;
    feePaymentDeadline: string;
  };
  documentsRequired: {
    mandatory: string[];
    optional: string[];
    notes: string[];
  };
  incompatibilities: string[];
  postAwardObligations: string[];
  contactInfo: {
    email: string;
    phone: string;
    office?: string;
  };
  countrySpecificNotes: string[];
  faqs: FAQItem[];
}