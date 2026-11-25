import {
  Course,
  McqSegment,
  DoubtSession,
  DoubtQuestion,
  KidsChallenge,
  OnlineTest,
} from '../types/education';
import { K12_SUBJECT_COURSES } from './k12SubjectsData';
import {
  K12_SUBJECT_MCQ_SEGMENTS,
  K12_SUBJECT_ONLINE_TESTS,
} from './k12SubjectMcqsAndTests';

export const COURSES: Course[] = [
  ...K12_SUBJECT_COURSES,
  {
    id: 'course-upsc-gs',
    title: 'UPSC CSE Prelims: Polity, Economy & Modern History',
    subtitle:
      'Structured conceptual modules with PYQ elimination frameworks and daily timed MCQ segments.',
    category: 'competitive',
    categoryLabel: 'UPSC & Civil Services',
    instructor: 'Prof. Arvind Mehta',
    instructorRole: 'Former Civil Services Mentor · 14 yrs',
    fullPriceInr: 1299,
    originalPriceInr: 2499,
    totalHours: 42,
    totalMcqs: 480,
    rating: '4.9',
    enrolledCount: '18,400+ learners',
    imageUrl: '/src/assets/images/track_competitive_exams_1793856674843.jpg',
    modules: [
      {
        id: 'mod-upsc-1',
        title: '01. Constitutional Framework & Fundamental Rights',
        durationMins: 180,
        mcqCount: 120,
        priceInr: 399,
        isFreePreview: true,
        keyTopics: [
          'Preamble & Basic Structure Doctrine',
          'Articles 12–35 Writ Jurisdiction',
          'DPSP vs Fundamental Duties',
        ],
      },
      {
        id: 'mod-upsc-2',
        title: '02. Parliament, Judiciary & Federalism',
        durationMins: 210,
        mcqCount: 120,
        priceInr: 399,
        keyTopics: [
          'Money Bill vs Financial Bill',
          'Supreme Court Original & Appellate Powers',
          'Centre-State Legislative Relations',
        ],
      },
      {
        id: 'mod-upsc-3',
        title: '03. Monetary Policy, RBI & Union Budget',
        durationMins: 195,
        mcqCount: 120,
        priceInr: 399,
        keyTopics: [
          'Repo, Reverse Repo & Liquidity Adjustment',
          'Fiscal Deficit & FRBM Targets',
          'Balance of Payments & Exchange Rate',
        ],
      },
      {
        id: 'mod-upsc-4',
        title: '04. Modern Indian National Movement (1885–1947)',
        durationMins: 165,
        mcqCount: 120,
        priceInr: 349,
        keyTopics: [
          'Swadeshi & Home Rule Leagues',
          'Non-Cooperation & Civil Disobedience',
          'Constitutional Acts 1909, 1919, 1935',
        ],
      },
    ],
  },
  {
    id: 'course-class12-physics',
    title: 'Class 12 Physics: Electrostatics, Current & Optics',
    subtitle:
      'Board-aligned derivations, visual field simulations, and chapter-wise numerical MCQ drills.',
    category: 'k12',
    categoryLabel: 'Class 9–12 Boards',
    instructor: 'Dr. Priya Nair',
    instructorRole: 'PhD Physics · Senior Board Examiner',
    fullPriceInr: 899,
    originalPriceInr: 1799,
    totalHours: 34,
    totalMcqs: 360,
    rating: '4.9',
    enrolledCount: '24,150+ learners',
    imageUrl: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
    modules: [
      {
        id: 'mod-phy-1',
        title: '01. Gauss’s Law & Electric Potential',
        durationMins: 150,
        mcqCount: 90,
        priceInr: 249,
        isFreePreview: true,
        keyTopics: [
          'Electric Flux & Gaussian Surfaces',
          'Equipotential Surfaces & Dipole Torque',
          'Parallel Plate Capacitor Dielectrics',
        ],
      },
      {
        id: 'mod-phy-2',
        title: '02. Current Electricity & Kirchhoff Networks',
        durationMins: 140,
        mcqCount: 90,
        priceInr: 249,
        keyTopics: [
          'Drift Velocity & Mobility',
          'Wheatstone Bridge & Meter Bridge',
          'Internal Resistance of Cells',
        ],
      },
      {
        id: 'mod-phy-3',
        title: '03. Moving Charges & Electromagnetic Induction',
        durationMins: 160,
        mcqCount: 90,
        priceInr: 299,
        keyTopics: [
          'Biot-Savart Law & Ampere Circuital Law',
          'Faraday’s Laws & Lenz’s Law',
          'LCR Series Resonance & Transformers',
        ],
      },
      {
        id: 'mod-phy-4',
        title: '04. Ray Optics & Wave Interference',
        durationMins: 170,
        mcqCount: 90,
        priceInr: 299,
        keyTopics: [
          'Lens Maker’s Formula & Prism Deviation',
          'Young’s Double Slit Fringe Width',
          'Single Slit Diffraction & Polarization',
        ],
      },
    ],
  },
  {
    id: 'course-ssc-banking',
    title: 'SSC CGL & IBPS PO: Quant, Reasoning & Banking',
    subtitle:
      'High-speed calculation shortcuts, data interpretation sets, and RBI financial awareness.',
    category: 'competitive',
    categoryLabel: 'SSC & Banking',
    instructor: 'Vikram Rathore',
    instructorRole: 'Ex-SBI PO · Quant & DI Specialist',
    fullPriceInr: 849,
    originalPriceInr: 1699,
    totalHours: 36,
    totalMcqs: 520,
    rating: '4.8',
    enrolledCount: '31,200+ learners',
    imageUrl: '/src/assets/images/track_competitive_exams_1793856674843.jpg',
    modules: [
      {
        id: 'mod-ssc-1',
        title: '01. Percentage, Ratio & Profit-Loss Speed Tricks',
        durationMins: 135,
        mcqCount: 130,
        priceInr: 249,
        isFreePreview: true,
        keyTopics: [
          'Fraction-to-Percentage Equivalents',
          'Successive Discount & Markup Ratios',
          'Compound Interest Installment Shortcuts',
        ],
      },
      {
        id: 'mod-ssc-2',
        title: '02. Time, Work & Data Interpretation Sets',
        durationMins: 150,
        mcqCount: 130,
        priceInr: 299,
        keyTopics: [
          'Efficiency & Alternate Day Work',
          'Pipes, Cisterns & Relative Speed',
          'Caselet & Radar Chart DI',
        ],
      },
      {
        id: 'mod-ssc-3',
        title: '03. Syllogism, Seating & Logical Puzzles',
        durationMins: 140,
        mcqCount: 130,
        priceInr: 249,
        keyTopics: [
          'Venn Diagrams & Possibility Cases',
          'Circular & Linear Floor Puzzles',
          'Input-Output & Coding-Decoding',
        ],
      },
      {
        id: 'mod-ssc-4',
        title: '04. Banking Awareness & RBI Circulars',
        durationMins: 120,
        mcqCount: 130,
        priceInr: 249,
        keyTopics: [
          'Basel III Norms & NPA Classification',
          'UPI, NPCI & Digital Rupee Architecture',
          'Priority Sector Lending Guidelines',
        ],
      },
    ],
  },
  {
    id: 'course-ai-genai',
    title: 'AI, Machine Learning & GenAI Engineering',
    hindiTitle: 'AI, मशीन लर्निंग और GenAI इंजीनियरिंग',
    subtitle:
      'Build LLM pipelines, RAG systems, neural networks, and production AI agents for high-salary tech roles.',
    hindiSubtitle:
      'हाई-सैलरी टेक जॉब्स के लिए LLM, RAG सिस्टम, न्यूरल नेटवर्क और AI एजेंट बनाना सीखें।',
    category: 'skills',
    categoryLabel: 'High-Salary AI Skills',
    instructor: 'Siddharth Kulkarni',
    instructorRole: 'Principal AI Architect · 11 yrs',
    fullPriceInr: 1199,
    originalPriceInr: 2499,
    totalHours: 38,
    totalMcqs: 320,
    rating: '4.9',
    enrolledCount: '19,200+ learners',
    imageUrl: '/src/assets/images/track_digital_skills_1793856675081.jpg',
    salaryRange: '₹12–35 LPA',
    accentColor: 'indigo',
    modules: [
      {
        id: 'mod-ai-1',
        title: '01. Math for ML, NumPy & Pandas Data Pipelines',
        durationMins: 150,
        mcqCount: 80,
        priceInr: 299,
        isFreePreview: true,
        keyTopics: [
          'Linear Algebra, Vectors & Gradient Descent',
          'Vectorized DataFrames with NumPy & Pandas',
          'Feature Engineering & Exploratory Analysis',
        ],
      },
      {
        id: 'mod-ai-2',
        title: '02. Supervised ML & Deep Neural Networks',
        durationMins: 180,
        mcqCount: 80,
        priceInr: 349,
        keyTopics: [
          'Regression, Random Forests & XGBoost',
          'PyTorch Backpropagation & CNNs',
          'Model Evaluation & Hyperparameter Tuning',
        ],
      },
      {
        id: 'mod-ai-3',
        title: '03. Generative AI, LLMs & RAG Architecture',
        durationMins: 190,
        mcqCount: 80,
        priceInr: 399,
        keyTopics: [
          'Transformers, Attention & Tokenization',
          'Vector Databases & Retrieval-Augmented Generation',
          'Prompt Engineering & Structured Outputs',
        ],
      },
      {
        id: 'mod-ai-4',
        title: '04. Autonomous AI Agents & Cloud Deployment',
        durationMins: 160,
        mcqCount: 80,
        priceInr: 399,
        keyTopics: [
          'Tool-Calling Agents & Multi-Step Workflows',
          'FastAPI Model Serving & Docker',
          'Latency, Cost & Guardrail Evaluation',
        ],
      },
    ],
  },
  {
    id: 'course-python-fullstack',
    title: 'Python Programming, Automation & Backend APIs',
    hindiTitle: 'पायथन (Python) प्रोग्रामिंग, ऑटोमेशन और बैकएंड API',
    subtitle:
      'Master core Python, data structures, web scraping, and FastAPI backend systems from scratch.',
    hindiSubtitle:
      'बिल्कुल शुरुआत से Python, डेटा स्ट्रक्चर, ऑटोमेशन और FastAPI बैकएंड डेवलपमेंट सीखें।',
    category: 'skills',
    categoryLabel: 'High-Salary Python Skills',
    instructor: 'Ankit Sharma',
    instructorRole: 'Staff Backend Engineer · 9 yrs',
    fullPriceInr: 899,
    originalPriceInr: 1899,
    totalHours: 32,
    totalMcqs: 300,
    rating: '4.9',
    enrolledCount: '27,500+ learners',
    imageUrl: '/src/assets/images/track_digital_skills_1793856675081.jpg',
    salaryRange: '₹8–22 LPA',
    accentColor: 'amber',
    modules: [
      {
        id: 'mod-py-1',
        title: '01. Core Python, OOPs & Problem Solving',
        durationMins: 140,
        mcqCount: 75,
        priceInr: 249,
        isFreePreview: true,
        keyTopics: [
          'Variables, Loops, Functions & Decorators',
          'Lists, Dicts, Sets & Comprehensions',
          'Object-Oriented Design & Exception Handling',
        ],
      },
      {
        id: 'mod-py-2',
        title: '02. Python Automation, Excel & Web Scraping',
        durationMins: 130,
        mcqCount: 75,
        priceInr: 249,
        keyTopics: [
          'Automating Reports, PDFs & Emails',
          'REST APIs, JSON & Requests',
          'BeautifulSoup & Playwright Scraping',
        ],
      },
      {
        id: 'mod-py-3',
        title: '03. FastAPI, PostgreSQL & Authentication',
        durationMins: 165,
        mcqCount: 75,
        priceInr: 299,
        keyTopics: [
          'Async REST APIs with FastAPI & Pydantic',
          'SQL Queries, Joins & Indexing',
          'JWT Auth & Role-Based Access',
        ],
      },
      {
        id: 'mod-py-4',
        title: '04. Testing, Git & Production Cloud Hosting',
        durationMins: 125,
        mcqCount: 75,
        priceInr: 249,
        keyTopics: [
          'Pytest Unit & Integration Testing',
          'Git Workflows & CI/CD',
          'Deploying Python Services on Cloud',
        ],
      },
    ],
  },
  {
    id: 'course-digital-marketing',
    title: 'Performance Digital Marketing, SEO & GA4 Analytics',
    hindiTitle: 'डिजिटल मार्केटिंग, SEO और Google Ads मास्टरी',
    subtitle:
      'Hands-on campaign architecture, search ranking systems, and conversion attribution for career seekers.',
    hindiSubtitle:
      'SEO, Google Ads, Meta Ads और GA4 एनालिटिक्स के साथ हाई-ग्रोथ डिजिटल मार्केटिंग करियर बनाएं।',
    category: 'skills',
    categoryLabel: 'Digital Marketing & Skills',
    instructor: 'Neha Kapoor',
    instructorRole: 'Growth Lead · 10+ yrs Performance Marketing',
    fullPriceInr: 999,
    originalPriceInr: 1999,
    totalHours: 28,
    totalMcqs: 240,
    rating: '4.9',
    enrolledCount: '15,800+ learners',
    imageUrl: '/src/assets/images/track_digital_skills_1793856675081.jpg',
    salaryRange: '₹6–16 LPA',
    accentColor: 'emerald',
    modules: [
      {
        id: 'mod-dm-1',
        title: '01. Technical SEO & Search Intent Architecture',
        durationMins: 130,
        mcqCount: 60,
        priceInr: 299,
        isFreePreview: true,
        keyTopics: [
          'Crawl Budget, Schema & Core Web Vitals',
          'Keyword Clustering & Topical Authority',
          'On-Page & Backlink Quality Signals',
        ],
      },
      {
        id: 'mod-dm-2',
        title: '02. Google Ads Auction & Meta Paid Acquisition',
        durationMins: 155,
        mcqCount: 60,
        priceInr: 349,
        keyTopics: [
          'Quality Score & Ad Rank Formula',
          'ROAS Bidding & Audience Segmentation',
          'Creative Testing & Landing Page Match',
        ],
      },
      {
        id: 'mod-dm-3',
        title: '03. GA4 Conversion Funnels & Attribution',
        durationMins: 125,
        mcqCount: 60,
        priceInr: 299,
        keyTopics: [
          'Event-Driven Data Model & UTM Taxonomy',
          'Data-Driven vs Last-Click Attribution',
          'Cohort Retention & LTV Calculation',
        ],
      },
      {
        id: 'mod-dm-4',
        title: '04. Lifecycle Email & CRM Automation',
        durationMins: 110,
        mcqCount: 60,
        priceInr: 249,
        keyTopics: [
          'Drip Sequences & Behavioral Triggers',
          'Deliverability, SPF/DKIM & A/B Testing',
          'Lead Scoring Frameworks',
        ],
      },
    ],
  },
  {
    id: 'course-class10-math',
    title: 'Class 10 Mathematics: Quadratics, Trigonometry & Geometry',
    subtitle:
      'Step-by-step board problem solving, visual proofs, and rapid-fire MCQ checkpoints.',
    category: 'k12',
    categoryLabel: 'Class 9–12 Boards',
    instructor: 'Rohan Deshmukh',
    instructorRole: 'MSc Mathematics · 12 yrs CBSE Faculty',
    fullPriceInr: 699,
    originalPriceInr: 1399,
    totalHours: 30,
    totalMcqs: 320,
    rating: '4.8',
    enrolledCount: '29,600+ learners',
    imageUrl: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
    modules: [
      {
        id: 'mod-math-1',
        title: '01. Quadratic Equations & Discriminant Analysis',
        durationMins: 120,
        mcqCount: 80,
        priceInr: 199,
        isFreePreview: true,
        keyTopics: [
          'Nature of Roots via Discriminant',
          'Completing the Square & Quadratic Formula',
          'Word Problems on Speed & Area',
        ],
      },
      {
        id: 'mod-math-2',
        title: '02. Arithmetic Progressions & Series Sums',
        durationMins: 115,
        mcqCount: 80,
        priceInr: 199,
        keyTopics: [
          'nth Term & Common Difference',
          'Sum of First n Terms',
          'Case-Study Applications',
        ],
      },
      {
        id: 'mod-math-3',
        title: '03. Trigonometry & Heights-Distances',
        durationMins: 140,
        mcqCount: 80,
        priceInr: 249,
        keyTopics: [
          'Trigonometric Ratios & Standard Angles',
          'Pythagorean Identities',
          'Angles of Elevation & Depression',
        ],
      },
      {
        id: 'mod-math-4',
        title: '04. Coordinate Geometry & Tangent Theorems',
        durationMins: 130,
        mcqCount: 80,
        priceInr: 249,
        keyTopics: [
          'Distance & Section Formula',
          'Tangent Perpendicularity Theorem',
          'Area of Sectors & Segments',
        ],
      },
    ],
  },
  {
    id: 'course-class12-chemistry',
    title: 'Class 11–12 Chemistry: Organic, Inorganic & Physical',
    subtitle:
      'Reaction mechanisms, electrochemistry, coordination compounds, and NCERT board numericals.',
    hindiSubtitle:
      'Organic reactions, Electrochemistry, aur NCERT Board numericals ki complete tayari.',
    category: 'k12',
    categoryLabel: 'Class 11–12 Boards',
    instructor: 'Dr. Ritu Sharma',
    instructorRole: 'Senior Chemistry Faculty · 12+ Yrs Exp',
    fullPriceInr: 749,
    originalPriceInr: 1499,
    totalHours: 38,
    totalMcqs: 360,
    rating: '4.9',
    enrolledCount: '11,200+ learners',
    imageUrl: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
    modules: [
      {
        id: 'mod-chem-1',
        title: '01. Solutions, Electrochemistry & Chemical Kinetics',
        durationMins: 185,
        mcqCount: 95,
        priceInr: 229,
        isFreePreview: true,
        keyTopics: [
          'Raoult’s Law & Colligative Properties',
          'Nernst Equation & Conductance',
          'First-Order Rate Law & Half-Life',
        ],
      },
      {
        id: 'mod-chem-2',
        title: '02. Aldehydes, Ketones & Named Organic Reactions',
        durationMins: 210,
        mcqCount: 110,
        priceInr: 249,
        keyTopics: [
          'Aldol & Cannizzaro Mechanisms',
          'Nucleophilic Addition Reactions',
          'Board Conversion Roadmaps',
        ],
      },
    ],
  },
  {
    id: 'course-class9-science',
    title: 'Class 9–10 Science & Social Studies (NCERT Complete)',
    subtitle:
      'Foundation Physics, Chemistry, Biology, History & Civics with chapter-wise Hindi/English MCQs.',
    hindiSubtitle:
      'Class 9 aur 10 ke liye NCERT Science aur Social Studies ke sabhi chapters + MCQ.',
    category: 'k12',
    categoryLabel: 'Class 9–10 Foundation',
    instructor: 'Prof. Vivek Tiwari',
    instructorRole: 'NCERT Foundation Mentor',
    fullPriceInr: 599,
    originalPriceInr: 1199,
    totalHours: 32,
    totalMcqs: 300,
    rating: '4.8',
    enrolledCount: '16,400+ learners',
    imageUrl: '/src/assets/images/hero_learning_studio_1793856674745.jpg',
    modules: [
      {
        id: 'mod-sci9-1',
        title: '01. Motion, Force, Laws of Motion & Gravitation',
        durationMins: 160,
        mcqCount: 80,
        priceInr: 179,
        isFreePreview: true,
        keyTopics: [
          'Newton’s Three Laws & Momentum',
          'Universal Law of Gravitation',
          'Archimedes Principle & Buoyancy',
        ],
      },
      {
        id: 'mod-sci9-2',
        title: '02. Chemical Reactions, Acids-Bases & Life Processes',
        durationMins: 175,
        mcqCount: 90,
        priceInr: 199,
        keyTopics: [
          'Balancing Chemical Equations',
          'pH Scale & Everyday Salts',
          'Human Nutrition, Respiration & Circulation',
        ],
      },
    ],
  },
  {
    id: 'course-future-kids',
    title: 'Future Kids: Logic, Vedic Math & Young Science Lab',
    subtitle:
      'Interactive puzzle quests, balance-scale ratio games, and mental math adventures for ages 6–14.',
    category: 'kids',
    categoryLabel: 'Future Kids (Ages 6–14)',
    instructor: 'Ananya Sen',
    instructorRole: 'STEM Curriculum Designer · Child Pedagogy',
    fullPriceInr: 549,
    originalPriceInr: 1099,
    totalHours: 20,
    totalMcqs: 200,
    rating: '5.0',
    enrolledCount: '14,900+ young learners',
    imageUrl: '/src/assets/images/track_kids_gamification_1793856675358.jpg',
    modules: [
      {
        id: 'mod-kids-1',
        title: '01. Vedic Mental Math & Number Ninja Tricks',
        durationMins: 90,
        mcqCount: 50,
        priceInr: 149,
        isFreePreview: true,
        keyTopics: [
          'Base-100 Multiplication in 3 Seconds',
          'Digit-Sum Verification',
          'Squaring Numbers Ending in 5',
        ],
      },
      {
        id: 'mod-kids-2',
        title: '02. Visual Logic & Pattern Decoding',
        durationMins: 95,
        mcqCount: 50,
        priceInr: 149,
        keyTopics: [
          'Fibonacci & Geometric Sequences',
          'Spatial Rotation & Tangram Proofs',
          'Truth-Teller Logic Riddles',
        ],
      },
      {
        id: 'mod-kids-3',
        title: '03. Fractions, Ratios & Balance Scale Lab',
        durationMins: 100,
        mcqCount: 50,
        priceInr: 199,
        keyTopics: [
          'Equivalent Fractions on a Scale',
          'Proportional Mixing & Recipes',
          'Early Algebraic Thinking',
        ],
      },
      {
        id: 'mod-kids-4',
        title: '04. Everyday Physics & Space Explorers',
        durationMins: 105,
        mcqCount: 50,
        priceInr: 199,
        keyTopics: [
          'Gravity, Orbits & Planetary Scale',
          'Simple Machines: Levers & Pulleys',
          'Light, Mirrors & Rainbows',
        ],
      },
    ],
  },
];

