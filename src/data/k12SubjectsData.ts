import { Course, CourseModule } from '../types/education';

export type K12ClassLevel = '9' | '10' | '11' | '12';
export type K12StreamId = 'pcm' | 'pcb' | 'arts' | 'commerce';

export interface K12SubjectCourse extends Course {
  k12Class: K12ClassLevel;
  k12Stream: K12StreamId;
  subjectName: string;
  subjectHindi: string;
  accessValidity: '12 Months Access';
}

interface SubjectTemplate {
  key: string;
  subjectName: string;
  subjectHindi: string;
  instructor: string;
  instructorRole: string;
  priceInr: number;
  originalPriceInr: number;
  totalHours: number;
  totalMcqs: number;
  imageUrl: string;
  chapters: {
    title: string;
    durationMins: number;
    mcqCount: number;
    keyTopics: string[];
  }[];
}

const IMG_STEM = '/src/assets/images/hero_learning_studio_1793856674745.jpg';
const IMG_COMP = '/src/assets/images/track_competitive_exams_1793856674843.jpg';

const SUBJECT_TEMPLATES: Record<string, SubjectTemplate> = {
  maths: {
    key: 'maths',
    subjectName: 'Mathematics',
    subjectHindi: 'गणित (Mathematics)',
    instructor: 'Prof. R. K. Verma',
    instructorRole: 'M.Sc. Maths · 15 yrs Board & JEE Mentor',
    priceInr: 499,
    originalPriceInr: 999,
    totalHours: 38,
    totalMcqs: 420,
    imageUrl: IMG_STEM,
    chapters: [
      {
        title: '01. Number Systems, Sets & Relations (Free Demo)',
        durationMins: 140,
        mcqCount: 90,
        keyTopics: [
          'Core Theorems & Formula Proofs',
          'NCERT Solved Examples & Shortcuts',
          'Board Exam 5-Mark Questions',
        ],
      },
      {
        title: '02. Algebra, Quadratics & Matrices',
        durationMins: 165,
        mcqCount: 110,
        keyTopics: [
          'Polynomials & Linear Equations',
          'Determinants & Inverse Matrices',
          'Word Problems & Case Studies',
        ],
      },
      {
        title: '03. Trigonometry & Coordinate Geometry',
        durationMins: 175,
        mcqCount: 110,
        keyTopics: [
          'Trigonometric Identities & Heights',
          'Straight Lines, Circles & Conics',
          'Graphical Problem Solving',
        ],
      },
      {
        title: '04. Calculus, Vectors & Probability',
        durationMins: 190,
        mcqCount: 110,
        keyTopics: [
          'Limits, Derivatives & Integration',
          '3D Geometry & Vector Algebra',
          'Bayes Theorem & Probability Distributions',
        ],
      },
    ],
  },
  physics: {
    key: 'physics',
    subjectName: 'Physics',
    subjectHindi: 'भौतिक विज्ञान (Physics)',
    instructor: 'Dr. Priya Nair',
    instructorRole: 'PhD Physics · Senior Board Examiner',
    priceInr: 499,
    originalPriceInr: 999,
    totalHours: 36,
    totalMcqs: 380,
    imageUrl: IMG_STEM,
    chapters: [
      {
        title: '01. Laws of Motion, Electrostatics & Units (Free Demo)',
        durationMins: 145,
        mcqCount: 95,
        keyTopics: [
          'Dimensional Analysis & Kinematics',
          'Newton’s Laws & Gauss’s Theorem',
          'Visual Derivations & Numericals',
        ],
      },
      {
        title: '02. Work, Energy, Gravitation & Current Electricity',
        durationMins: 155,
        mcqCount: 95,
        keyTopics: [
          'Conservation of Mechanical Energy',
          'Kirchhoff’s Laws & Wheatstone Bridge',
          'Circuit Numericals Practice',
        ],
      },
      {
        title: '03. Magnetism, EMI & Thermodynamics',
        durationMins: 160,
        mcqCount: 95,
        keyTopics: [
          'Biot-Savart & Faraday’s Laws',
          'Heat Engines & Carnot Cycle',
          'AC Circuits & Transformers',
        ],
      },
      {
        title: '04. Optics, Waves & Modern Physics',
        durationMins: 170,
        mcqCount: 95,
        keyTopics: [
          'Ray & Wave Optics (YDSE)',
          'Photoelectric Effect & Bohr Model',
          'Semiconductors & Logic Gates',
        ],
      },
    ],
  },
  chemistry: {
    key: 'chemistry',
    subjectName: 'Chemistry',
    subjectHindi: 'रसायन विज्ञान (Chemistry)',
    instructor: 'Dr. Sameer Kulkarni',
    instructorRole: 'PhD Organic Chemistry · 12 yrs Exp',
    priceInr: 499,
    originalPriceInr: 999,
    totalHours: 35,
    totalMcqs: 400,
    imageUrl: IMG_COMP,
    chapters: [
      {
        title: '01. Atomic Structure, Mole Concept & Solutions (Free Demo)',
        durationMins: 140,
        mcqCount: 100,
        keyTopics: [
          'Quantum Numbers & Electronic Configuration',
          'Molarity, Molality & Raoult’s Law',
          'NCERT Back-Exercise Solutions',
        ],
      },
      {
        title: '02. Chemical Bonding, Thermodynamics & Electrochemistry',
        durationMins: 155,
        mcqCount: 100,
        keyTopics: [
          'VSEPR Theory & Hybridization',
          'Nernst Equation & Conductance',
          'Chemical Kinetics & Rate Laws',
        ],
      },
      {
        title: '03. Periodic Table, p-Block & Coordination Compounds',
        durationMins: 150,
        mcqCount: 100,
        keyTopics: [
          'Periodic Trends & Oxidation States',
          'd & f Block Elements',
          'IUPAC Naming & Crystal Field Theory',
        ],
      },
      {
        title: '04. Organic Chemistry: Hydrocarbons, Alcohols & Biomolecules',
        durationMins: 175,
        mcqCount: 100,
        keyTopics: [
          'SN1 vs SN2 Reaction Mechanisms',
          'Aldehydes, Ketones & Carboxylic Acids',
          'Named Reactions & Conversions',
        ],
      },
    ],
  },
  biology: {
    key: 'biology',
    subjectName: 'Biology',
    subjectHindi: 'जीव विज्ञान (Biology)',
    instructor: 'Dr. Ananya Chatterjee',
    instructorRole: 'MBBS, M.Sc. · NEET & Board Specialist',
    priceInr: 499,
    originalPriceInr: 999,
    totalHours: 34,
    totalMcqs: 450,
    imageUrl: IMG_STEM,
    chapters: [
      {
        title: '01. Cell Structure, Biomolecules & Reproduction (Free Demo)',
        durationMins: 135,
        mcqCount: 110,
        keyTopics: [
          'Cell Organelles & Mitosis/Meiosis',
          'Human & Plant Reproduction Diagrams',
          'NCERT Line-by-Line Highlights',
        ],
      },
      {
        title: '02. Genetics, Inheritance & Molecular Basis',
        durationMins: 160,
        mcqCount: 115,
        keyTopics: [
          'Mendelian Laws & Pedigree Analysis',
          'DNA Replication, Transcription & Translation',
          'Lac Operon & Human Genome Project',
        ],
      },
      {
        title: '03. Human Physiology & Plant Physiology',
        durationMins: 165,
        mcqCount: 115,
        keyTopics: [
          'Photosynthesis & Cellular Respiration',
          'Neural Control & Endocrine System',
          'Cardiac Cycle & Excretory System',
        ],
      },
      {
        title: '04. Biotechnology, Immunity & Ecology',
        durationMins: 145,
        mcqCount: 110,
        keyTopics: [
          'Recombinant DNA & PCR Technology',
          'Human Health, Diseases & Vaccines',
          'Ecosystems & Biodiversity Conservation',
        ],
      },
    ],
  },
  accountancy: {
    key: 'accountancy',
    subjectName: 'Accountancy',
    subjectHindi: 'लेखाशास्त्र (Accountancy)',
    instructor: 'CA Rajeshwar Joshi',
    instructorRole: 'Chartered Accountant · 13 yrs Teaching',
    priceInr: 449,
    originalPriceInr: 899,
    totalHours: 32,
    totalMcqs: 320,
    imageUrl: IMG_COMP,
    chapters: [
      {
        title: '01. Accounting Principles, Journal & Ledger (Free Demo)',
        durationMins: 130,
        mcqCount: 80,
        keyTopics: [
          'Golden Rules of Accounting',
          'Trial Balance & Rectification of Errors',
          'Practical Ledger Posting',
        ],
      },
      {
        title: '02. Partnership Firms: Admission, Retirement & Dissolution',
        durationMins: 160,
        mcqCount: 80,
        keyTopics: [
          'Goodwill Valuation Methods',
          'Revaluation Account & Partner Capital',
          'Realisation Account Step-by-Step',
        ],
      },
      {
        title: '03. Company Accounts: Share Capital & Debentures',
        durationMins: 150,
        mcqCount: 80,
        keyTopics: [
          'Issue & Forfeiture of Shares',
          'Pro-Rata Allotment Numericals',
          'Redemption of Debentures',
        ],
      },
      {
        title: '04. Financial Statements & Cash Flow Analysis',
        durationMins: 140,
        mcqCount: 80,
        keyTopics: [
          'Comparative & Common-Size Statements',
          'Accounting Ratios (Liquidity & Solvency)',
          'Cash Flow Statement (AS-3)',
        ],
      },
    ],
  },
  business: {
    key: 'business',
    subjectName: 'Business Studies',
    subjectHindi: 'व्यवसाय अध्ययन (Business Studies)',
    instructor: 'Prof. Meenakshi Iyer',
    instructorRole: 'MBA (IIM) · Commerce Mentor',
    priceInr: 399,
    originalPriceInr: 799,
    totalHours: 26,
    totalMcqs: 300,
    imageUrl: IMG_COMP,
    chapters: [
      {
        title: '01. Nature & Principles of Management (Free Demo)',
        durationMins: 115,
        mcqCount: 75,
        keyTopics: [
          'Fayol’s 14 Principles of Management',
          'Taylor’s Scientific Management',
          'Case-Study Solving Tricks',
        ],
      },
      {
        title: '02. Planning, Organising & Staffing',
        durationMins: 125,
        mcqCount: 75,
        keyTopics: [
          'Types of Plans & Organisational Structure',
          'Delegation vs Decentralisation',
          'Recruitment, Selection & Training',
        ],
      },
      {
        title: '03. Directing, Motivation & Controlling',
        durationMins: 120,
        mcqCount: 75,
        keyTopics: [
          'Maslow’s Need Hierarchy Theory',
          'Leadership Styles & Communication',
          'Controlling Process & Deviations',
        ],
      },
      {
        title: '04. Financial Management & Marketing',
        durationMins: 130,
        mcqCount: 75,
        keyTopics: [
          'Capital Structure & Working Capital',
          'SEBI & Stock Exchange Functions',
          '4 Ps of Marketing & Consumer Protection',
        ],
      },
    ],
  },
  economics: {
    key: 'economics',
    subjectName: 'Economics',
    subjectHindi: 'अर्थशास्त्र (Economics)',
    instructor: 'Dr. Kavita Deshmukh',
    instructorRole: 'PhD Economics · Board & CUET Faculty',
    priceInr: 399,
    originalPriceInr: 799,
    totalHours: 28,
    totalMcqs: 340,
    imageUrl: IMG_COMP,
    chapters: [
      {
        title: '01. Microeconomics: Consumer Equilibrium & Demand (Free Demo)',
        durationMins: 120,
        mcqCount: 85,
        keyTopics: [
          'Utility Analysis & Indifference Curves',
          'Law of Demand & Price Elasticity',
          'Production Function & Cost Curves',
        ],
      },
      {
        title: '02. Macroeconomics: National Income & Money',
        durationMins: 140,
        mcqCount: 85,
        keyTopics: [
          'GDP, GNP & Value-Added Method',
          'Commercial Banks & RBI Credit Control',
          'Aggregate Demand & Multiplier',
        ],
      },
      {
        title: '03. Government Budget & Balance of Payments',
        durationMins: 125,
        mcqCount: 85,
        keyTopics: [
          'Revenue vs Capital Receipts',
          'Fiscal Deficit & Primary Deficit',
          'Foreign Exchange Rate Determination',
        ],
      },
      {
        title: '04. Indian Economic Development (1947–Present)',
        durationMins: 135,
        mcqCount: 85,
        keyTopics: [
          'Five-Year Plans & 1991 LPG Reforms',
          'Human Capital, Rural Development & Employment',
          'India, China & Pakistan Comparative Growth',
        ],
      },
    ],
  },
  history: {
    key: 'history',
    subjectName: 'History',
    subjectHindi: 'इतिहास (History)',
    instructor: 'Prof. Arvind Mehta',
    instructorRole: 'Senior Humanities Mentor · 14 yrs',
    priceInr: 349,
    originalPriceInr: 699,
    totalHours: 25,
    totalMcqs: 300,
    imageUrl: IMG_COMP,
    chapters: [
      {
        title: '01. Harappan Civilisation & Early States (Free Demo)',
        durationMins: 115,
        mcqCount: 75,
        keyTopics: [
          'Indus Valley Town Planning & Seals',
          'Mauryan Empire & Ashokan Inscriptions',
          'Map Work & Source-Based Questions',
        ],
      },
      {
        title: '02. Bhakti-Sufi Traditions & Vijayanagara Empire',
        durationMins: 120,
        mcqCount: 75,
        keyTopics: [
          'Alvars, Nayanars & Kabir-Nanak',
          'Hampi Architecture & Krishnadevaraya',
          'Mughal Court Chronicles (Ain-i-Akbari)',
        ],
      },
      {
        title: '03. Colonialism, 1857 Revolt & Mahatma Gandhi',
        durationMins: 130,
        mcqCount: 75,
        keyTopics: [
          'Permanent Settlement & Santhal Rebellion',
          '1857 Uprising: Causes & Leaders',
          'Non-Cooperation, Dandi March & Quit India',
        ],
      },
      {
        title: '04. Framing the Indian Constitution',
        durationMins: 110,
        mcqCount: 75,
        keyTopics: [
          'Constituent Assembly Debates',
          'Objectives Resolution & Fundamental Rights',
          'Board Long-Answer Writing Format',
        ],
      },
    ],
  },
  polsci: {
    key: 'polsci',
    subjectName: 'Political Science',
    subjectHindi: 'राजनीति विज्ञान (Political Science)',
    instructor: 'Prof. Arvind Mehta',
    instructorRole: 'Polity & Constitution Specialist',
    priceInr: 349,
    originalPriceInr: 699,
    totalHours: 24,
    totalMcqs: 280,
    imageUrl: IMG_COMP,
    chapters: [
      {
        title: '01. Indian Constitution at Work & Rights (Free Demo)',
        durationMins: 110,
        mcqCount: 70,
        keyTopics: [
          'Philosophy of the Constitution',
          'Fundamental Rights & Election Commission',
          'Executive, Legislature & Judiciary',
        ],
      },
      {
        title: '02. Federalism, Local Governments & Political Theory',
        durationMins: 115,
        mcqCount: 70,
        keyTopics: [
          '73rd & 74th Panchayati Raj Amendments',
          'Liberty, Equality, Justice & Secularism',
          'Cartoon & Passage-Based Questions',
        ],
      },
      {
        title: '03. Contemporary World Politics & International Orgs',
        durationMins: 120,
        mcqCount: 70,
        keyTopics: [
          'End of Bipolarity & New Centres of Power',
          'United Nations Reforms & Security',
          'Globalisation & Environment',
        ],
      },
      {
        title: '04. Politics in India Since Independence',
        durationMins: 125,
        mcqCount: 70,
        keyTopics: [
          'Challenges of Nation Building',
          'India’s Foreign Policy & Non-Alignment',
          'Regional Aspirations & Coalition Era',
        ],
      },
    ],
  },
  geography: {
    key: 'geography',
    subjectName: 'Geography',
    subjectHindi: 'भूगोल (Geography)',
    instructor: 'Dr. Nandini Rao',
    instructorRole: 'PhD Geography · Map & GIS Expert',
    priceInr: 349,
    originalPriceInr: 699,
    totalHours: 24,
    totalMcqs: 280,
    imageUrl: IMG_STEM,
    chapters: [
      {
        title: '01. Geomorphology, Climate & Oceans (Free Demo)',
        durationMins: 115,
        mcqCount: 70,
        keyTopics: [
          'Interior of the Earth & Plate Tectonics',
          'Atmospheric Circulation & Monsoon',
          'Ocean Currents & Tides',
        ],
      },
      {
        title: '02. India: Physical Environment & Drainage',
        durationMins: 120,
        mcqCount: 70,
        keyTopics: [
          'Himalayan vs Peninsular Rivers',
          'Natural Vegetation & Soils of India',
          'India Physical Map Practice',
        ],
      },
      {
        title: '03. Human Geography: Population & Settlements',
        durationMins: 115,
        mcqCount: 70,
        keyTopics: [
          'Demographic Transition Theory',
          'Primary, Secondary & Tertiary Activities',
          'Transport, Communication & Trade',
        ],
      },
      {
        title: '04. India: People, Resources & Planning',
        durationMins: 120,
        mcqCount: 70,
        keyTopics: [
          'Water & Mineral Resources',
          'Sustainable Development & Case Studies',
          'World & India Map Marking',
        ],
      },
    ],
  },
  science: {
    key: 'science',
    subjectName: 'Science (Phy + Chem + Bio)',
    subjectHindi: 'विज्ञान (भौतिक, रसायन व जीव विज्ञान)',
    instructor: 'Dr. Priya Nair & Team',
    instructorRole: 'Board Foundation Science Faculty',
    priceInr: 449,
    originalPriceInr: 899,
    totalHours: 32,
    totalMcqs: 360,
    imageUrl: IMG_STEM,
    chapters: [
      {
        title: '01. Matter, Chemical Reactions & Acids-Bases (Free Demo)',
        durationMins: 130,
        mcqCount: 90,
        keyTopics: [
          'Balancing Chemical Equations',
          'Acids, Bases, Salts & pH Scale',
          'Metals, Non-Metals & Carbon Compounds',
        ],
      },
      {
        title: '02. Life Processes, Control & Heredity',
        durationMins: 135,
        mcqCount: 90,
        keyTopics: [
          'Nutrition, Respiration & Circulation',
          'Human Brain & Reflex Arc',
          'Mendel’s Experiments & Evolution',
        ],
      },
      {
        title: '03. Motion, Force, Gravitation & Light',
        durationMins: 140,
        mcqCount: 90,
        keyTopics: [
          'Equations of Motion & Gravitation',
          'Reflection & Refraction (Mirrors & Lenses)',
          'Human Eye & Dispersion of Light',
        ],
      },
      {
        title: '04. Electricity, Magnetism & Our Environment',
        durationMins: 130,
        mcqCount: 90,
        keyTopics: [
          'Ohm’s Law, Series & Parallel Circuits',
          'Magnetic Field Lines & Fleming’s Rules',
          'Food Chains & Ozone Depletion',
        ],
      },
    ],
  },
  english: {
    key: 'english',
    subjectName: 'English Core & Grammar',
    subjectHindi: 'अंग्रेज़ी (English Core & Grammar)',
    instructor: 'Prof. Sarah Thomas',
    instructorRole: 'MA English · Board Examiner',
    priceInr: 299,
    originalPriceInr: 599,
    totalHours: 20,
    totalMcqs: 240,
    imageUrl: IMG_STEM,
    chapters: [
      {
        title: '01. Reading Comprehension & Unseen Passages (Free Demo)',
        durationMins: 95,
        mcqCount: 60,
        keyTopics: [
          'Factual & Case-Based Passage Tricks',
          'Note-Making & Summarising Format',
          'Vocabulary & Inference Questions',
        ],
      },
      {
        title: '02. Creative Writing: Letters, Notices & Articles',
        durationMins: 105,
        mcqCount: 60,
        keyTopics: [
          'Formal Letter to Editor & Job Application',
          'Notice, Invitation & Report Writing',
          'Full-Marks Format Templates',
        ],
      },
      {
        title: '03. Applied Grammar: Tenses, Modals & Clauses',
        durationMins: 100,
        mcqCount: 60,
        keyTopics: [
          'Gap Filling & Editing/Omission',
          'Reported Speech & Determiners',
          'Sentence Transformation',
        ],
      },
      {
        title: '04. Literature: Prose & Poetry Line-by-Line',
        durationMins: 120,
        mcqCount: 60,
        keyTopics: [
          'Poetic Devices & Central Themes',
          'Extract-Based Questions',
          'Character Sketches & Long Answers',
        ],
      },
    ],
  },
};

