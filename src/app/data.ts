import { User, Scheme, Candidate, ExamSession } from "../types/types";

export const currentUser: User = {
  id: "u1",
  name: "LPM Admin",
  email: "admin@uin.ac.id",
  role: "admin",
  avatar: "AD",
};

export const schemesData: Scheme[] = [
  {
    id: "1",
    code: "CERT-01",
    name: "Jenjang 5 Bidang Kewirausahaan Industri",
    category: "Industri",
    status: "Active",
    applicantsCount: 156,
  },
  {
    id: "2",
    code: "CERT-02",
    name: "Melaksanakan Komunikasi Dengan Pemangku Kepentingan",
    category: "Komunikasi",
    status: "Active",
    applicantsCount: 89,
  },
  {
    id: "3",
    code: "CERT-03",
    name: "Penerjemah Teks Umum",
    category: "Bahasa",
    status: "Active",
    applicantsCount: 42,
  },
  {
    id: "4",
    code: "CERT-04",
    name: "Auditor Halal",
    category: "Sertifikasi Halal",
    status: "Active",
    applicantsCount: 214,
  },
  {
    id: "5",
    code: "CERT-05",
    name: "Penyelia Halal",
    category: "Sertifikasi Halal",
    status: "Active",
    applicantsCount: 120,
  },
];

export const candidatesData: Candidate[] = [
  {
    id: "#AS-2024-001",
    name: "John Doe",
    scheme: "Jenjang 5 Bidang Kewirausahaan Industri",
    submissionDate: "Oct 24, 2023",
    status: "Pending Review",
    avatar: "JD",
  },
  {
    id: "#AS-2024-042",
    name: "Sarah Miller",
    scheme: "Penyelia Halal",
    submissionDate: "Oct 22, 2023",
    status: "In Progress",
    avatar: "SM",
  },
  {
    id: "#AS-2024-019",
    name: "Benjamin Wong",
    scheme: "Auditor Halal",
    submissionDate: "Oct 21, 2023",
    status: "Revision Required",
    avatar: "BW",
  },
  {
    id: "#AS-2024-005",
    name: "Alice Tanaka",
    scheme: "Penyelia Halal",
    submissionDate: "Oct 20, 2023",
    status: "Pending Review",
  },
];

export const sessionsData: ExamSession[] = [
  {
    id: "s1",
    date: "Oct 24, 2023",
    time: "14:00 - 15:30",
    title: "Interview: James Wilson",
    subtitle: "Adv. Quantum Mech",
    type: "Interview",
  },
  {
    id: "s2",
    date: "Oct 24, 2023",
    time: "16:15 - 17:00",
    title: "Viva Voce: Linda May",
    subtitle: "Bioinformatics",
    type: "Viva Voce",
  },
];
