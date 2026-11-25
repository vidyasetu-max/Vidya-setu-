import { McqSegment, OnlineTest } from '../types/education';

export function getSubjectKeyFromCourseId(courseId: string): string | null {
  if (courseId.startsWith('k12-c')) {
    const parts = courseId.split('-');
    return parts[parts.length - 1] || null;
  }
  if (courseId === 'course-class12-physics') return 'physics';
  return null;
}

export const K12_SUBJECT_MCQ_SEGMENTS: McqSegment[] = [
  // 1. CHEMISTRY
  {
    id: 'seg-k12-chem-1',
    trackId: 'k12-subj-chemistry',
    trackTitle: 'Chemistry (Class 9–12)',
    segmentNumber: 1,
    conceptTitle: 'Raoult’s Law & Ideal Solutions',
    conceptSummary:
      'For a solution of volatile liquids, the partial vapour pressure of each component in the solution is directly proportional to its mole fraction present in the solution.',
    keyFormulaOrRule: 'P_total = P₁°x₁ + P₂°x₂',
    conceptDurationSec: 18,
    question:
      'According to Raoult’s Law, the relative lowering of vapour pressure of a dilute solution containing a non-volatile solute is equal to:',
    options: [
      'Mole fraction of the solvent',
      'Mole fraction of the solute',
      'Molality of the solution',
      'Normality of the solution',
    ],
    correctIndex: 1,
    explanation:
      '(P° - P) / P° = x₂, where x₂ is the mole fraction of the non-volatile solute.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'रसायन विज्ञान (Chemistry)',
      conceptTitle: 'राउल्ट का नियम (Raoult’s Law) और आदर्श विलयन',
      conceptSummary:
        'वाष्पशील द्रवों के विलयन में प्रत्येक घटक का आंशिक वाष्प दाब विलयन में उसके मोल प्रभाज (Mole Fraction) के समानुपाती होता है।',
      keyFormulaOrRule: 'P_total = P₁°x₁ + P₂°x₂',
      question:
        'राउल्ट के नियम के अनुसार, अवाष्पशील विलेय युक्त तनु विलयन के वाष्प दाब का आपेक्षिक अवनमन किसके बराबर होता है?',
      options: [
        'विलायक के मोल प्रभाज के',
        'विलेय के मोल प्रभाज के',
        'विलयन की मोललता के',
        'विलयन की नॉर्मलता के',
      ],
      explanation:
        '(P° - P) / P° = x₂, जहाँ x₂ अवाष्पशील विलेय का मोल प्रभाज है।',
    },
  },
  {
    id: 'seg-k12-chem-2',
    trackId: 'k12-subj-chemistry',
    trackTitle: 'Chemistry (Class 9–12)',
    segmentNumber: 2,
    conceptTitle: 'Nernst Equation & Electrode Potential',
    conceptSummary:
      'The Nernst equation relates the reduction potential of an electrochemical reaction to the standard electrode potential, temperature, and activities (concentrations) of the chemical species.',
    keyFormulaOrRule: 'E = E° - (0.0591 / n) log Q  (at 298 K)',
    conceptDurationSec: 18,
    question:
      'At 298 K, what is the value of (2.303 RT / F) used in the Nernst equation?',
    options: ['0.0295 V', '0.0591 V', '0.118 V', '1.059 V'],
    correctIndex: 1,
    explanation:
      'Substituting R = 8.314 J/K·mol, T = 298 K, and F = 96487 C/mol gives 2.303 RT / F ≈ 0.0591 V.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'रसायन विज्ञान (Chemistry)',
      conceptTitle: 'नर्नस्ट समीकरण (Nernst Equation) और इलेक्ट्रोड विभव',
      conceptSummary:
        'नर्नस्ट समीकरण किसी विद्युत-रासायनिक सेल के इलेक्ट्रोड विभव को मानक इलेक्ट्रोड विभव, तापमान और आयनों की सांद्रता से जोड़ता है।',
      keyFormulaOrRule: 'E = E° - (0.0591 / n) log Q  (298 K पर)',
      question:
        '298 K तापमान पर नर्नस्ट समीकरण में (2.303 RT / F) का मान कितना होता है?',
      options: ['0.0295 V', '0.0591 V', '0.118 V', '1.059 V'],
      explanation:
        'R = 8.314, T = 298 K और F = 96487 रखने पर 2.303 RT / F का मान 0.0591 V प्राप्त होता है।',
    },
  },

  // 2. MATHEMATICS
  {
    id: 'seg-k12-math-1',
    trackId: 'k12-subj-maths',
    trackTitle: 'Mathematics (Class 9–12)',
    segmentNumber: 1,
    conceptTitle: 'Quadratic Discriminant & Nature of Roots',
    conceptSummary:
      'For a quadratic equation ax² + bx + c = 0 (a ≠ 0), the discriminant D = b² - 4ac determines whether the roots are real & distinct (D > 0), real & equal (D = 0), or complex (D < 0).',
    keyFormulaOrRule: 'D = b² - 4ac',
    conceptDurationSec: 18,
    question:
      'If the quadratic equation 2x² - 4x + k = 0 has two equal real roots, what is the value of k?',
    options: ['1', '2', '4', '-2'],
    correctIndex: 1,
    explanation:
      'For equal roots, D = b² - 4ac = 0 → (-4)² - 4(2)(k) = 0 → 16 - 8k = 0 → k = 2.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'गणित (Mathematics)',
      conceptTitle: 'द्विघात समीकरण का विविक्तकर (Discriminant) और मूलों की प्रकृति',
      conceptSummary:
        'समीकरण ax² + bx + c = 0 में विविक्तकर D = b² - 4ac से पता चलता है कि मूल वास्तविक व भिन्न (D > 0), बराबर (D = 0), या काल्पनिक (D < 0) हैं।',
      keyFormulaOrRule: 'D = b² - 4ac',
      question:
        'यदि द्विघात समीकरण 2x² - 4x + k = 0 के दोनों मूल बराबर हैं, तो k का मान क्या होगा?',
      options: ['1', '2', '4', '-2'],
      explanation:
        'बराबर मूलों के लिए D = 0 → (-4)² - 4(2)(k) = 0 → 16 = 8k → k = 2।',
    },
  },
  {
    id: 'seg-k12-math-2',
    trackId: 'k12-subj-maths',
    trackTitle: 'Mathematics (Class 9–12)',
    segmentNumber: 2,
    conceptTitle: 'Standard Derivative & Chain Rule',
    conceptSummary:
      'The derivative of sin(f(x)) with respect to x is cos(f(x)) · f′(x). Always multiply by the derivative of the inner function.',
    keyFormulaOrRule: 'd/dx [sin(ax + b)] = a cos(ax + b)',
    conceptDurationSec: 18,
    question: 'What is the derivative of y = sin(3x + 5) with respect to x?',
    options: [
      'cos(3x + 5)',
      '3 cos(3x + 5)',
      '-3 cos(3x + 5)',
      '3 sin(3x + 5)',
    ],
    correctIndex: 1,
    explanation:
      'By Chain Rule, d/dx[sin(3x + 5)] = cos(3x + 5) · d/dx(3x + 5) = 3 cos(3x + 5).',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'गणित (Mathematics)',
      conceptTitle: 'अवकलन (Derivative) और श्रृंखला नियम (Chain Rule)',
      conceptSummary:
        'sin(f(x)) का अवकलन cos(f(x)) · f′(x) होता है। हमेशा अंदर वाले फलन के अवकलन से गुणा करें।',
      keyFormulaOrRule: 'd/dx [sin(ax + b)] = a cos(ax + b)',
      question: 'x के सापेक्ष y = sin(3x + 5) का अवकलन (Derivative) क्या होगा?',
      options: [
        'cos(3x + 5)',
        '3 cos(3x + 5)',
        '-3 cos(3x + 5)',
        '3 sin(3x + 5)',
      ],
      explanation:
        'Chain Rule से d/dx[sin(3x + 5)] = cos(3x + 5) × 3 = 3 cos(3x + 5)।',
    },
  },

  // 3. PHYSICS
  {
    id: 'seg-k12-phy-1',
    trackId: 'k12-subj-physics',
    trackTitle: 'Physics (Class 9–12)',
    segmentNumber: 1,
    conceptTitle: 'Gauss’s Law in Electrostatics',
    conceptSummary:
      'The total electric flux through any closed surface is equal to 1/ε₀ times the net electric charge enclosed within that closed surface, independent of the shape or size of the surface.',
    keyFormulaOrRule: 'Φ = ∮ E · dA = q_enclosed / ε₀',
    conceptDurationSec: 18,
    question:
      'If a point charge +q is placed at the centre of a cube of side L, what is the electric flux passing through ONE face of the cube?',
    options: ['q / ε₀', 'q / 4ε₀', 'q / 6ε₀', '6q / ε₀'],
    correctIndex: 2,
    explanation:
      'By Gauss’s Law, total flux through all 6 faces is q/ε₀. By symmetry, flux through each face is q / (6ε₀).',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'भौतिक विज्ञान (Physics)',
      conceptTitle: 'गॉस का नियम (Gauss’s Law) और विद्युत फ्लक्स',
      conceptSummary:
        'किसी बंद पृष्ठ से गुजरने वाला कुल विद्युत फ्लक्स उस पृष्ठ के अंदर स्थित कुल आवेश का 1/ε₀ गुना होता है।',
      keyFormulaOrRule: 'Φ = q_enclosed / ε₀',
      question:
        'यदि L भुजा वाले घन (Cube) के केंद्र पर +q आवेश रखा है, तो घन के केवल एक फलक (One Face) से गुजरने वाला विद्युत फ्लक्स कितना होगा?',
      options: ['q / ε₀', 'q / 4ε₀', 'q / 6ε₀', '6q / ε₀'],
      explanation:
        'गॉस के नियम से पूरे घन (6 फलक) से कुल फ्लक्स q/ε₀ है, अतः एक फलक से फ्लक्स q / 6ε₀ होगा।',
    },
  },
  {
    id: 'seg-k12-phy-2',
    trackId: 'k12-subj-physics',
    trackTitle: 'Physics (Class 9–12)',
    segmentNumber: 2,
    conceptTitle: 'Ohm’s Law & Series-Parallel Resistance',
    conceptSummary:
      'When resistors are connected in parallel, the potential difference across each resistor is the same, and the reciprocal of equivalent resistance equals the sum of reciprocals.',
    keyFormulaOrRule: '1/R_eq = 1/R₁ + 1/R₂',
    conceptDurationSec: 18,
    question:
      'Two resistors of 6 Ω and 3 Ω are connected in parallel. What is their equivalent resistance?',
    options: ['9 Ω', '4.5 Ω', '2 Ω', '1.5 Ω'],
    correctIndex: 2,
    explanation:
      '1/R_eq = 1/6 + 1/3 = 3/6 = 1/2 → R_eq = 2 Ω.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'भौतिक विज्ञान (Physics)',
      conceptTitle: 'ओम का नियम और समानांतर क्रम प्रतिरोध',
      conceptSummary:
        'समानांतर क्रम (Parallel) में जुड़े प्रतिरोधों के सिरों पर विभवांतर समान रहता है।',
      keyFormulaOrRule: '1/R_eq = 1/R₁ + 1/R₂',
      question:
        '6 Ω और 3 Ω के दो प्रतिरोध समानांतर क्रम (Parallel) में जुड़े हैं। इनका तुल्य प्रतिरोध क्या होगा?',
      options: ['9 Ω', '4.5 Ω', '2 Ω', '1.5 Ω'],
      explanation: '1/R_eq = 1/6 + 1/3 = 3/6 = 1/2 → R_eq = 2 Ω।',
    },
  },

  // 4. BIOLOGY
  {
    id: 'seg-k12-bio-1',
    trackId: 'k12-subj-biology',
    trackTitle: 'Biology (Class 9–12)',
    segmentNumber: 1,
    conceptTitle: 'DNA Replication & Semi-Conservative Model',
    conceptSummary:
      'Meselson and Stahl proved that DNA replication is semi-conservative: each newly formed double-stranded DNA molecule retains one original parental strand and one newly synthesized strand.',
    keyFormulaOrRule: '1 Parental Strand + 1 New Strand (5′ → 3′ synthesis)',
    conceptDurationSec: 18,
    question:
      'Which enzyme is primarily responsible for synthesizing the new DNA strand in the 5′ → 3′ direction during replication?',
    options: [
      'RNA Primase',
      'DNA Polymerase III',
      'DNA Ligase',
      'Topoisomerase',
    ],
    correctIndex: 1,
    explanation:
      'DNA Polymerase III adds deoxyribonucleotides in the 5′ → 3′ direction using the 3′ → 5′ template strand.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'जीव विज्ञान (Biology)',
      conceptTitle: 'DNA प्रतिकृति (Replication) और अर्ध-संरक्षी मॉडल',
      conceptSummary:
        'मेसेल्सन और स्टाल ने सिद्ध किया कि DNA प्रतिकृति अर्ध-संरक्षी होती है, जिसमें प्रत्येक नए DNA में एक पैतृक रज्जुक और एक नया रज्जुक होता है।',
      keyFormulaOrRule: 'संश्लेषण दिशा: 5′ → 3′',
      question:
        'DNA प्रतिकृति के दौरान 5′ → 3′ दिशा में नए DNA रज्जुक का संश्लेषण मुख्य रूप से किस एंजाइम द्वारा होता है?',
      options: [
        'RNA प्राइमेज',
        'DNA पॉलीमरेज III',
        'DNA लाइगेज',
        'टोपोआइसोमरेज',
      ],
      explanation:
        'DNA पॉलीमरेज III 5′ → 3′ दिशा में नए न्यूक्लियोटाइड्स जोड़ता है।',
    },
  },

  // 5. ACCOUNTANCY
  {
    id: 'seg-k12-acc-1',
    trackId: 'k12-subj-accountancy',
    trackTitle: 'Accountancy (Class 11–12)',
    segmentNumber: 1,
    conceptTitle: 'Golden Rules of Accounting & Sacrificing Ratio',
    conceptSummary:
      'When a new partner is admitted into a partnership firm, existing partners sacrifice a part of their profit share. Sacrificing Ratio = Old Ratio − New Ratio.',
    keyFormulaOrRule: 'Sacrificing Ratio = Old Share − New Share',
    conceptDurationSec: 18,
    question:
      'In a partnership firm, Goodwill brought in by a new partner in cash is shared by old partners in which ratio?',
    options: [
      'Old Profit Sharing Ratio',
      'New Profit Sharing Ratio',
      'Sacrificing Ratio',
      'Gaining Ratio',
    ],
    correctIndex: 2,
    explanation:
      'Premium for Goodwill is distributed among the sacrificing partners in their Sacrificing Ratio (Old Share − New Share).',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'लेखाशास्त्र (Accountancy)',
      conceptTitle: 'साझेदारी प्रवेश और त्याग अनुपात (Sacrificing Ratio)',
      conceptSummary:
        'नए साझेदार के प्रवेश पर पुराने साझेदार अपने लाभ का कुछ हिस्सा त्यागते हैं। त्याग अनुपात = पुराना अनुपात − नया अनुपात।',
      keyFormulaOrRule: 'त्याग अनुपात = पुराना हिस्सा − नया हिस्सा',
      question:
        'नए साझेदार द्वारा नकद लाई गई ख्याति (Goodwill) को पुराने साझेदार किस अनुपात में बाँटते हैं?',
      options: [
        'पुराने लाभ-हानि अनुपात में',
        'नए लाभ-हानि अनुपात में',
        'त्याग अनुपात (Sacrificing Ratio) में',
        'लाभ प्राप्ति अनुपात में',
      ],
      explanation:
        'ख्याति की राशि पुराने साझेदारों में उनके त्याग अनुपात (Sacrificing Ratio) में बाँटी जाती है।',
    },
  },

  // 6. BUSINESS STUDIES
  {
    id: 'seg-k12-bus-1',
    trackId: 'k12-subj-business',
    trackTitle: 'Business Studies (Class 11–12)',
    segmentNumber: 1,
    conceptTitle: 'Fayol’s Principles: Unity of Command vs Unity of Direction',
    conceptSummary:
      'Unity of Command means one subordinate should receive orders from only one boss. Unity of Direction means one head and one plan for a group of activities having the same objective.',
    keyFormulaOrRule: '1 Boss per Employee = Unity of Command',
    conceptDurationSec: 18,
    question:
      'Which principle of Henri Fayol prevents dual subordination and confusion in authority?',
    options: [
      'Scalar Chain',
      'Unity of Command',
      'Esprit de Corps',
      'Division of Work',
    ],
    correctIndex: 1,
    explanation:
      'Unity of Command states that each employee should receive orders from one superior only, avoiding dual subordination.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'व्यवसाय अध्ययन (Business Studies)',
      conceptTitle: 'हेनरी फेयोल के सिद्धांत: आदेश की एकता',
      conceptSummary:
        'आदेश की एकता (Unity of Command) के अनुसार एक कर्मचारी को केवल एक ही अधिकारी से आदेश मिलना चाहिए।',
      keyFormulaOrRule: '1 कर्मचारी = 1 अधिकारी (आदेश की एकता)',
      question:
        'हेनरी फेयोल का कौन-सा सिद्धांत दोहरी अधीनता (Dual Subordination) और भ्रम को रोकता है?',
      options: [
        'सोपान श्रृंखला (Scalar Chain)',
        'आदेश की एकता (Unity of Command)',
        'सहयोग की भावना (Esprit de Corps)',
        'कार्य का विभाजन',
      ],
      explanation:
        'आदेश की एकता के तहत प्रत्येक कर्मचारी को केवल एक ही बॉस से आदेश मिलता है।',
    },
  },

  // 7. ECONOMICS
  {
    id: 'seg-k12-eco-1',
    trackId: 'k12-subj-economics',
    trackTitle: 'Economics (Class 11–12)',
    segmentNumber: 1,
    conceptTitle: 'Investment Multiplier & MPC',
    conceptSummary:
      'The Investment Multiplier (k) measures the ratio of change in national income (ΔY) to the initial change in investment (ΔI). Higher the Marginal Propensity to Consume (MPC), higher the multiplier.',
    keyFormulaOrRule: 'k = ΔY / ΔI = 1 / (1 − MPC)',
    conceptDurationSec: 18,
    question:
      'If the Marginal Propensity to Consume (MPC) is 0.75, what is the value of the Investment Multiplier (k)?',
    options: ['2', '3', '4', '5'],
    correctIndex: 2,
    explanation: 'k = 1 / (1 − 0.75) = 1 / 0.25 = 4.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'अर्थशास्त्र (Economics)',
      conceptTitle: 'निवेश गुणक (Investment Multiplier) और MPC',
      conceptSummary:
        'निवेश गुणक (k) राष्ट्रीय आय में परिवर्तन (ΔY) और निवेश में परिवर्तन (ΔI) का अनुपात है।',
      keyFormulaOrRule: 'k = 1 / (1 − MPC)',
      question:
        'यदि सीमांत उपभोग प्रवृत्ति (MPC) का मान 0.75 है, तो निवेश गुणक (k) का मान क्या होगा?',
      options: ['2', '3', '4', '5'],
      explanation: 'k = 1 / (1 − 0.75) = 1 / 0.25 = 4।',
    },
  },

  // 8. HISTORY
  {
    id: 'seg-k12-his-1',
    trackId: 'k12-subj-history',
    trackTitle: 'History (Class 9–12)',
    segmentNumber: 1,
    conceptTitle: 'Harappan Civilisation: Town Planning & Drainage',
    conceptSummary:
      'Harappan cities like Mohenjodaro were divided into a raised Citadel and a Lower Town, featuring a grid-pattern street system and covered brick drains.',
    keyFormulaOrRule: 'Citadel (West, Higher) + Lower Town (East, Larger)',
    conceptDurationSec: 18,
    question:
      'Which Harappan site is famous for its dockyard and tidal port structure?',
    options: ['Kalibangan', 'Lothal', 'Banawali', 'Rakhigarhi'],
    correctIndex: 1,
    explanation:
      'Lothal (in Gujarat) had a large brick-built dockyard connected to the Gulf of Khambhat.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'इतिहास (History)',
      conceptTitle: 'हड़प्पा सभ्यता: नगर नियोजन और बंदरगाह',
      conceptSummary:
        'हड़प्पा सभ्यता के नगर दो भागों—दुर्ग (Citadel) और निचला शहर (Lower Town)—में विभाजित थे और इनमें ग्रिड पद्धति की सड़कें थीं।',
      keyFormulaOrRule: 'लोथल = प्राचीन गोदीबाड़ा (Dockyard)',
      question:
        'निम्नलिखित में से कौन-सा हड़प्पा स्थल अपने विशाल गोदीबाड़ा (Dockyard / बंदरगाह) के लिए प्रसिद्ध है?',
      options: ['कालीबंगा', 'लोथल', 'बनावली', 'राखीगढ़ी'],
      explanation:
        'गुजरात में स्थित लोथल अपने ईंटों से बने विशाल गोदीबाड़ा (Dockyard) के लिए प्रसिद्ध है।',
    },
  },

  // 9. POLITICAL SCIENCE
  {
    id: 'seg-k12-pol-1',
    trackId: 'k12-subj-polsci',
    trackTitle: 'Political Science (Class 11–12)',
    segmentNumber: 1,
    conceptTitle: '73rd Constitutional Amendment & Panchayati Raj',
    conceptSummary:
      'The 73rd Amendment Act (1992) added Part IX and the 11th Schedule to the Constitution, establishing a 3-tier Panchayati Raj system with 1/3rd reservation for women.',
    keyFormulaOrRule: '73rd Amendment = Part IX + 11th Schedule (29 Subjects)',
    conceptDurationSec: 18,
    question:
      'How many functional subjects are listed in the 11th Schedule of the Indian Constitution for Panchayats?',
    options: ['18', '22', '29', '33'],
    correctIndex: 2,
    explanation:
      'The 11th Schedule added by the 73rd Amendment contains 29 functional items for Panchayats.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'राजनीति विज्ञान (Political Science)',
      conceptTitle: '73वाँ संविधान संशोधन और पंचायती राज',
      conceptSummary:
        '73वें संविधान संशोधन (1992) द्वारा भाग-9 और 11वीं अनुसूची जोड़ी गई, जिसमें त्रि-स्तरीय पंचायती राज व्यवस्था का प्रावधान है।',
      keyFormulaOrRule: '11वीं अनुसूची = 29 विषय',
      question:
        'भारतीय संविधान की 11वीं अनुसूची में पंचायतों के लिए कुल कितने विषय सूचीबद्ध हैं?',
      options: ['18', '22', '29', '33'],
      explanation:
        '73वें संशोधन द्वारा जोड़ी गई 11वीं अनुसूची में पंचायतों के लिए 29 विषय शामिल हैं।',
    },
  },

  // 10. GEOGRAPHY
  {
    id: 'seg-k12-geo-1',
    trackId: 'k12-subj-geography',
    trackTitle: 'Geography (Class 9–12)',
    segmentNumber: 1,
    conceptTitle: 'Demographic Transition Theory',
    conceptSummary:
      'Demographic Transition describes how a society progresses from high birth & high death rates (Stage 1) to high birth & falling death rates (Stage 2), and finally to low birth & low death rates (Stage 3).',
    keyFormulaOrRule: 'Stage 1: High-High → Stage 2: High-Low → Stage 3: Low-Low',
    conceptDurationSec: 18,
    question:
      'In which stage of the Demographic Transition Theory does population growth rate reach its peak due to rapidly falling death rates?',
    options: ['Stage 1', 'Stage 2', 'Stage 3', 'Post-Transition Stage'],
    correctIndex: 1,
    explanation:
      'In Stage 2, improvements in sanitation and healthcare lower death rates sharply while birth rates remain high, causing rapid population growth.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'भूगोल (Geography)',
      conceptTitle: 'जनांकिकीय संक्रमण सिद्धांत (Demographic Transition)',
      conceptSummary:
        'यह सिद्धांत बताता है कि समाज उच्च जन्म-उच्च मृत्यु दर (प्रथम अवस्था) से निम्न जन्म-निम्न मृत्यु दर (तृतीय अवस्था) की ओर कैसे बढ़ता है।',
      keyFormulaOrRule: 'द्वितीय अवस्था = तीव्र जनसंख्या वृद्धि',
      question:
        'जनांकिकीय संक्रमण सिद्धांत की किस अवस्था में मृत्यु दर में तेजी से गिरावट के कारण जनसंख्या वृद्धि सर्वाधिक होती है?',
      options: ['प्रथम अवस्था', 'द्वितीय अवस्था', 'तृतीय अवस्था', 'चतुर्थ अवस्था'],
      explanation:
        'द्वितीय अवस्था में स्वास्थ्य सुधारों से मृत्यु दर तेजी से घटती है जबकि जन्म दर उच्च बनी रहती है।',
    },
  },

  // 11. CLASS 9 SCIENCE
  {
    id: 'seg-k12-sci-1',
    trackId: 'k12-subj-science',
    trackTitle: 'Science (Class 9–10)',
    segmentNumber: 1,
    conceptTitle: 'Newton’s Second Law of Motion & Momentum',
    conceptSummary:
      'The rate of change of momentum of an object is directly proportional to the applied unbalanced force and takes place in the direction in which the force acts.',
    keyFormulaOrRule: 'F = m · a  (SI Unit: Newton)',
    conceptDurationSec: 18,
    question:
      'A force of 20 N acts on a body of mass 4 kg. What is the acceleration produced?',
    options: ['4 m/s²', '5 m/s²', '16 m/s²', '80 m/s²'],
    correctIndex: 1,
    explanation: 'a = F / m = 20 N / 4 kg = 5 m/s².',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'विज्ञान (Science)',
      conceptTitle: 'न्यूटन का गति का दूसरा नियम और संवेग',
      conceptSummary:
        'किसी वस्तु के संवेग में परिवर्तन की दर उस पर लगने वाले असंतुलित बल के समानुपाती होती है।',
      keyFormulaOrRule: 'F = m · a  (मात्रक: न्यूटन)',
      question:
        '4 kg द्रव्यमान की वस्तु पर 20 N का बल लगाने पर कितना त्वरण (Acceleration) उत्पन्न होगा?',
      options: ['4 m/s²', '5 m/s²', '16 m/s²', '80 m/s²'],
      explanation: 'a = F / m = 20 / 4 = 5 m/s²।',
    },
  },

  // 12. ENGLISH
  {
    id: 'seg-k12-eng-1',
    trackId: 'k12-subj-english',
    trackTitle: 'English Core & Grammar (Class 9–12)',
    segmentNumber: 1,
    conceptTitle: 'Subject-Verb Concord & Modals',
    conceptSummary:
      'When two singular subjects are joined by "neither...nor" or "either...or", the verb agrees with the nearer subject.',
    keyFormulaOrRule: 'Neither A nor B + Verb (agrees with B)',
    conceptDurationSec: 18,
    question:
      'Choose the correct verb: "Neither the teacher nor the students ____ present in the lab."',
    options: ['was', 'is', 'were', 'has been'],
    correctIndex: 2,
    explanation:
      'With "neither...nor", the verb agrees with the nearer subject ("students", which is plural), so "were" is correct.',
    questionDurationSec: 25,
    hindi: {
      trackTitle: 'अंग्रेज़ी (English Core & Grammar)',
      conceptTitle: 'Subject-Verb Concord (कर्त्ता-क्रिया सामंजस्य)',
      conceptSummary:
        'जब दो कर्त्ता "neither...nor" या "either...or" से जुड़े हों, तो क्रिया (Verb) अपने सबसे नजदीकी कर्त्ता के अनुसार लगती है।',
      keyFormulaOrRule: 'Neither A nor B + Verb (B के अनुसार)',
      question:
        'सही विकल्प चुनें: "Neither the teacher nor the students ____ present in the lab."',
      options: ['was', 'is', 'were', 'has been'],
      explanation:
        'नजदीकी कर्त्ता "students" बहुवचन (Plural) है, इसलिए "were" सही उत्तर है।',
    },
  },
];

