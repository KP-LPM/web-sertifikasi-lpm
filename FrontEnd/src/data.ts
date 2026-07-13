export const currentUser: any = {
  id: 'u1',
  name: 'LPM Admin',
  email: 'admin@uin.ac.id',
  role: 'admin',
  avatar: 'AD'
};

export const schemesData: any[] = [
  { id: '1', code: 'CERT-WD-01', name: 'Junior Web Developer', category: 'IT & Software', status: 'Active', applicantsCount: 156 },
  { id: '2', code: 'CERT-DA-04', name: 'Data Analyst Specialist', category: 'Data Science', status: 'Active', applicantsCount: 89 },
  { id: '3', code: 'CERT-CS-02', name: 'Cybersecurity Foundation', category: 'Security', status: 'Draft', applicantsCount: 0 },
  { id: '4', code: 'CERT-DE-05', name: 'UI/UX Designer Certification', category: 'Creative Design', status: 'Active', applicantsCount: 214 },
];

export const candidatesData: any[] = [
  { id: '#AS-2024-001', name: 'John Doe', scheme: 'Junior Web Developer', submissionDate: 'Oct 24, 2023', status: 'Pending Review', avatar: 'JD' },
  { id: '#AS-2024-042', name: 'Sarah Miller', scheme: 'Cloud Infrastructure Assoc.', submissionDate: 'Oct 22, 2023', status: 'In Progress', avatar: 'SM' },
  { id: '#AS-2024-019', name: 'Benjamin Wong', scheme: 'Digital Marketing Specialist', submissionDate: 'Oct 21, 2023', status: 'Revision Required', avatar: 'BW' },
  { id: '#AS-2024-005', name: 'Alice Tanaka', scheme: 'Data Analyst Expert', submissionDate: 'Oct 20, 2023', status: 'Pending Review' },
];

export const sessionsData: any[] = [
  { id: 's1', date: 'Oct 24, 2023', time: '14:00 - 15:30', title: 'Interview: James Wilson', subtitle: 'Adv. Quantum Mech', type: 'Interview' },
  { id: 's2', date: 'Oct 24, 2023', time: '16:15 - 17:00', title: 'Viva Voce: Linda May', subtitle: 'Bioinformatics', type: 'Viva Voce' },
];