export const MCQ_SEGMENTS: McqSegment[] = [
  ...K12_SUBJECT_MCQ_SEGMENTS,
  {
    id: 'seg-upsc-1',
    trackId: 'course-upsc-gs',
    trackTitle: 'UPSC Polity: Fundamental Rights',
    segmentNumber: 1,
    conceptTitle: 'Writ Jurisdiction: Article 32 vs Article 226',
    conceptSummary:
      'Under Article 32, the Supreme Court can issue writs solely for enforcing Fundamental Rights. Under Article 226, High Courts can issue writs for both Fundamental Rights and ordinary legal rights, giving High Courts wider territorial-subject writ scope.',
    keyFormulaOrRule: 'Art. 32 (SC: FRs only) ⊂ Art. 226 (HC: FRs + Legal Rights)',
    conceptDurationSec: 18,
    question:
      'Which of the following statements accurately distinguishes the writ jurisdiction of the Supreme Court (Article 32) from that of a High Court (Article 226)?',
    options: [
      'The Supreme Court can issue writs for both Fundamental Rights and ordinary legal rights.',
      'A High Court can issue writs not only for Fundamental Rights but also for any other legal right.',
      'The Supreme Court may refuse to exercise its writ jurisdiction under Article 32 as a discretionary remedy.',
      'High Courts can issue writs only against authorities located within their territorial jurisdiction, even if the cause of action arises there.',
    ],
    correctIndex: 1,
    explanation:
      'Article 32 is itself a Fundamental Right, so the Supreme Court cannot refuse it, but it is limited to Fundamental Rights. High Courts under Article 226 have wider subject-matter jurisdiction covering both Fundamental Rights and ordinary legal rights.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'UPSC राजव्यवस्था: मौलिक अधिकार',
      conceptTitle: 'रिट अधिकारिता: अनुच्छेद 32 बनाम अनुच्छेद 226',
      conceptSummary:
        'अनुच्छेद 32 के तहत सर्वोच्च न्यायालय (SC) केवल मौलिक अधिकारों को लागू करने के लिए रिट जारी कर सकता है। अनुच्छेद 226 के तहत उच्च न्यायालय (HC) मौलिक अधिकारों और सामान्य कानूनी अधिकारों—दोनों के लिए रिट जारी कर सकता है।',
      keyFormulaOrRule: 'अनुच्छेद 32 (SC: केवल मौलिक अधिकार) ⊂ अनुच्छेद 226 (HC: मौलिक + कानूनी अधिकार)',
      question:
        'सर्वोच्च न्यायालय (अनुच्छेद 32) और उच्च न्यायालय (अनुच्छेद 226) की रिट अधिकारिता के बीच निम्नलिखित में से कौन-सा कथन सही अंतर स्पष्ट करता है?',
      options: [
        'सर्वोच्च न्यायालय मौलिक अधिकारों और सामान्य कानूनी अधिकारों—दोनों के लिए रिट जारी कर सकता है।',
        'उच्च न्यायालय न केवल मौलिक अधिकारों के लिए, बल्कि किसी अन्य कानूनी अधिकार के लिए भी रिट जारी कर सकता है।',
        'सर्वोच्च न्यायालय अनुच्छेद 32 के तहत रिट जारी करने से विवेकाधीन आधार पर मना कर सकता है।',
        'उच्च न्यायालय केवल अपने क्षेत्रीय अधिकार क्षेत्र में स्थित प्राधिकारियों के विरुद्ध ही रिट जारी कर सकता है।',
      ],
      explanation:
        'अनुच्छेद 32 स्वयं एक मौलिक अधिकार है, इसलिए सर्वोच्च न्यायालय इसे अस्वीकार नहीं कर सकता, परंतु यह केवल मौलिक अधिकारों तक सीमित है। अनुच्छेद 226 के अंतर्गत उच्च न्यायालय का विषय-क्षेत्र अधिक व्यापक है।',
    },
  },
  {
    id: 'seg-upsc-2',
    trackId: 'course-upsc-gs',
    trackTitle: 'UPSC Polity: Fundamental Rights',
    segmentNumber: 2,
    conceptTitle: 'Right to Equality: Article 14 & Reasonable Classification',
    conceptSummary:
      'Article 14 guarantees equality before the law (British origin, negative concept) and equal protection of the laws (American origin, positive concept). It permits reasonable classification based on intelligible differentia, but forbids class legislation.',
    keyFormulaOrRule: 'Valid Classification = Intelligible Differentia + Rational Nexus',
    conceptDurationSec: 18,
    question:
      'In Indian Constitutional law, what does the doctrine of "Equal Protection of the Laws" under Article 14 permit?',
    options: [
      'Arbitrary selection of individuals without any objective criteria',
      'Reasonable classification based on intelligible differentia with a rational nexus to the objective',
      'Complete exemption of all statutory corporations from judicial review',
      'Class legislation favouring specific groups without legislative purpose',
    ],
    correctIndex: 1,
    explanation:
      'The Supreme Court has consistently held that Article 14 forbids class legislation but permits reasonable classification provided it is founded on an intelligible differentia and has a rational relation to the object sought to be achieved.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'UPSC राजव्यवस्था: मौलिक अधिकार',
      conceptTitle: 'समानता का अधिकार: अनुच्छेद 14 और युक्तियुक्त वर्गीकरण',
      conceptSummary:
        'अनुच्छेद 14 "विधि के समक्ष समता" (ब्रिटिश मूल) और "विधियों के समान संरक्षण" (अमेरिकी मूल) की गारंटी देता है। यह वर्ग-विधान (Class Legislation) को रोकता है, लेकिन बोधगम्य अंतर (Intelligible Differentia) पर आधारित युक्तियुक्त वर्गीकरण की अनुमति देता है।',
      keyFormulaOrRule: 'वैध वर्गीकरण = बोधगम्य अंतर (Intelligible Differentia) + तर्कसंगत संबंध',
      question:
        'भारतीय संवैधानिक विधि में, अनुच्छेद 14 के अंतर्गत "विधियों के समान संरक्षण" का सिद्धांत निम्नलिखित में से किसकी अनुमति देता है?',
      options: [
        'बिना किसी वस्तुनिष्ठ मानदंड के व्यक्तियों का मनमाना चयन',
        'उद्देश्य के साथ तर्कसंगत संबंध रखने वाले बोधगम्य अंतर पर आधारित युक्तियुक्त वर्गीकरण',
        'सभी वैधानिक निगमों को न्यायिक समीक्षा से पूर्ण छूट',
        'बिना विधायी उद्देश्य के विशिष्ट समूहों के पक्ष में वर्ग-विधान',
      ],
      explanation:
        'सर्वोच्च न्यायालय ने स्पष्ट किया है कि अनुच्छेद 14 वर्ग-विधान का निषेध करता है, परंतु ऐसे युक्तियुक्त वर्गीकरण की अनुमति देता है जो बोधगम्य अंतर और विधि के उद्देश्य के बीच तर्कसंगत संबंध पर आधारित हो।',
    },
  },
  {
    id: 'seg-phy-1',
    trackId: 'course-class12-physics',
    trackTitle: 'Class 12 Physics: Electrostatics',
    segmentNumber: 1,
    conceptTitle: 'Gauss’s Law & Closed Surface Flux',
    conceptSummary:
      'The total electric flux through any closed Gaussian surface is equal to 1/ε₀ times the net charge enclosed within the surface. Flux is completely independent of the shape or size of the closed surface.',
    keyFormulaOrRule: 'Φ_E = ∮ E · dA = q_enclosed / ε₀',
    conceptDurationSec: 18,
    question:
      'A point charge +q is placed at the centre of a cube of side L. If the side of the cube is doubled to 2L, what happens to the total electric flux emerging from the cube?',
    options: [
      'It increases by a factor of 4',
      'It decreases by a factor of 4',
      'It remains unchanged at q / ε₀',
      'It doubles to 2q / ε₀',
    ],
    correctIndex: 2,
    explanation:
      'By Gauss’s Law, total electric flux Φ = q_enclosed / ε₀ depends only on the enclosed charge and the permittivity of free space, not on the dimensions or shape of the closed surface.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'कक्षा 12 भौतिक विज्ञान: स्थिरवैद्युतिकी',
      conceptTitle: 'गॉस का नियम (Gauss’s Law) और बंद पृष्ठ से विद्युत फ्लक्स',
      conceptSummary:
        'किसी भी बंद गॉसीय पृष्ठ से गुजरने वाला कुल विद्युत फ्लक्स, उस पृष्ठ के भीतर परिबद्ध कुल आवेश (q) का 1/ε₀ गुना होता है। यह फ्लक्स बंद पृष्ठ के आकार या आकृति पर निर्भर नहीं करता।',
      keyFormulaOrRule: 'Φ_E = ∮ E · dA = q_परिबद्ध / ε₀',
      question:
        'L भुजा वाले एक घन के केंद्र पर +q बिंदु आवेश रखा गया है। यदि घन की भुजा को दोगुना (2L) कर दिया जाए, तो घन से बाहर निकलने वाले कुल विद्युत फ्लक्स पर क्या प्रभाव पड़ेगा?',
      options: [
        'यह 4 गुना बढ़ जाएगा',
        'यह 4 गुना कम हो जाएगा',
        'यह q / ε₀ पर अपरिवर्तित रहेगा',
        'यह दोगुना होकर 2q / ε₀ हो जाएगा',
      ],
      explanation:
        'गॉस के नियम के अनुसार, कुल विद्युत फ्लक्स Φ = q / ε₀ केवल परिबद्ध आवेश और निर्वात की विद्युतशीलता पर निर्भर करता है, न कि बंद पृष्ठ के आकार या भुजा की लंबाई पर।',
    },
  },
  {
    id: 'seg-ssc-1',
    trackId: 'course-ssc-banking',
    trackTitle: 'SSC & Banking: Speed Quant',
    segmentNumber: 1,
    conceptTitle: 'Successive Percentage Change Shortcut',
    conceptSummary:
      'When a quantity changes successively by a% and b%, the net percentage change is given by a + b + (ab / 100). For a price increase of +x% followed by a decrease of -x%, there is always a net decrease of x²/100%.',
    keyFormulaOrRule: 'Net % Change = a + b + (ab / 100)',
    conceptDurationSec: 16,
    question:
      'A merchant marks up an article by 20% above cost price and then offers a 20% discount on the marked price. What is the net profit or loss percentage?',
    options: [
      'No profit, no loss (0%)',
      '4% profit',
      '4% loss',
      '2% loss',
    ],
    correctIndex: 2,
    explanation:
      'Using a = +20 and b = -20: Net change = 20 - 20 + (20 × -20)/100 = -400/100 = -4%, which is a 4% net loss.',
    questionDurationSec: 22,
    hindi: {
      trackTitle: 'SSC और बैंकिंग: स्पीड गणित (Quant)',
      conceptTitle: 'क्रमागत प्रतिशत परिवर्तन (Successive Percentage) शॉर्टकट',
      conceptSummary:
        'जब किसी मान में क्रमशः a% और b% का परिवर्तन होता है, तो कुल प्रतिशत परिवर्तन a + b + (ab / 100) होता है। यदि पहले +x% की वृद्धि और फिर -x% की कमी हो, तो सदैव x²/100% की हानि होती है।',
      keyFormulaOrRule: 'कुल % परिवर्तन = a + b + (ab / 100)',
      question:
        'एक व्यापारी किसी वस्तु का अंकित मूल्य क्रय मूल्य से 20% अधिक रखता है और फिर अंकित मूल्य पर 20% की छूट देता है। उसका शुद्ध लाभ या हानि प्रतिशत क्या है?',
      options: [
        'न लाभ, न हानि (0%)',
        '4% लाभ',
        '4% हानि',
        '2% हानि',
      ],
      explanation:
        'सूत्र a + b + (ab/100) में a = +20 और b = -20 रखने पर: 20 - 20 + (20 × -20)/100 = -4%। अतः व्यापारी को 4% की शुद्ध हानि होगी।',
    },
  },
  {
    id: 'seg-dm-1',
    trackId: 'course-digital-marketing',
    trackTitle: 'Digital Marketing: Google Ads Auction',
    segmentNumber: 1,
    conceptTitle: 'Ad Rank & Actual CPC Mechanics',
    conceptSummary:
      'In Google Ads, the highest bidder does not automatically win the top slot. Ad Rank is determined by Maximum CPC Bid multiplied by Quality Score (Expected CTR, Ad Relevance, Landing Page Experience) plus ad extensions impact.',
    keyFormulaOrRule: 'Ad Rank = Max CPC × Quality Score | Actual CPC = (Ad Rank below / Your QS) + ₹0.01',
    conceptDurationSec: 18,
    question:
      'Advertiser A bids ₹40 with a Quality Score of 8, while Advertiser B bids ₹50 with a Quality Score of 5. Who wins the higher Ad Rank and why?',
    options: [
      'Advertiser B wins because their Max CPC bid of ₹50 is higher.',
      'Advertiser A wins because their Ad Rank (320) exceeds Advertiser B’s Ad Rank (250).',
      'Both tie because Quality Score only affects organic SEO rankings.',
      'Advertiser B wins but pays ₹40 per click.',
    ],
    correctIndex: 1,
    explanation:
      'Advertiser A’s Ad Rank is 40 × 8 = 320, whereas Advertiser B’s Ad Rank is 50 × 5 = 250. Higher Quality Score allows Advertiser A to win the higher position at a lower cost.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'डिजिटल मार्केटिंग: Google Ads नीलामी',
      conceptTitle: 'Ad Rank और वास्तविक CPC (Cost Per Click) का नियम',
      conceptSummary:
        'Google Ads में केवल सबसे ऊँची बोली (Bid) लगाने वाला ही शीर्ष स्थान नहीं जीतता। Ad Rank = Maximum CPC Bid × Quality Score होता है।',
      keyFormulaOrRule: 'Ad Rank = Max CPC × Quality Score',
      question:
        'विज्ञापनदाता A ₹40 की बोली (Bid) और 8 के Quality Score के साथ आता है, जबकि विज्ञापनदाता B ₹50 की बोली और 5 के Quality Score के साथ आता है। उच्चतर Ad Rank कौन जीतेगा?',
      options: [
        'विज्ञापनदाता B जीतेगा क्योंकि उसकी ₹50 की बोली अधिक है।',
        'विज्ञापनदाता A जीतेगा क्योंकि उसकी Ad Rank (320), B की Ad Rank (250) से अधिक है।',
        'दोनों बराबर रहेंगे क्योंकि Quality Score केवल SEO को प्रभावित करता है।',
        'विज्ञापनदाता B जीतेगा और प्रति क्लिक ₹40 देगा।',
      ],
      explanation:
        'विज्ञापनदाता A की Ad Rank = 40 × 8 = 320 है, जबकि विज्ञापनदाता B की Ad Rank = 50 × 5 = 250 है। बेहतर Quality Score के कारण A कम खर्च में शीर्ष स्थान जीतता है।',
    },
  },
];