export const K12_SUBJECT_ONLINE_TESTS: OnlineTest[] = [
  {
    id: 'test-k12-chemistry',
    titleEn: 'Chemistry Full Subject Practice Test (Class 9–12)',
    titleHi: 'रसायन विज्ञान (Chemistry) — विषयवार ऑनलाइन टेस्ट',
    category: 'Chemistry',
    durationMins: 10,
    marksPerQuestion: 2,
    negativeMarking: 0.5,
    isPublished: true,
    createdAt: '2026-11-05',
    questions: [
      {
        id: 'chem-q1',
        questionEn:
          'What is the molarity of pure water (density = 1 g/mL, molar mass = 18 g/mol)?',
        questionHi: 'शुद्ध जल (घनत्व = 1 g/mL, अणुभार = 18) की मोलरता क्या होती है?',
        optionsEn: ['18 M', '55.55 M', '1.0 M', '36.5 M'],
        optionsHi: ['18 M', '55.55 M', '1.0 M', '36.5 M'],
        correctIndex: 1,
        explanationEn: 'Molarity = 1000 g / 18 g/mol = 55.55 M.',
        explanationHi: 'मोलरता = 1000 / 18 = 55.55 M।',
      },
      {
        id: 'chem-q2',
        questionEn: 'Which of the following is a colligative property?',
        questionHi: 'निम्नलिखित में से कौन-सा अणुसंख्य गुणधर्म (Colligative Property) है?',
        optionsEn: [
          'Surface tension',
          'Viscosity',
          'Osmotic pressure',
          'Refractive index',
        ],
        optionsHi: ['पृष्ठ तनाव', 'श्यानता', 'परासरण दाब (Osmotic Pressure)', 'अपवर्तनांक'],
        correctIndex: 2,
        explanationEn:
          'Osmotic pressure depends only on the number of solute particles, hence it is a colligative property.',
        explanationHi: 'परासरण दाब विलेय के कणों की संख्या पर निर्भर करता है।',
      },
    ],
    longQuestions: [
      {
        id: 'chem-lq1',
        questionEn:
          'State Raoult’s Law for a solution containing volatile liquids. Explain positive and negative deviations from ideal behaviour with suitable examples.',
        questionHi:
          'वाष्पशील द्रवों के विलयन के लिए राउल्ट का नियम लिखिए। आदर्श व्यवहार से धनात्मक और ऋणात्मक विचलन को उदाहरण सहित समझाइए।',
        maxMarks: 5,
        wordLimit: 150,
      },
      {
        id: 'chem-lq2',
        questionEn:
          'Derive the Nernst equation for a single electrode potential and explain how it is used to calculate the equilibrium constant of a cell reaction.',
        questionHi:
          'एकल इलेक्ट्रोड विभव के लिए नर्नस्ट समीकरण व्युत्पन्न कीजिए और बताइए कि सेल अभिक्रिया का साम्यावस्था स्थिरांक कैसे ज्ञात किया जाता है।',
        maxMarks: 5,
        wordLimit: 150,
      },
    ],
  },
  {
    id: 'test-k12-maths',
    titleEn: 'Mathematics Full Subject Practice Test (Class 9–12)',
    titleHi: 'गणित (Mathematics) — विषयवार ऑनलाइन टेस्ट',
    category: 'Mathematics',
    durationMins: 10,
    marksPerQuestion: 2,
    negativeMarking: 0.5,
    isPublished: true,
    createdAt: '2026-11-05',
    questions: [
      {
        id: 'math-q1',
        questionEn: 'What is the value of sin²(30°) + cos²(30°)?',
        questionHi: 'sin²(30°) + cos²(30°) का मान क्या होता है?',
        optionsEn: ['0', '1/2', '1', '√3/2'],
        optionsHi: ['0', '1/2', '1', '√3/2'],
        correctIndex: 2,
        explanationEn: 'By trigonometric identity, sin²θ + cos²θ = 1 for all θ.',
        explanationHi: 'त्रिकोणमितीय सर्वसमिका के अनुसार sin²θ + cos²θ = 1।',
      },
      {
        id: 'math-q2',
        questionEn: 'What is the integral of ∫ eˣ dx?',
        questionHi: '∫ eˣ dx का समाकलन (Integral) क्या होता है?',
        optionsEn: ['eˣ + C', 'x·eˣ + C', 'eˣ⁻¹ + C', 'ln(x) + C'],
        optionsHi: ['eˣ + C', 'x·eˣ + C', 'eˣ⁻¹ + C', 'ln(x) + C'],
        correctIndex: 0,
        explanationEn: 'The integral of eˣ with respect to x is eˣ + C.',
        explanationHi: 'eˣ का समाकलन eˣ + C होता है।',
      },
    ],
    longQuestions: [
      {
        id: 'math-lq1',
        questionEn:
          'Prove that the function f(x) = x² is continuous at x = 2, and find the derivative of y = sin(x²) + cos(2x) with respect to x.',
        questionHi:
          'सिद्ध कीजिए कि फलन f(x) = x², x = 2 पर संतत (Continuous) है, तथा y = sin(x²) + cos(2x) का x के सापेक्ष अवकलन ज्ञात कीजिए।',
        maxMarks: 5,
        wordLimit: 150,
      },
    ],
  },
  {
    id: 'test-k12-physics',
    titleEn: 'Physics Full Subject Practice Test (Class 9–12)',
    titleHi: 'भौतिक विज्ञान (Physics) — विषयवार ऑनलाइन टेस्ट',
    category: 'Physics',
    durationMins: 10,
    marksPerQuestion: 2,
    negativeMarking: 0.5,
    isPublished: true,
    createdAt: '2026-11-05',
    questions: [
      {
        id: 'phy-q1',
        questionEn: 'What is the SI unit of Electric Potential?',
        questionHi: 'विद्युत विभव (Electric Potential) का SI मात्रक क्या है?',
        optionsEn: ['Coulomb', 'Volt', 'Ohm', 'Tesla'],
        optionsHi: ['कूलॉम', 'वोल्ट (Volt)', 'ओम', 'टेस्ला'],
        correctIndex: 1,
        explanationEn: 'Electric potential is measured in Volts (Joule per Coulomb).',
        explanationHi: 'विद्युत विभव का SI मात्रक वोल्ट (जूल/कूलॉम) है।',
      },
      {
        id: 'phy-q2',
        questionEn: 'Which mirror is used as a rear-view mirror in vehicles?',
        questionHi: 'वाहनों में पश्च-दृश्य (Rear-view) दर्पण के रूप में किसका उपयोग होता है?',
        optionsEn: [
          'Concave mirror',
          'Convex mirror',
          'Plane mirror',
          'Parabolic mirror',
        ],
        optionsHi: ['अवतल दर्पण', 'उत्तल दर्पण (Convex Mirror)', 'समतल दर्पण', 'परवलयिक दर्पण'],
        correctIndex: 1,
        explanationEn:
          'A convex mirror forms a virtual, erect, and diminished image with a wider field of view.',
        explanationHi: 'उत्तल दर्पण सीधा, छोटा प्रतिबिंब और विस्तृत दृष्टि क्षेत्र देता है।',
      },
    ],
    longQuestions: [
      {
        id: 'phy-lq1',
        questionEn:
          'State Gauss’s Theorem in electrostatics. Use it to derive an expression for the electric field intensity due to an infinitely long straight uniformly charged wire.',
        questionHi:
          'स्थिरवैद्युतिकी में गॉस का प्रमेय लिखिए। इसकी सहायता से अनंत लंबाई के एकसमान आवेशित सीधे तार के कारण विद्युत क्षेत्र की तीव्रता का सूत्र व्युत्पन्न कीजिए।',
        maxMarks: 5,
        wordLimit: 150,
      },
    ],
  },
  {
    id: 'test-k12-biology',
    titleEn: 'Biology Full Subject Practice Test (Class 9–12)',
    titleHi: 'जीव विज्ञान (Biology) — विषयवार ऑनलाइन टेस्ट',
    category: 'Biology',
    durationMins: 10,
    marksPerQuestion: 2,
    negativeMarking: 0.5,
    isPublished: true,
    createdAt: '2026-11-05',
    questions: [
      {
        id: 'bio-q1',
        questionEn: 'Which organelle is known as the powerhouse of the cell?',
        questionHi: 'कोशिका का ऊर्जा गृह (Powerhouse of the Cell) किसे कहा जाता है?',
        optionsEn: ['Ribosome', 'Mitochondria', 'Golgi apparatus', 'Lysosome'],
        optionsHi: ['राइबोसोम', 'माइटोकॉन्ड्रिया', 'गॉल्जीकाय', 'लाइसोसोम'],
        correctIndex: 1,
        explanationEn: 'Mitochondria generate ATP through cellular respiration.',
        explanationHi: 'माइटोकॉन्ड्रिया कोशिकीय श्वसन द्वारा ATP ऊर्जा उत्पन्न करता है।',
      },
    ],
    longQuestions: [
      {
        id: 'bio-lq1',
        questionEn:
          'Describe the semi-conservative mode of DNA replication with a neat labelled diagram and explain the role of DNA Polymerase and DNA Ligase.',
        questionHi:
          'DNA की अर्ध-संरक्षी प्रतिकृति (Semi-conservative Replication) का सचित्र वर्णन कीजिए तथा DNA पॉलीमरेज और DNA लाइगेज की भूमिका स्पष्ट कीजिए।',
        maxMarks: 5,
        wordLimit: 150,
      },
    ],
  },
  {
    id: 'test-k12-accountancy',
    titleEn: 'Accountancy Full Subject Practice Test (Class 11–12)',
    titleHi: 'लेखाशास्त्र (Accountancy) — विषयवार ऑनलाइन टेस्ट',
    category: 'Accountancy',
    durationMins: 10,
    marksPerQuestion: 2,
    negativeMarking: 0.5,
    isPublished: true,
    createdAt: '2026-11-05',
    questions: [
      {
        id: 'acc-q1',
        questionEn: 'What is the fundamental Accounting Equation?',
        questionHi: 'लेखांकन का मूल समीकरण (Accounting Equation) क्या है?',
        optionsEn: [
          'Assets = Liabilities + Capital',
          'Assets = Liabilities − Capital',
          'Capital = Assets + Liabilities',
          'Profit = Assets − Liabilities',
        ],
        optionsHi: [
          'संपत्तियाँ = दायित्व + पूँजी',
          'संपत्तियाँ = दायित्व − पूँजी',
          'पूँजी = संपत्तियाँ + दायित्व',
          'लाभ = संपत्तियाँ − दायित्व',
        ],
        correctIndex: 0,
        explanationEn: 'Total Assets always equal Total Liabilities plus Owner’s Capital.',
        explanationHi: 'कुल संपत्तियाँ हमेशा कुल दायित्व और पूँजी के योग के बराबर होती हैं।',
      },
    ],
    longQuestions: [
      {
        id: 'acc-lq1',
        questionEn:
          'Distinguish between Sacrificing Ratio and Gaining Ratio. Explain the accounting treatment of Goodwill at the time of admission of a new partner.',
        questionHi:
          'त्याग अनुपात (Sacrificing Ratio) और लाभ प्राप्ति अनुपात (Gaining Ratio) में अंतर स्पष्ट कीजिए। नए साझेदार के प्रवेश पर ख्याति के लेखांकन व्यवहार को समझाइए।',
        maxMarks: 5,
        wordLimit: 150,
      },
    ],
  },
];
