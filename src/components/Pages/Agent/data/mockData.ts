import { Student, Agent, DashboardStats } from '../types';

export const mockAgent: Agent = {
  id: 'agent-001',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@agency.com',
  totalStudents: 156,
  totalCommission: 45600,
  activeApplications: 23,
  conversionRate: 68.5
};

export const mockStudents: Student[] = [
  {
    id: '1',
    name: 'Raj Patel',
    email: 'raj.patel@email.com',
    phone: '+91 98765 43210',
    country: 'India',
    source: 'Website',
    status: 'Under Review',
    university: 'University of Toronto',
    program: 'Computer Science',
    intake: 'Fall 2024',
    applicationDate: '2024-01-15',
    lastUpdated: '2024-01-22',
    commission: 2500,
    agentId: 'agent-001',
    visaStatus: 'Applied',
    applicationLink: 'https://portal.agency.com/apply/1'
  },
  {
    id: '2',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    phone: '+52 55 1234 5678',
    country: 'Mexico',
    source: 'Referral',
    status: 'Documents Submitted',
    university: 'McGill University',
    program: 'Business Administration',
    intake: 'Fall 2024',
    applicationDate: '2024-01-10',
    lastUpdated: '2024-01-21',
    commission: 3000,
    agentId: 'agent-001',
    visaStatus: 'Not Applied'
  },
  {
    id: '3',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1 555 123 4567',
    country: 'USA',
    source: 'Social Media',
    status: 'Lead',
    university: 'University of British Columbia',
    program: 'Engineering',
    intake: 'Spring 2024',
    applicationDate: '2024-01-20',
    lastUpdated: '2024-01-23',
    commission: 0,
    agentId: 'agent-001',
    visaStatus: 'Not Applied'
  },
  {
    id: '4',
    name: 'Li Wei',
    email: 'li.wei@email.com',
    phone: '+86 138 0013 8000',
    country: 'China',
    source: 'Agent',
    status: 'Approved',
    university: 'York University',
    program: 'Data Science',
    intake: 'Fall 2024',
    applicationDate: '2023-12-01',
    lastUpdated: '2024-01-15',
    commission: 2800,
    agentId: 'agent-001',
    visaStatus: 'Approved'
  },
  {
    id: '5',
    name: 'Ahmed Hassan',
    email: 'ahmed.hassan@email.com',
    phone: '+20 10 1234 5678',
    country: 'Egypt',
    source: 'Direct',
    status: 'Application Started',
    university: 'Carleton University',
    program: 'Economics',
    intake: 'Fall 2024',
    applicationDate: '2024-01-18',
    lastUpdated: '2024-01-23',
    commission: 1200,
    agentId: 'agent-001',
    visaStatus: 'Not Applied'
  }
];

export const mockStats: DashboardStats = {
  totalLeads: 156,
  activeApplications: 23,
  totalCommission: 45600,
  visaApprovals: 18,
  conversionRate: 68.5,
  monthlyGrowth: 12.3
};