export const DOUBT_SESSIONS: DoubtSession[] = [
  {
    id: 'doubt-sess-1',
    title: 'UPSC GS-II Polity & Constitutional Amendments Clinic',
    subject: 'UPSC & Civil Services',
    mentor: 'Prof. Arvind Mehta',
    mentorRole: 'Polity & Governance Lead',
    isLiveNow: true,
    scheduleTime: 'Live Now · Ends 10:30 PM',
    activeStudents: 142,
    currentSlideTitle: '42nd vs 44th Constitutional Amendment Act',
    currentSlideFormula: 'Art. 352: "Internal Disturbance" → Replaced by "Armed Rebellion" (44th CAA, 1978)',
    currentSlideNotes:
      'The 44th Amendment (1978) also made written cabinet recommendation mandatory for National Emergency and restored Judicial Review.',
  },
  {
    id: 'doubt-sess-2',
    title: 'Class 12 Physics: Gauss’s Law & Capacitor Networks',
    subject: 'Class 9–12 Boards',
    mentor: 'Dr. Priya Nair',
    mentorRole: 'Senior Physics Faculty',
    isLiveNow: true,
    scheduleTime: 'Live Now · Ends 10:15 PM',
    activeStudents: 98,
    currentSlideTitle: 'Energy Stored in Series vs Parallel Capacitors',
    currentSlideFormula: 'U = ½ C V² = Q² / (2C) = ½ Q V',
    currentSlideNotes:
      'When a dielectric slab (K) is inserted with battery connected, V stays constant and energy increases by factor K.',
  },
  {
    id: 'doubt-sess-3',
    title: 'SSC CGL & IBPS PO: Data Interpretation & Speed Math',
    subject: 'SSC & Banking',
    mentor: 'Vikram Rathore',
    mentorRole: 'Quant & DI Specialist',
    isLiveNow: false,
    scheduleTime: 'Tomorrow · 6:00 PM IST',
    activeStudents: 64,
    currentSlideTitle: 'Ratio & Percentage Approximation in Caselet DI',
    currentSlideFormula: '1/7 ≈ 14.28% | 1/8 = 12.5% | 1/9 ≈ 11.11% | 1/11 ≈ 9.09%',
    currentSlideNotes:
      'Convert percentage growth tables into fraction multipliers before computing compound ratios.',
  },
];

