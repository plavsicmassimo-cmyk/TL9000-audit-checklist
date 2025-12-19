
export enum ComplianceStatus {
  PENDING = 'PENDING',
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

export enum Category {
  GENERAL = 'GENERAL',
  HARDWARE = 'HARDWARE',
  SOFTWARE = 'SOFTWARE',
  SERVICE = 'SERVICE'
}

export interface ChecklistItem {
  id: string;
  clause: string;
  title: string;
  description: string;
  tlSpecific: boolean;
  categories: Category[];
  status: ComplianceStatus;
  notes: string;
  evidence: string;
  attachments: string[]; // New field for uploaded file names
}

export interface Section {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
