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