export const INITIAL_DOUBTS: DoubtQuestion[] = [
  {
    id: 'dq-1',
    sessionId: 'doubt-sess-1',
    studentName: 'Siddharth Verma',
    topicTag: 'Article 368',
    questionText:
      'Can a Constitutional Amendment Bill under Article 368 be introduced in a State Legislature, or only in Parliament?',
    timestamp: '4 mins ago',
    upvotes: 19,
    mentorReply:
      'Only in either House of Parliament—never in a State Legislature. Moreover, it does not require prior permission of the President.',
    status: 'Answered',
  },
  {
    id: 'dq-2',
    sessionId: 'doubt-sess-1',
    studentName: 'Meera Krishnan',
    topicTag: 'Joint Sitting',
    questionText:
      'Why is there no provision for a joint sitting of both Houses to resolve a deadlock over a Constitutional Amendment Bill?',
    timestamp: '2 mins ago',
    upvotes: 12,
    status: 'In Queue',
  },
  {
    id: 'dq-3',
    sessionId: 'doubt-sess-2',
    studentName: 'Aarav Kulkarni',
    topicTag: 'Dielectrics',
    questionText:
      'If a dielectric slab is inserted after disconnecting the battery, why does the stored electrostatic energy decrease?',
    timestamp: '5 mins ago',
    upvotes: 15,
    mentorReply:
      'Charge Q remains constant, while capacitance increases to KC. Since U = Q²/(2C), energy decreases by a factor of 1/K (used in pulling the slab in).',
    status: 'Answered',
  },
];