const STREAM_SUBJECT_KEYS: Record<K12StreamId, string[]> = {
  pcm: ['maths', 'physics', 'chemistry', 'english'],
  pcb: ['physics', 'chemistry', 'biology', 'english'],
  arts: ['history', 'polsci', 'geography', 'economics', 'english'],
  commerce: ['accountancy', 'business', 'economics', 'maths', 'english'],
};

const CLASS9_SUBJECT_KEYS = ['maths', 'science', 'history', 'geography', 'english'];

function buildK12SubjectCourse(
  cls: K12ClassLevel,
  stream: K12StreamId,
  tpl: SubjectTemplate
): K12SubjectCourse {
  const courseId = `k12-c${cls}-${stream}-${tpl.key}`;
  const streamLabel =
    cls === '9'
      ? 'Foundation'
      : stream === 'pcm'
      ? 'PCM'
      : stream === 'pcb'
      ? 'PCB'
      : stream === 'arts'
      ? 'Arts'
      : 'Commerce';

  const modules: CourseModule[] = tpl.chapters.map((ch, idx) => ({
    id: `${courseId}-ch${idx + 1}`,
    title: ch.title,
    durationMins: ch.durationMins,
    mcqCount: ch.mcqCount,
    priceInr: idx === 0 ? 0 : Math.round(tpl.priceInr / 3),
    isFreePreview: idx === 0,
    keyTopics: ch.keyTopics,
    notesText: `Class ${cls} (${streamLabel}) • ${tpl.subjectName} — ${ch.title}\n\nKey Concepts Covered:\n• ${ch.keyTopics.join(
      '\n• '
    )}\n\nNote: Unlocking ${tpl.subjectName} gives you 12 MONTHS ACCESS to all chapters, video lectures, notes & MCQs for Class ${cls}.`,
  }));

  return {
    id: courseId,
    k12Class: cls,
    k12Stream: stream,
    subjectName: tpl.subjectName,
    subjectHindi: tpl.subjectHindi,
    accessValidity: '12 Months Access',
    title: `Class ${cls} ${tpl.subjectName} (${streamLabel}) — All Chapters`,
    hindiTitle: `कक्षा ${cls} ${tpl.subjectHindi} (${streamLabel}) — सभी चैप्टर`,
    subtitle: `Complete Class ${cls} ${tpl.subjectName} syllabus with Chapter 1 Free Demo Video & 12 Months Access to all chapters.`,
    hindiSubtitle: `कक्षा ${cls} ${tpl.subjectName} का पूरा सिलेबस — पहले चैप्टर का फ्री डेमो वीडियो देखें और सभी चैप्टर का 12 महीने का एक्सेस पाएं।`,
    category: 'k12',
    categoryLabel: `Class ${cls} • ${streamLabel}`,
    instructor: tpl.instructor,
    instructorRole: tpl.instructorRole,
    fullPriceInr: tpl.priceInr,
    originalPriceInr: tpl.originalPriceInr,
    totalHours: tpl.totalHours,
    totalMcqs: tpl.totalMcqs,
    rating: '4.9',
    enrolledCount: '12,500+ students',
    imageUrl: tpl.imageUrl,
    modules,
  };
}

export const K12_SUBJECT_COURSES: K12SubjectCourse[] = (() => {
  const list: K12SubjectCourse[] = [];
  const classes: K12ClassLevel[] = ['9', '10', '11', '12'];
  const streams: K12StreamId[] = ['pcm', 'pcb', 'arts', 'commerce'];

  for (const cls of classes) {
    if (cls === '9') {
      for (const key of CLASS9_SUBJECT_KEYS) {
        const tpl = SUBJECT_TEMPLATES[key];
        if (tpl) {
          list.push(buildK12SubjectCourse('9', 'pcm', tpl));
        }
      }
    } else {
      for (const stream of streams) {
        const keys = STREAM_SUBJECT_KEYS[stream];
        for (const key of keys) {
          const tpl = SUBJECT_TEMPLATES[key];
          if (tpl) {
            list.push(buildK12SubjectCourse(cls, stream, tpl));
          }
        }
      }
    }
  }
  return list;
})();
