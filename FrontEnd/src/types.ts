export type Role = 'admin' | 'asesor' | 'asesi' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  status?: 'Active' | 'Inactive' | 'Pending Verification';
}

export interface Scheme {
  id: string;
  code: string;
  name: string;
  category: string;
  status: 'Active' | 'Draft' | 'Archived';
  applicantsCount: number;
}

export interface Candidate {
  id: string;
  name: string;
  scheme: string;
  submissionDate: string;
  status: 'Pending Review' | 'In Progress' | 'Revision Required' | 'Completed';
  avatar?: string;
}

export interface Session {
  id: string;
  date: string;
  time: string;
  title: string;
  subtitle: string;
  type: 'Interview' | 'Viva Voce' | 'Exam';
}