export const KIDS_CHALLENGES: KidsChallenge[] = [
  {
    id: 'kid-1',
    type: 'math',
    prompt: 'Vedic Rocket: What is 98 × 97 using the Base-100 shortcut?',
    visualHint: '98 is (-2) from 100, and 97 is (-3) from 100. Cross-subtract: 98 - 3 = 95, multiply deficits: 2 × 3 = 06!',
    options: ['9,406', '9,506', '9,606', '9,516'],
    correctIndex: 1,
    xpReward: 50,
    explanation: '98 - 3 = 95 (first two digits) and (-2) × (-3) = 06 (last two digits) → 9,506!',
  },
  {
    id: 'kid-2',
    type: 'pattern',
    prompt: 'Starlight Sequence: Find the next number in 2, 6, 12, 20, 30, ___',
    visualHint: 'Look at the jumps between numbers: +4, +6, +8, +10...',
    options: ['38', '40', '42', '44'],
    correctIndex: 2,
    xpReward: 60,
    explanation: 'The differences increase by 2 each step (+4, +6, +8, +10, +12). So 30 + 12 = 42!',
  },
  {
    id: 'kid-3',
    type: 'fraction',
    prompt: 'Pizza Fraction Lab: Which fraction is LARGER than 3/4?',
    visualHint: 'Convert to percentages or common denominator 20: 3/4 = 75% (or 15/20).',
    options: ['7/10', '4/5', '11/16', '5/8'],
    correctIndex: 1,
    xpReward: 55,
    explanation: '4/5 = 80% (or 16/20), which is greater than 3/4 = 75% (15/20)!',
  },
  {
    id: 'kid-4',
    type: 'math',
    prompt: 'Speed Square: What is 65 × 65?',
    visualHint: 'For numbers ending in 5: multiply the tens digit (6) by (6 + 1), then attach 25!',
    options: ['4,225', '3,625', '4,025', '4,525'],
    correctIndex: 0,
    xpReward: 50,
    explanation: '6 × 7 = 42, followed by 25 → 4,225!',
  },
];

