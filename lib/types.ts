export type StudentLevel = "primary" | "secondary" | "university";

export type EducationLevel = "diploma" | "degree" | "masters" | "phd";

export type Language = "English" | "Kiswahili";

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface Credential {
  qualification: string;
  institution: string;
  year: number;
}

export interface TutorReview {
  id: string;
  author: string;
  level: StudentLevel;
  rating: number;
  date: string;
  comment: string;
}

export interface Bundle {
  size: number;
  price: number;
  perSession: number;
  saving: number;
}

export interface Tutor {
  username: string;
  fullName: string;
  photo: string;
  headline: string;
  subjects: string[];
  educationLevel: EducationLevel;
  credentials: Credential[];
  teachingStyle: string;
  levels: StudentLevel[];
  languages: Language[];
  rate: number;
  rating: number;
  reviewCount: number;
  sessionsCompleted: number;
  yearsExperience: number;
  availability: Partial<Record<Weekday, string[]>>;
  bundles: Bundle[];
  reviews: TutorReview[];
  featured: boolean;
  verified: boolean;
}

export interface SubjectCategory {
  slug: string;
  name: string;
  icon: string;
  blurb: string;
  tutors: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  kind: "student" | "parent";
  rating: number;
}

export interface BookingRecord {
  reference: string;
  tutorUsername: string;
  tutorName: string;
  subject: string;
  studentLevel: StudentLevel;
  date: string;
  time: string;
  sessionType: "intro" | "full" | "bundle";
  bundleSize?: number;
  amount: number;
  paymentStatus: "paid" | "free" | "pending";
  studentName: string;
  schoolYear: string;
  topic: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  paymentPhone?: string;
  role: "student" | "parent" | "tutor";
  videoLink: string;
  createdAt: string;
}

export interface ProgressNote {
  id: string;
  sessionId: string;
  studentName: string;
  tutorUsername: string;
  note: string;
  createdAt: string;
}
