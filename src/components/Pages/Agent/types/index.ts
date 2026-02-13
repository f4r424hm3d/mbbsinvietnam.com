export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  source: 'Website' | 'Referral' | 'Social Media' | 'Agent' | 'Direct';
  status: 'Lead' | 'Application Started' | 'Documents Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Visa Applied' | 'Visa Approved' | 'Enrolled';
  university: string;
  program: string;
  intake: string;
  applicationDate: string;
  lastUpdated: string;
  commission: number;
  agentId: string;
  visaStatus?: 'Not Applied' | 'Applied' | 'Approved' | 'Rejected';
  applicationLink?: string;
  documents?: string[];
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  totalStudents: number;
  totalCommission: number;
  activeApplications: number;
  conversionRate: number;
}

export interface DashboardStats {
  totalLeads: number;
  activeApplications: number;
  totalCommission: number;
  visaApprovals: number;
  conversionRate: number;
  monthlyGrowth: number;
}