export const INITIAL_ONLINE_TESTS: OnlineTest[] = [
  ...K12_SUBJECT_ONLINE_TESTS,
  {
    id: 'test-upsc-gs-1',
    titleEn: 'UPSC & SSC General Studies Live Mock Test',
    titleHi: 'UPSC & SSC Samanya Adhyayan Online Test',
    category: 'UPSC / SSC / Banking',
    durationMins: 10,
    marksPerQuestion: 2,
    negativeMarking: 0.5,
    isPublished: true,
    createdAt: '2026-11-04',
    questions: [
      {
        id: 'otq-1',
        questionEn:
          'Which Article of the Indian Constitution guarantees the Right to Constitutional Remedies (Heart and Soul of the Constitution)?',
        questionHi:
          'Bharatiya Samvidhan ka kaun sa Anuchchhed Samvaidhanik Upcharon ka Adhikar (Samvidhan ki Aatma) pradan karta hai?',
        optionsEn: ['Article 14', 'Article 19', 'Article 21', 'Article 32'],
        optionsHi: ['Anuchchhed 14', 'Anuchchhed 19', 'Anuchchhed 21', 'Anuchchhed 32'],
        correctIndex: 3,
        explanationEn:
          'Dr. B.R. Ambedkar called Article 32 the "Heart and Soul of the Constitution" as it empowers citizens to move the Supreme Court directly for Fundamental Rights.',
        explanationHi:
          'Dr. B.R. Ambedkar ne Anuchchhed 32 ko "Samvidhan ki Aatma" kaha hai kyunki iske tahat nagrik seedhe Supreme Court ja sakte hain.',
      },
      {
        id: 'otq-2',
        questionEn:
          'Who among the following presides over a Joint Sitting of both Houses of Parliament in India?',
        questionHi:
          'Bharat mein Sansad ke dono Sadnon ki Sanyukt Baithak (Joint Sitting) ki adhyakshata kaun karta hai?',
        optionsEn: [
          'President of India',
          'Vice-President (Chairman of Rajya Sabha)',
          'Speaker of Lok Sabha',
          'Prime Minister',
        ],
        optionsHi: [
          'Bharat ke Rashtrapati',
          'Up-Rashtrapati (Rajya Sabha Sabhapati)',
          'Lok Sabha Adhyaksh (Speaker)',
          'Pradhanmantri',
        ],
        correctIndex: 2,
        explanationEn:
          'Under Article 118(4), the Speaker of the Lok Sabha presides over a joint sitting of the two Houses.',
        explanationHi:
          'Anuchchhed 118(4) ke anusaar, Lok Sabha Adhyaksh (Speaker) Sansad ki sanyukt baithak ki adhyakshata karte hain.',
      },
      {
        id: 'otq-3',
        questionEn:
          'Which monetary policy tool does the Reserve Bank of India (RBI) use to absorb excess liquidity from commercial banks?',
        questionHi:
          'Commercial banks se atirikt taralta (excess liquidity) kam karne ke liye RBI kis maudrik niti upakaran ka upyog karta hai?',
        optionsEn: [
          'Reverse Repo Rate / SDF',
          'Bank Rate Reduction',
          'CRR Reduction',
          'Deficit Financing',
        ],
        optionsHi: [
          'Reverse Repo Rate / SDF',
          'Bank Rate mein kami',
          'CRR mein kami',
          'Ghate ki vitt vyavastha',
        ],
        correctIndex: 0,
        explanationEn:
          'Raising Reverse Repo / Standing Deposit Facility (SDF) incentivizes banks to park surplus funds with RBI, absorbing liquidity.',
        explanationHi:
          'Reverse Repo / SDF badhane se banks apna atirikt paisa RBI ke paas rakhte hain, jisse market mein liquidity kam hoti hai.',
      },
    ],
  },
  {
    id: 'test-k12-science-1',
    titleEn: 'Class 10–12 Physics & Maths Speed Online Test',
    titleHi: 'Class 10–12 Physics & Maths Speed Online Test',
    category: 'Class 9–12',
    durationMins: 8,
    marksPerQuestion: 4,
    negativeMarking: 1,
    isPublished: true,
    createdAt: '2026-11-04',
    questions: [
      {
        id: 'otq-4',
        questionEn: 'What is the SI unit of Electric Flux?',
        questionHi: 'Vidyut Flux (Electric Flux) ka SI matrak kya hai?',
        optionsEn: ['N·m²/C', 'N/C', 'Joule/Coulomb', 'Volt/meter'],
        optionsHi: ['N·m²/C', 'N/C', 'Joule/Coulomb', 'Volt/meter'],
        correctIndex: 0,
        explanationEn:
          'Electric flux Φ = E · A, where E is in N/C and A is in m², giving N·m²/C (or V·m).',
        explanationHi:
          'Vidyut flux Φ = E · A hota hai, jahan E ka matrak N/C aur A ka m² hai, isliye N·m²/C sahi hai.',
      },
      {
        id: 'otq-5',
        questionEn: 'If sin θ + cos θ = √2, what is the value of tan θ + cot θ?',
        questionHi: 'Yadi sin θ + cos θ = √2 hai, to tan θ + cot θ ka maan kya hoga?',
        optionsEn: ['1', '2', '√2', '4'],
        optionsHi: ['1', '2', '√2', '4'],
        correctIndex: 1,
        explanationEn:
          'Squaring both sides: sin²θ + cos²θ + 2sinθcosθ = 2 ⇒ 1 + 2sinθcosθ = 2 ⇒ sinθcosθ = 1/2. Thus tanθ + cotθ = 1/(sinθcosθ) = 2.',
        explanationHi:
          'Dono pakshon ka varg karne par sinθcosθ = 1/2 milta hai. Isliye tanθ + cotθ = 1/(sinθcosθ) = 2.',
      },
    ],
  },
];
