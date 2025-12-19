
import { Category, ComplianceStatus, Section } from './types';

export const INITIAL_SECTIONS: Section[] = [
  {
    id: 'sec-4',
    title: '4. Context of the Organization',
    items: [
      {
        id: '4.1',
        clause: '4.1',
        title: 'Understanding the organization and its context',
        description: 'Determine external and internal issues that are relevant to its purpose and its strategic direction.',
        tlSpecific: false,
        categories: [Category.GENERAL],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      },
      {
        id: '4.4.1',
        clause: '4.4.1.C.1',
        title: 'QMS Processes',
        description: 'TL 9000 Specific: The organization shall define the scope of the QMS and identify the processes.',
        tlSpecific: true,
        categories: [Category.GENERAL],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      }
    ]
  },
  {
    id: 'sec-5',
    title: '5. Leadership',
    items: [
      {
        id: '5.1.1',
        clause: '5.1.1.C.1',
        title: 'Leadership and Commitment',
        description: 'TL 9000 Specific: Top management shall demonstrate leadership regarding the QMS and customer focus.',
        tlSpecific: true,
        categories: [Category.GENERAL],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      }
    ]
  },
  {
    id: 'sec-7',
    title: '7. Support',
    items: [
      {
        id: '7.1.5',
        clause: '7.1.5.1.C.1',
        title: 'Monitoring and Measuring Resources',
        description: 'Organization shall ensure that the resources provided are suitable for the specific type of monitoring.',
        tlSpecific: true,
        categories: [Category.HARDWARE, Category.SOFTWARE],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      },
      {
        id: '7.3',
        clause: '7.3.C.1',
        title: 'Awareness',
        description: 'TL 9000 Specific: Personnel shall be aware of the relevance and importance of their activities.',
        tlSpecific: true,
        categories: [Category.GENERAL],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      }
    ]
  },
  {
    id: 'sec-8',
    title: '8. Operation',
    items: [
      {
        id: '8.1',
        clause: '8.1.C.1',
        title: 'Operational Planning and Control',
        description: 'Organization shall plan, implement and control the processes needed to meet the requirements.',
        tlSpecific: true,
        categories: [Category.GENERAL],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      },
      {
        id: '8.1.2',
        clause: '8.1.2.S.1',
        title: 'Software Life Cycle Model',
        description: 'A software life cycle model shall be defined and used for software development and maintenance.',
        tlSpecific: true,
        categories: [Category.SOFTWARE],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      },
      {
        id: '8.3.3',
        clause: '8.3.3.C.1',
        title: 'Design and Development Inputs',
        description: 'TL 9000 Specific: Requirements for products and services shall be determined.',
        tlSpecific: true,
        categories: [Category.HARDWARE, Category.SOFTWARE],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      },
      {
        id: '8.5.1',
        clause: '8.5.1.V.1',
        title: 'Service Delivery Planning',
        description: 'The organization shall plan the service delivery activities.',
        tlSpecific: true,
        categories: [Category.SERVICE],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      }
    ]
  },
  {
    id: 'sec-9',
    title: '9. Performance Evaluation',
    items: [
      {
        id: '9.1.2',
        clause: '9.1.2.C.1',
        title: 'Customer Satisfaction',
        description: 'TL 9000 Specific: Monitor customer perceptions of the degree to which their needs are met.',
        tlSpecific: true,
        categories: [Category.GENERAL],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      }
    ]
  },
  {
    id: 'sec-m',
    title: 'TL 9000 Measurements (Book 2)',
    items: [
      {
        id: 'm-1',
        clause: 'M.1',
        title: 'Hardware Measurements',
        description: 'Reporting of hardware performance data (e.g., NPR, FR).',
        tlSpecific: true,
        categories: [Category.HARDWARE],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      },
      {
        id: 'm-2',
        clause: 'M.2',
        title: 'Software Measurements',
        description: 'Reporting of software performance data (e.g., SFQ, SPR).',
        tlSpecific: true,
        categories: [Category.SOFTWARE],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      },
      {
        id: 'm-3',
        clause: 'M.3',
        title: 'Service Measurements',
        description: 'Reporting of service performance data (e.g., SQ, OTD).',
        tlSpecific: true,
        categories: [Category.SERVICE],
        status: ComplianceStatus.PENDING,
        notes: '',
        evidence: '',
        attachments: []
      }
    ]
  }
];
