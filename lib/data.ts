import type {
  BookingRecord,
  EducationLevel,
  SubjectCategory,
  Testimonial,
  Tutor,
  Weekday,
} from "./types";

export const SITE = {
  name: "Nathan Tutors",
  tagline: "The right tutor. Real results.",
  description:
    "Nathan Tutors connects Kenyan students from primary to university level with verified tutors for one-on-one online sessions.",
  whatsapp: "254112272061",
  whatsappMessage:
    "Hello Nathan Tutors, I would like to find a tutor or ask about subjects and pricing.",
  email: "hello@nathan-tutors.co.ke",
  supportHours: "Monday to Saturday, 8:00 AM to 8:00 PM (EAT)",
  consentKey: "nathan_tutors_consent",
} as const;

export const whatsappHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
  SITE.whatsappMessage,
)}`;

export const SUBJECTS: SubjectCategory[] = [
  {
    slug: "mathematics",
    name: "Mathematics",
    icon: "calculator",
    blurb: "Algebra, geometry, calculus and problem solving.",
    tutors: 0,
  },
  {
    slug: "sciences",
    name: "Sciences",
    icon: "flask",
    blurb: "Physics, Chemistry and Biology.",
    tutors: 0,
  },
  {
    slug: "english-and-languages",
    name: "English and Languages",
    icon: "languages",
    blurb: "Comprehension, composition and literature.",
    tutors: 0,
  },
  {
    slug: "kiswahili",
    name: "Kiswahili",
    icon: "bookmark",
    blurb: "Insha, fasihi and set book revision.",
    tutors: 0,
  },
  {
    slug: "history-and-geography",
    name: "History and Geography",
    icon: "globe",
    blurb: "Humanities, map work and essay technique.",
    tutors: 0,
  },
  {
    slug: "business-studies",
    name: "Business Studies",
    icon: "briefcase",
    blurb: "Accounting, commerce and economics.",
    tutors: 0,
  },
  {
    slug: "computer-science",
    name: "Computer Science",
    icon: "code",
    blurb: "Programming, databases and ICT theory.",
    tutors: 0,
  },
  {
    slug: "kcpe-prep",
    name: "KCPE Prep",
    icon: "pencil",
    blurb: "Standard 8 revision and exam practice.",
    tutors: 0,
  },
  {
    slug: "kcse-prep",
    name: "KCSE Prep",
    icon: "target",
    blurb: "Form 3 and Form 4 past paper coaching.",
    tutors: 0,
  },
  {
    slug: "university-units",
    name: "University Units",
    icon: "graduation",
    blurb: "Semester units, CATs and final projects.",
    tutors: 0,
  },
];

const WEEK: Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const WEEKDAYS = WEEK;

export const STUDENT_LEVEL_LABELS = {
  primary: "Primary",
  secondary: "Secondary",
  university: "University",
} as const;

export const EDUCATION_LABELS = {
  diploma: "Diploma",
  degree: "Degree",
  masters: "Masters",
  phd: "PhD",
} as const;

export const EDUCATION_ORDER: EducationLevel[] = [
  "diploma",
  "degree",
  "masters",
  "phd",
];

export const TUTORS: Tutor[] = [
  {
    username: "grace-wanjiru",
    fullName: "Grace Wanjiru",
    photo: "/images/tutor-grace-wanjiru.jpg",
    headline: "Mathematics and Sciences tutor with 7 years of classroom practice",
    subjects: ["Mathematics", "Sciences", "KCSE Prep", "University Units"],
    educationLevel: "masters",
    credentials: [
      {
        qualification: "Master of Science, Applied Mathematics",
        institution: "University of Nairobi",
        year: 2019,
      },
      {
        qualification: "Bachelor of Education, Science",
        institution: "Kenyatta University",
        year: 2014,
      },
    ],
    teachingStyle:
      "I start every lesson with a short diagnostic question so we both know exactly where the gap is. From there we work through the concept slowly, then move to exam style questions under timed conditions. Students leave with a written summary and two practice questions for the week.",
    levels: ["secondary", "university"],
    languages: ["English", "Kiswahili"],
    rate: 1800,
    rating: 4.9,
    reviewCount: 128,
    sessionsCompleted: 642,
    yearsExperience: 7,
    availability: {
      Monday: ["4:00 PM", "5:30 PM", "7:00 PM"],
      Tuesday: ["7:00 AM", "4:00 PM"],
      Wednesday: ["4:00 PM", "5:30 PM", "7:00 PM"],
      Thursday: ["7:00 AM"],
      Friday: ["4:00 PM", "5:30 PM"],
      Saturday: ["9:00 AM", "10:30 AM", "12:00 PM"],
    },
    bundles: [
      { size: 5, price: 8550, perSession: 1710, saving: 450 },
      { size: 10, price: 16200, perSession: 1620, saving: 1800 },
    ],
    reviews: [
      {
        id: "gw-r1",
        author: "Mary N.",
        level: "secondary",
        rating: 5,
        date: "2026-08-14",
        comment:
          "My daughter moved from a D to a B in mathematics within two terms. Grace is patient and very organised with her feedback.",
      },
      {
        id: "gw-r2",
        author: "Collins O.",
        level: "university",
        rating: 5,
        date: "2026-07-22",
        comment:
          "She explains linear algebra in a way that finally made sense. The weekly summary notes were very helpful before my CAT.",
      },
      {
        id: "gw-r3",
        author: "Faith W.",
        level: "secondary",
        rating: 4,
        date: "2026-06-03",
        comment:
          "Very clear on KCSE marking schemes. I only wish the Saturday slots were easier to get.",
      },
    ],
    featured: true,
    verified: true,
  },
  {
    username: "peter-mwangi",
    fullName: "Peter Mwangi",
    photo: "/images/tutor-peter-mwangi.jpg",
    headline: "Physics and Mathematics coach for Form 1 to Form 4",
    subjects: ["Mathematics", "Sciences", "KCSE Prep", "KCPE Prep"],
    educationLevel: "degree",
    credentials: [
      {
        qualification: "Bachelor of Education, Science",
        institution: "Kenyatta University",
        year: 2016,
      },
    ],
    teachingStyle:
      "I believe in concrete examples first. We run through a practical situation, draw the diagram, then build the formula together. I keep a shared question bank so every student works on the same topics their school is covering that week.",
    levels: ["primary", "secondary"],
    languages: ["English", "Kiswahili"],
    rate: 1200,
    rating: 4.8,
    reviewCount: 96,
    sessionsCompleted: 512,
    yearsExperience: 6,
    availability: {
      Monday: ["5:00 PM", "6:30 PM"],
      Tuesday: ["5:00 PM", "6:30 PM"],
      Wednesday: ["5:00 PM"],
      Thursday: ["5:00 PM", "6:30 PM"],
      Friday: ["5:00 PM"],
      Saturday: ["8:00 AM", "9:30 AM", "11:00 AM"],
      Sunday: ["3:00 PM"],
    },
    bundles: [
      { size: 5, price: 5700, perSession: 1140, saving: 300 },
      { size: 10, price: 10800, perSession: 1080, saving: 1200 },
    ],
    reviews: [
      {
        id: "pm-r1",
        author: "Brian K.",
        level: "secondary",
        rating: 5,
        date: "2026-09-02",
        comment:
          "Physics practicals used to scare me. Peter walks through the reasoning until you can do it on your own.",
      },
      {
        id: "pm-r2",
        author: "Jane A.",
        level: "primary",
        rating: 5,
        date: "2026-07-11",
        comment:
          "He is very good with younger learners. My son looks forward to the Saturday lesson.",
      },
      {
        id: "pm-r3",
        author: "Samuel M.",
        level: "secondary",
        rating: 4,
        date: "2026-05-19",
        comment: "Good pace and good examples from past papers.",
      },
    ],
    featured: false,
    verified: true,
  },
  {
    username: "mercy-achieng",
    fullName: "Mercy Achieng",
    photo: "/images/tutor-mercy-achieng.jpg",
    headline: "English and Kiswahili tutor for confident reading and writing",
    subjects: ["English and Languages", "Kiswahili", "KCPE Prep"],
    educationLevel: "masters",
    credentials: [
      {
        qualification: "Master of Arts, Linguistics",
        institution: "University of Nairobi",
        year: 2021,
      },
      {
        qualification: "Bachelor of Arts, Literature",
        institution: "Moi University",
        year: 2015,
      },
    ],
    teachingStyle:
      "Language grows through use, so my lessons are conversational from the first minute. We read a short passage together, unpack the vocabulary, then write. I mark written work line by line and share a short progress note with parents each week.",
    levels: ["primary", "secondary"],
    languages: ["English", "Kiswahili"],
    rate: 1100,
    rating: 4.9,
    reviewCount: 142,
    sessionsCompleted: 703,
    yearsExperience: 9,
    availability: {
      Monday: ["3:30 PM", "5:00 PM"],
      Tuesday: ["3:30 PM", "5:00 PM"],
      Wednesday: ["3:30 PM", "5:00 PM"],
      Thursday: ["3:30 PM"],
      Friday: ["3:30 PM", "5:00 PM"],
      Saturday: ["9:00 AM", "10:30 AM", "2:00 PM"],
    },
    bundles: [
      { size: 5, price: 5225, perSession: 1045, saving: 275 },
      { size: 10, price: 9900, perSession: 990, saving: 1100 },
    ],
    reviews: [
      {
        id: "ma-r1",
        author: "Agnes M.",
        level: "primary",
        rating: 5,
        date: "2026-08-30",
        comment:
          "The weekly progress notes are what made me stay. I can see exactly what my twins are improving on.",
      },
      {
        id: "ma-r2",
        author: "Dennis W.",
        level: "secondary",
        rating: 5,
        date: "2026-06-27",
        comment:
          "Insha used to be my worst area. Mercy gave me a structure that works under exam pressure.",
      },
      {
        id: "ma-r3",
        author: "Linet C.",
        level: "secondary",
        rating: 5,
        date: "2026-04-18",
        comment:
          "Very encouraging and never makes you feel bad for getting it wrong the first time.",
      },
    ],
    featured: true,
    verified: true,
  },
  {
    username: "daniel-ochieng",
    fullName: "Daniel Ochieng",
    photo: "/images/tutor-daniel-ochieng.jpg",
    headline: "Software engineer teaching Computer Science and Business Studies",
    subjects: ["Computer Science", "Business Studies", "University Units"],
    educationLevel: "masters",
    credentials: [
      {
        qualification: "Master of Science, Software Engineering",
        institution: "University of Nairobi",
        year: 2022,
      },
      {
        qualification: "Bachelor of Science, Computer Science",
        institution: "Jomo Kenyatta University of Agriculture and Technology",
        year: 2017,
      },
    ],
    teachingStyle:
      "We build small working things in every session. For programming that means live coding with the student driving, and for business units it means working through real Kenyan case studies. I record the session outline so revision is easy.",
    levels: ["secondary", "university"],
    languages: ["English", "Kiswahili"],
    rate: 2000,
    rating: 4.8,
    reviewCount: 84,
    sessionsCompleted: 388,
    yearsExperience: 6,
    availability: {
      Monday: ["6:00 PM", "7:30 PM"],
      Tuesday: ["6:00 PM"],
      Wednesday: ["6:00 PM", "7:30 PM"],
      Thursday: ["6:00 PM"],
      Friday: ["6:00 PM", "7:30 PM"],
      Saturday: ["10:00 AM", "12:00 PM", "3:00 PM"],
    },
    bundles: [
      { size: 5, price: 9500, perSession: 1900, saving: 500 },
      { size: 10, price: 18000, perSession: 1800, saving: 2000 },
    ],
    reviews: [
      {
        id: "do-r1",
        author: "Victor N.",
        level: "university",
        rating: 5,
        date: "2026-09-10",
        comment:
          "He helped me finish my Java project and explained every part instead of just giving code.",
      },
      {
        id: "do-r2",
        author: "Sheila B.",
        level: "secondary",
        rating: 5,
        date: "2026-07-04",
        comment: "Computer studies theory is finally interesting. Great examples.",
      },
      {
        id: "do-r3",
        author: "Tom G.",
        level: "university",
        rating: 4,
        date: "2026-03-21",
        comment: "Very practical sessions. Booking evening slots helps with work.",
      },
    ],
    featured: true,
    verified: true,
  },
  {
    username: "wanjiku-kamau",
    fullName: "Wanjiku Kamau",
    photo: "/images/tutor-wanjiku-kamau.jpg",
    headline: "Business Studies and KCSE revision specialist",
    subjects: ["Business Studies", "KCSE Prep", "University Units"],
    educationLevel: "masters",
    credentials: [
      {
        qualification: "Master of Business Administration",
        institution: "Strathmore University",
        year: 2018,
      },
      {
        qualification: "Bachelor of Commerce",
        institution: "University of Nairobi",
        year: 2012,
      },
    ],
    teachingStyle:
      "I teach the way examiners think. Each topic ends with a marked past paper question and a short breakdown of where marks are usually lost. For parents, I send a monthly summary of topics covered and the marks trend.",
    levels: ["secondary", "university"],
    languages: ["English"],
    rate: 2200,
    rating: 4.9,
    reviewCount: 73,
    sessionsCompleted: 421,
    yearsExperience: 10,
    availability: {
      Monday: ["7:00 AM", "6:00 PM"],
      Tuesday: ["6:00 PM"],
      Wednesday: ["7:00 AM", "6:00 PM"],
      Thursday: ["6:00 PM"],
      Friday: ["7:00 AM"],
      Saturday: ["9:00 AM", "11:00 AM"],
      Sunday: ["4:00 PM"],
    },
    bundles: [
      { size: 5, price: 10450, perSession: 2090, saving: 550 },
      { size: 10, price: 19800, perSession: 1980, saving: 2200 },
    ],
    reviews: [
      {
        id: "wk-r1",
        author: "Kevin A.",
        level: "secondary",
        rating: 5,
        date: "2026-08-08",
        comment:
          "Her marking scheme notes are gold. I gained two grades in business studies.",
      },
      {
        id: "wk-r2",
        author: "Purity M.",
        level: "university",
        rating: 5,
        date: "2026-05-30",
        comment:
          "Clear, firm and very professional. She keeps you accountable.",
      },
      {
        id: "wk-r3",
        author: "Elijah R.",
        level: "secondary",
        rating: 4,
        date: "2026-02-12",
        comment: "Strict about deadlines but that is exactly what I needed.",
      },
    ],
    featured: true,
    verified: true,
  },
  {
    username: "fatuma-ali",
    fullName: "Fatuma Ali",
    photo: "/images/tutor-fatuma-ali.jpg",
    headline: "Kiswahili, History and Geography tutor for primary and secondary",
    subjects: ["Kiswahili", "History and Geography", "KCPE Prep"],
    educationLevel: "degree",
    credentials: [
      {
        qualification: "Bachelor of Arts, History",
        institution: "Kenyatta University",
        year: 2018,
      },
      {
        qualification: "Postgraduate Diploma in Education",
        institution: "University of Nairobi",
        year: 2020,
      },
    ],
    teachingStyle:
      "I use stories and maps because humanities is about people and places. Students practise essay planning before writing, and we review past paper questions every second lesson. I am happy to teach in Kiswahili or English.",
    levels: ["primary", "secondary"],
    languages: ["Kiswahili", "English"],
    rate: 950,
    rating: 4.7,
    reviewCount: 58,
    sessionsCompleted: 289,
    yearsExperience: 5,
    availability: {
      Monday: ["4:00 PM"],
      Tuesday: ["4:00 PM", "5:30 PM"],
      Wednesday: ["4:00 PM"],
      Thursday: ["4:00 PM", "5:30 PM"],
      Friday: ["4:00 PM"],
      Saturday: ["9:00 AM", "10:30 AM"],
    },
    bundles: [
      { size: 5, price: 4515, perSession: 903, saving: 235 },
      { size: 10, price: 8550, perSession: 855, saving: 950 },
    ],
    reviews: [
      {
        id: "fa-r1",
        author: "Halima S.",
        level: "primary",
        rating: 5,
        date: "2026-09-15",
        comment:
          "My daughter now enjoys Kiswahili. Fatuma is warm and very reliable.",
      },
      {
        id: "fa-r2",
        author: "Joseph K.",
        level: "secondary",
        rating: 4,
        date: "2026-06-14",
        comment:
          "Geography map work is much easier now. I like that she uses past papers.",
      },
      {
        id: "fa-r3",
        author: "Nasra A.",
        level: "secondary",
        rating: 5,
        date: "2026-04-02",
        comment: "Very patient and explains fasihi with real examples.",
      },
    ],
    featured: false,
    verified: true,
  },
  {
    username: "kevin-mutua",
    fullName: "Kevin Mutua",
    photo: "/images/tutor-kevin-mutua.jpg",
    headline: "Biochemistry graduate tutoring Chemistry and Biology",
    subjects: ["Sciences", "Mathematics", "University Units", "KCSE Prep"],
    educationLevel: "degree",
    credentials: [
      {
        qualification: "Bachelor of Science, Biochemistry",
        institution: "University of Nairobi",
        year: 2019,
      },
    ],
    teachingStyle:
      "Science is easier when you can picture it. I use diagrams, short animations and lots of questions. For university students we work through past CATs and lab reports, and I always finish with a five minute recap.",
    levels: ["secondary", "university"],
    languages: ["English", "Kiswahili"],
    rate: 1600,
    rating: 4.8,
    reviewCount: 67,
    sessionsCompleted: 356,
    yearsExperience: 5,
    availability: {
      Monday: ["5:00 PM", "7:00 PM"],
      Tuesday: ["5:00 PM"],
      Wednesday: ["5:00 PM", "7:00 PM"],
      Thursday: ["5:00 PM"],
      Friday: ["5:00 PM", "7:00 PM"],
      Saturday: ["8:30 AM", "10:00 AM", "1:00 PM"],
      Sunday: ["5:00 PM"],
    },
    bundles: [
      { size: 5, price: 7600, perSession: 1520, saving: 400 },
      { size: 10, price: 14400, perSession: 1440, saving: 1600 },
    ],
    reviews: [
      {
        id: "km-r1",
        author: "Cynthia W.",
        level: "secondary",
        rating: 5,
        date: "2026-08-21",
        comment:
          "Organic chemistry finally clicked. He is good at drawing things out step by step.",
      },
      {
        id: "km-r2",
        author: "Alex M.",
        level: "university",
        rating: 5,
        date: "2026-06-09",
        comment: "Helped me prepare for a biochemistry CAT in one week.",
      },
      {
        id: "km-r3",
        author: "Rose N.",
        level: "secondary",
        rating: 4,
        date: "2026-03-27",
        comment: "Friendly and well prepared for every lesson.",
      },
    ],
    featured: false,
    verified: true,
  },
  {
    username: "brian-otieno",
    fullName: "Brian Otieno",
    photo: "/images/tutor-brian-otieno.jpg",
    headline: "KCPE revision coach for Standard 6 to Standard 8",
    subjects: ["KCPE Prep", "Mathematics", "English and Languages"],
    educationLevel: "degree",
    credentials: [
      {
        qualification: "Bachelor of Education, Primary",
        institution: "Mount Kenya University",
        year: 2020,
      },
      {
        qualification: "Diploma in Primary Education",
        institution: "Kenya Institute of Curriculum Development",
        year: 2016,
      },
    ],
    teachingStyle:
      "Younger learners need short, happy lessons. We work in twenty minute blocks with a quick game between them, and I send parents a short note after every session. Past paper practice starts early so there are no surprises in Standard 8.",
    levels: ["primary"],
    languages: ["English", "Kiswahili"],
    rate: 800,
    rating: 4.7,
    reviewCount: 44,
    sessionsCompleted: 198,
    yearsExperience: 4,
    availability: {
      Monday: ["4:00 PM", "5:00 PM"],
      Tuesday: ["4:00 PM"],
      Wednesday: ["4:00 PM", "5:00 PM"],
      Thursday: ["4:00 PM"],
      Friday: ["4:00 PM", "5:00 PM"],
      Saturday: ["9:00 AM", "10:30 AM", "12:00 PM"],
    },
    bundles: [
      { size: 5, price: 3800, perSession: 760, saving: 200 },
      { size: 10, price: 7200, perSession: 720, saving: 800 },
    ],
    reviews: [
      {
        id: "bo-r1",
        author: "Naomi O.",
        level: "primary",
        rating: 5,
        date: "2026-09-06",
        comment:
          "My son is in Standard 7 and actually asks for his lessons now. Brian is very good with children.",
      },
      {
        id: "bo-r2",
        author: "Michael T.",
        level: "primary",
        rating: 4,
        date: "2026-07-19",
        comment: "Affordable and dependable. We see steady improvement.",
      },
      {
        id: "bo-r3",
        author: "Grace A.",
        level: "primary",
        rating: 5,
        date: "2026-05-08",
        comment: "The short notes after each class keep me involved as a parent.",
      },
    ],
    featured: false,
    verified: true,
  },
];

export function subjectCounts(tutors: Tutor[]): SubjectCategory[] {
  return SUBJECTS.map((subject) => ({
    ...subject,
    tutors: tutors.filter((tutor) => tutor.subjects.includes(subject.name)).length,
  }));
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "I was failing mathematics and honestly I had given up. My tutor started from the basics without making me feel small, and I sat my KCSE mock two months later with a B. The video lessons fit around my school day.",
    name: "Achieng O.",
    role: "Form 4 student, Kisumu",
    kind: "student",
    rating: 5,
  },
  {
    id: "t2",
    quote:
      "My university unit on statistics was a nightmare until I booked a tutor here. We met twice a week, went through the past CATs, and I passed with a distinction. It is much easier than travelling across Nairobi for extra lessons.",
    name: "Samuel M.",
    role: "Second year student, Nairobi",
    kind: "student",
    rating: 5,
  },
  {
    id: "t3",
    quote:
      "Booking for my daughter used to mean phone calls and guesswork. Here I compare tutors, read real reviews, and sit in on the free intro session before paying. The progress notes after every lesson mean I always know how she is doing.",
    name: "Agnes W.",
    role: "Parent of a Form 2 student, Nakuru",
    kind: "parent",
    rating: 5,
  },
];

export const STATS = [
  { value: 2400, suffix: "+", label: "Students helped" },
  { value: 18600, suffix: "+", label: "Sessions completed" },
  { value: 10, suffix: "", label: "Subject areas" },
  { value: 4.9, suffix: "/5", label: "Average tutor rating" },
];

export const HOW_IT_WORKS = [
  {
    title: "Search by subject and level",
    body: "Filter tutors by subject, level, price, availability and language, then compare profiles and reviews.",
  },
  {
    title: "Book a free intro session",
    body: "Every tutor offers a free 15 minute intro. Meet the tutor, agree on goals and see if the fit is right.",
  },
  {
    title: "Attend by video call",
    body: "Sessions run one-on-one over video from anywhere in Kenya. No travel, no shared classrooms.",
  },
  {
    title: "Pay per session or buy a bundle",
    body: "Pay per lesson with M-Pesa or save with a 5 or 10 session bundle at a lower per session rate.",
  },
];

export function getTutor(username: string): Tutor | undefined {
  return TUTORS.find((tutor) => tutor.username === username);
}

export function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export function parseRate(rate: number): number {
  return Number.isFinite(rate) ? rate : 0;
}

export const FEATURED_TUTORS = TUTORS.filter((tutor) => tutor.featured).slice(0, 4);

export const DEMO_ACCOUNTS = [
  {
    email: "student@nathan-tutors.co.ke",
    password: "nathan2026",
    name: "Achieng Otieno",
    role: "student" as const,
    label: "Student",
  },
  {
    email: "parent@nathan-tutors.co.ke",
    password: "nathan2026",
    name: "Agnes Wambui",
    role: "parent" as const,
    label: "Parent",
  },
  {
    email: "grace@nathan-tutors.co.ke",
    password: "nathan2026",
    name: "Grace Wanjiru",
    role: "tutor" as const,
    label: "Tutor",
  },
];

export const DEMO_BOOKINGS: BookingRecord[] = [
  {
    reference: "NT-2026-4821",
    tutorUsername: "grace-wanjiru",
    tutorName: "Grace Wanjiru",
    subject: "Mathematics",
    studentLevel: "secondary",
    date: "2026-10-24",
    time: "5:30 PM",
    sessionType: "full",
    amount: 1800,
    paymentStatus: "paid",
    studentName: "Achieng Otieno",
    schoolYear: "Form 4",
    topic: "Calculus: differentiation and rates of change",
    contactName: "Agnes Wambui",
    contactEmail: "parent@nathan-tutors.co.ke",
    contactPhone: "254712000111",
    role: "parent",
    videoLink: "https://meet.nathan-tutors.co.ke/nt-2026-4821",
    createdAt: "2026-10-18T09:20:00.000Z",
  },
  {
    reference: "NT-2026-4790",
    tutorUsername: "kevin-mutua",
    tutorName: "Kevin Mutua",
    subject: "Sciences",
    studentLevel: "secondary",
    date: "2026-10-27",
    time: "5:00 PM",
    sessionType: "intro",
    amount: 0,
    paymentStatus: "free",
    studentName: "Achieng Otieno",
    schoolYear: "Form 4",
    topic: "Organic chemistry revision",
    contactName: "Agnes Wambui",
    contactEmail: "parent@nathan-tutors.co.ke",
    contactPhone: "254712000111",
    role: "parent",
    videoLink: "https://meet.nathan-tutors.co.ke/nt-2026-4790",
    createdAt: "2026-10-16T14:05:00.000Z",
  },
  {
    reference: "NT-2026-4512",
    tutorUsername: "mercy-achieng",
    tutorName: "Mercy Achieng",
    subject: "English and Languages",
    studentLevel: "secondary",
    date: "2026-10-10",
    time: "4:00 PM",
    sessionType: "full",
    amount: 1100,
    paymentStatus: "paid",
    studentName: "Achieng Otieno",
    schoolYear: "Form 4",
    topic: "Composition structure and vivid description",
    contactName: "Agnes Wambui",
    contactEmail: "parent@nathan-tutors.co.ke",
    contactPhone: "254712000111",
    role: "parent",
    videoLink: "https://meet.nathan-tutors.co.ke/nt-2026-4512",
    createdAt: "2026-10-04T11:45:00.000Z",
  },
];

export const DEMO_PROGRESS_NOTES = [
  {
    id: "pn-1",
    sessionId: "NT-2026-4512",
    studentName: "Achieng Otieno",
    tutorUsername: "mercy-achieng",
    note: "Achieng's descriptive writing is much stronger. We worked on varying sentence length and she cut filler words by about a third. Homework: rewrite the market scene in 350 words.",
    createdAt: "2026-10-10T18:10:00.000Z",
  },
  {
    id: "pn-2",
    sessionId: "NT-2026-4821",
    studentName: "Achieng Otieno",
    tutorUsername: "grace-wanjiru",
    note: "Covered differentiation from first principles. She is now confident with the chain rule but should redo question 4 from the 2024 KCSE paper before Thursday.",
    createdAt: "2026-10-18T16:40:00.000Z",
  },
];
