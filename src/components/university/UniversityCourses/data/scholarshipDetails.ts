import { ScholarshipDetail } from '../types/scholarship';

export const scholarshipDetails: Record<string, ScholarshipDetail> = {
  'ala-too-merit-scholarship': {
    id: 'merit-scholarship',
    name: 'Merit-Based Scholarship',
    levels: ['MBBS'],
    amount: '$2,000 - $4,000',
    percentage: 30,
    deadline: '2024-06-30',
    eligibility: [
      'NEET qualified with minimum 50th percentile',
      'Class 12 with 75% in PCB subjects',
      'Age between 17-25 years',
      'English proficiency (IELTS 6.0 or equivalent)',
      'Clean medical fitness certificate'
    ],
    seats: '25 seats available',
    applicationMode: 'direct',
    detailsSlug: 'ala-too-merit-scholarship',
    type: 'merit',
    coverage: ['Tuition Fee Reduction', 'Library Access'],
    duration: '6 years',
    renewalConditions: ['Maintain 75% attendance', 'Pass all subjects in first attempt'],
    description: 'The Merit-Based Scholarship at Ala-Too International University is designed to recognize and reward academic excellence among international students pursuing MBBS. This scholarship provides significant financial assistance to deserving candidates who demonstrate outstanding academic performance and commitment to medical education.',
    selectionProcess: {
      steps: [
        'Initial application screening based on academic credentials',
        'NEET score evaluation and percentile ranking',
        'Document verification and authenticity check',
        'Personal interview (online/offline)',
        'Final merit list preparation and announcement'
      ],
      weights: {
        academics: 60,
        interview: 30,
        other: 10
      }
    },
    applicationProcess: {
      steps: [
        'Create account on university admission portal',
        'Fill online application form with personal and academic details',
        'Upload required documents in specified formats',
        'Pay application processing fee ($50 USD)',
        'Submit application and receive confirmation email',
        'Attend interview if shortlisted',
        'Await final decision via email and portal'
      ],
      portalLink: 'https://admissions.alatoo.edu.kg',
      processingTime: '4-6 weeks from application deadline'
    },
    importantDates: {
      applicationOpen: '2024-03-01',
      applicationDeadline: '2024-06-30',
      interviewPeriod: '2024-07-10 to 2024-07-20',
      resultAnnouncement: '2024-07-30',
      feePaymentDeadline: '2024-08-15'
    },
    documentsRequired: {
      mandatory: [
        'Valid passport (minimum 2 years validity)',
        'Class 10th and 12th mark sheets and certificates',
        'NEET scorecard and admit card',
        'Medical fitness certificate',
        'HIV/AIDS negative test report',
        'Statement of Purpose (500-1000 words)',
        'Two letters of recommendation',
        'Bank statements (last 6 months)',
        'Passport size photographs (6 copies)',
        'Birth certificate'
      ],
      optional: [
        'IELTS/TOEFL scorecard',
        'Extracurricular achievement certificates',
        'Volunteer work certificates',
        'Research paper publications (if any)'
      ],
      notes: [
        'All documents must be in English or officially translated',
        'Documents should be notarized/apostilled as per embassy requirements',
        'Scanned copies should be clear and in PDF format (max 2MB each)',
        'Original documents must be carried during travel'
      ]
    },
    incompatibilities: [
      'Cannot be combined with other university scholarships',
      'Not applicable with government quota seats',
      'Excludes students already receiving external funding'
    ],
    postAwardObligations: [
      'Maintain minimum 75% attendance throughout the program',
      'Achieve passing grades in all subjects in first attempt',
      'Participate in university community service (20 hours/semester)',
      'No involvement in disciplinary issues or misconduct'
    ],
    contactInfo: {
      email: 'scholarships@alatoo.edu.kg',
      phone: '+996 312 915000',
      office: 'International Student Office, Main Campus Building'
    },
    countrySpecificNotes: [
      'NEET qualification is mandatory for Indian students',
      'Age limit strictly enforced as per MCI guidelines',
      'Students must register with Indian Embassy in Kyrgyzstan',
      'Annual police verification required for visa renewal'
    ],
    faqs: [
      {
        question: 'Can I apply for this scholarship before my Class 12 final results?',
        answer: 'Yes, you can apply with provisional results, but final admission is subject to meeting the minimum percentage requirement in your final results.'
      },
      {
        question: 'What if my IELTS results arrive after the application deadline?',
        answer: 'IELTS is optional for this scholarship. However, if you choose to submit it, you have a 15-day grace period after the deadline to upload the scorecard.'
      },
      {
        question: 'Is there an interview for all applicants?',
        answer: 'No, only shortlisted candidates based on academic merit will be called for interviews. Approximately 50-60 candidates are typically shortlisted for 25 scholarship seats.'
      },
      {
        question: 'Can I defer my scholarship to the next academic year?',
        answer: 'Scholarship deferral is not allowed. You must join in the academic year for which you applied, or reapply in the next cycle.'
      },
      {
        question: 'What happens if I fail to maintain the renewal conditions?',
        answer: 'If you fail to meet renewal conditions, the scholarship will be discontinued. However, you can continue your studies by paying the full tuition fee.'
      },
      {
        question: 'Are there any refunds if my visa gets rejected?',
        answer: 'Yes, the scholarship amount is fully refundable in case of visa rejection. However, the application processing fee ($50) is non-refundable.'
      }
    ]
  },
  'kyrgyz-state-government-scholarship': {
    id: 'government-scholarship',
    name: 'Government Excellence Scholarship',
    levels: ['MBBS'],
    amount: '$3,500',
    percentage: 50,
    deadline: '2024-07-15',
    eligibility: [
      'NEET score above 400 marks',
      'Class 12 aggregate 80% or above',
      'Age limit: 17-25 years',
      'No backlogs in qualifying exam',
      'Medical fitness as per university standards'
    ],
    seats: '15 seats per intake',
    applicationMode: 'through_ministry',
    detailsSlug: 'kyrgyz-state-government-scholarship',
    type: 'government',
    coverage: ['50% Tuition Waiver', 'Hostel Accommodation', 'Medical Insurance'],
    duration: '6 years',
    renewalConditions: ['GPA above 3.5', '90% attendance', 'No disciplinary issues'],
    description: 'The Government Excellence Scholarship is a prestigious award offered by the Kyrgyz Republic Ministry of Education in collaboration with Kyrgyz State Medical Academy. This scholarship aims to attract high-achieving international students and promote educational cooperation between countries.',
    selectionProcess: {
      steps: [
        'Ministry-level initial screening of applications',
        'Academic credentials verification by education board',
        'NEET score validation and ranking',
        'Embassy interview and background verification',
        'Medical examination by approved panel doctors',
        'Final selection by joint university-ministry committee'
      ],
      weights: {
        academics: 70,
        interview: 20,
        other: 10
      }
    },
    applicationProcess: {
      steps: [
        'Submit application through Kyrgyz Embassy/Consulate',
        'Attend document verification at embassy',
        'Complete online form on ministry education portal',
        'Undergo medical examination at designated centers',
        'Attend embassy interview',
        'Await ministry approval and university confirmation',
        'Complete visa formalities upon selection'
      ],
      processingTime: '8-10 weeks from application submission'
    },
    importantDates: {
      applicationOpen: '2024-04-01',
      applicationDeadline: '2024-07-15',
      interviewPeriod: '2024-07-25 to 2024-08-05',
      resultAnnouncement: '2024-08-20',
      feePaymentDeadline: '2024-09-01'
    },
    documentsRequired: {
      mandatory: [
        'Valid passport with minimum 3 years validity',
        'Apostilled Class 10th and 12th certificates',
        'NEET scorecard (original and certified copy)',
        'Medical fitness certificate from government hospital',
        'HIV/AIDS, Hepatitis B&C negative reports',
        'Statement of Purpose (1000-1500 words)',
        'Three letters of recommendation (academic)',
        'Financial guarantee letter from sponsor',
        'Police clearance certificate',
        'Birth certificate (apostilled)',
        'Passport photographs (10 copies, embassy specification)'
      ],
      optional: [
        'English proficiency test scores',
        'Academic achievement awards',
        'Community service certificates'
      ],
      notes: [
        'All documents must be apostilled as per Hague Convention',
        'Embassy may require additional documents during processing',
        'Medical reports should not be older than 3 months',
        'Financial guarantee must show minimum $15,000 USD'
      ]
    },
    incompatibilities: [
      'Cannot hold any other government scholarship simultaneously',
      'Not available for students with existing study permits',
      'Excludes candidates with previous visa rejections'
    ],
    postAwardObligations: [
      'Serve 2 years in Kyrgyz public healthcare system (optional)',
      'Maintain excellent academic standing (GPA > 3.5)',
      'Participate in cultural exchange programs',
      'Submit annual progress reports to ministry',
      'Complete community health projects (40 hours/year)'
    ],
    contactInfo: {
      email: 'intl.scholarships@med.kg',
      phone: '+996 312 625000',
      office: 'Ministry Liaison Office, KSMA Campus'
    },
    countrySpecificNotes: [
      'Indian students must register with Indian Embassy within 30 days',
      'Annual income certificate required for renewal',
      'Mandatory attendance at embassy cultural events',
      'Special provisions for students from border states'
    ],
    faqs: [
      {
        question: 'Is this scholarship only for Indian students?',
        answer: 'No, this scholarship is open to all international students, but specific quotas may be allocated for different countries based on bilateral agreements.'
      },
      {
        question: 'What is the service commitment after graduation?',
        answer: 'While not mandatory, scholarship recipients are encouraged to serve 2 years in Kyrgyz public healthcare. This can lead to permanent residency opportunities.'
      },
      {
        question: 'Can I work part-time while on this scholarship?',
        answer: 'Part-time work is allowed with proper work permits, but it should not interfere with academic performance or scholarship conditions.'
      },
      {
        question: 'What happens if I want to transfer to another university?',
        answer: 'Transfer is generally not allowed under government scholarships. In exceptional cases, ministry approval is required with valid justification.'
      },
      {
        question: 'Are family members eligible for dependent visas?',
        answer: 'Yes, immediate family members can apply for dependent visas, but they are not covered under the scholarship benefits.'
      },
      {
        question: 'Is the hostel accommodation mandatory?',
        answer: 'Yes, scholarship recipients must stay in designated university hostels for the first two years. Private accommodation is allowed from the third year onwards.'
      }
    ]
  }
};