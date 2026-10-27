/**
 * Verified facts about the AWS Certified Solutions Architect - Associate
 * (SAA-C03) exam. Every entry carries a `sourceId` pointing into
 * `examSources` so each number on the Syllabus page is traceable to the
 * AWS page it came from. Facts were checked against AWS pages on
 * 27 October 2026 - always re-confirm at booking time because AWS can
 * change pricing, policies and guide versions.
 */

/** Primary AWS documents the exam facts were taken from. */
export const examSources = {
  examGuide: {
    title: 'AWS Certified Solutions Architect - Associate (SAA-C03) Exam Guide (HTML, current)',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html',
  },
  examGuidePdf: {
    title: 'SAA-C03 Exam Guide v1.1 (PDF, 2023)',
    url: 'https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Exam-Guide.pdf',
  },
  examPage: {
    title: 'AWS Certified Solutions Architect - Associate (certification page)',
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
  },
  beforeTesting: {
    title: 'AWS Certification policies - Before testing (fees, rescheduling, ID, accommodations)',
    url: 'https://aws.amazon.com/certification/policies/before-testing/',
  },
  afterTesting: {
    title: 'AWS Certification policies - After testing (retakes, results)',
    url: 'https://aws.amazon.com/certification/policies/after-testing/',
  },
  revisions: {
    title: 'SAA-C03 Exam Guide - Revisions (in/out-of-scope changes)',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-revisions.html',
  },
  inScope: {
    title: 'SAA-C03 - In-scope AWS services',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-in-scope-services.html',
  },
  outOfScope: {
    title: 'SAA-C03 - Out-of-scope AWS services',
    url: 'https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/saa-03-out-of-scope-services.html',
  },
  samples: {
    title: 'SAA-C03 Official Sample Exam Questions (PDF)',
    url: 'https://d1.awsstatic.com/training-and-certification/docs-sa-assoc/AWS-Certified-Solutions-Architect-Associate_Sample-Questions.pdf',
  },
  certPrep: {
    title: 'Prepare for your AWS Certification exam (Skill Builder exam prep)',
    url: 'https://aws.amazon.com/certification/certification-prep/',
  },
  recertification: {
    title: 'AWS Recertification',
    url: 'https://aws.amazon.com/certification/recertification/',
  },
};

/**
 * Headline exam facts rendered as the "Exam at a glance" grid.
 * `value` is the short figure; `detail` adds the qualifier AWS states.
 */
export const examFacts = [
  {
    id: 'code',
    label: 'Exam code',
    value: 'SAA-C03',
    detail: 'Associate level. AWS certification page and exam guide still reference SAA-C03 as the current version.',
    sourceId: 'examPage',
  },
  {
    id: 'questions',
    label: 'Total questions',
    value: '65',
    detail: '50 scored + 15 unscored. Unscored questions are not identified on the exam.',
    sourceId: 'examGuide',
  },
  {
    id: 'duration',
    label: 'Duration',
    value: '130 min',
    detail: 'A 30-minute "ESL +30" extension can be requested once by non-native English speakers, before registering.',
    sourceId: 'beforeTesting',
  },
  {
    id: 'passing',
    label: 'Passing score',
    value: '720 / 1000',
    detail: 'Scaled score 100-1,000. Pass/fail only. Compensatory scoring: you do not need to pass each domain.',
    sourceId: 'examGuide',
  },
  {
    id: 'cost-usd',
    label: 'Cost (USD)',
    value: '$150',
    detail: 'Per attempt. Extra cost may apply depending on foreign-exchange rates and local taxes.',
    sourceId: 'examPage',
  },
  {
    id: 'cost-inr',
    label: 'Cost (INR)',
    value: '₹12,829.50',
    detail: 'AWS lists INR for Associate exams; INR is accepted only on the Pearson MindHub voucher store. "Applicable taxes may apply" - confirm the final amount at checkout.',
    sourceId: 'beforeTesting',
  },
  {
    id: 'validity',
    label: 'Validity',
    value: '3 years',
    detail: 'Recertify by passing the latest version of this exam or the Solutions Architect - Professional exam.',
    sourceId: 'examPage',
  },
  {
    id: 'delivery',
    label: 'Delivery',
    value: 'Test center or online',
    detail: 'Pearson VUE test center, or online proctored exam (English online proctoring is offered 24x7).',
    sourceId: 'beforeTesting',
  },
];

/** Question formats, copied from the exam guide's "Response types" section. */
export const questionFormats = [
  {
    id: 'multiple-choice',
    name: 'Multiple choice',
    description: 'One correct response and three incorrect responses (distractors).',
  },
  {
    id: 'multiple-response',
    name: 'Multiple response',
    description: 'Two or more correct responses out of five or more response options. Select all correct ones - partial answers do not score.',
  },
];

/** Scoring rules stated by AWS. */
export const scoringRules = [
  'Unanswered questions are scored as incorrect; there is no penalty for guessing - always answer every question.',
  'Only 50 of the 65 questions affect your score; 15 unscored questions are used by AWS to evaluate future questions.',
  'Results are a scaled score from 100 to 1,000; the minimum passing score is 720. Scaling equates different exam forms of slightly different difficulty.',
  'The exam is compensatory: you only need to pass the exam overall, not each content domain.',
  'Section-level feedback on the score report is general information - interpret it with caution.',
];

/** Registration, retake and policy facts relevant to planning. */
export const policyFacts = [
  {
    label: 'Target candidate',
    value: 'At least 1 year of hands-on experience designing cloud solutions that use AWS services.',
    sourceId: 'examGuide',
  },
  {
    label: 'Prerequisites',
    value: 'None are listed by AWS for taking the exam (the 1 year of experience is a recommendation for the target candidate).',
    sourceId: 'examGuide',
  },
  {
    label: 'Retake policy',
    value: 'If you fail, wait 14 calendar days. There is no limit on attempts, but the full registration fee applies each time. A passed exam cannot be retaken for two years unless a new exam version (new series code) is released.',
    sourceId: 'afterTesting',
  },
  {
    label: 'Reschedule / cancel',
    value: 'Reschedule up to 24 hours before the exam (max two reschedules per appointment). Cancelling more than 24 hours ahead refunds the fee paid; a late cancellation or no-show forfeits it.',
    sourceId: 'beforeTesting',
  },
  {
    label: 'ID requirement',
    value: 'Valid government-issued identification is required; different ID rules apply for online and in-person testing - read the policy before exam day.',
    sourceId: 'beforeTesting',
  },
  {
    label: 'Discount',
    value: 'Holders of one active AWS Certification get 50% off their next AWS Certification exam.',
    sourceId: 'examPage',
  },
  {
    label: 'Languages',
    value: 'English, French (France), Italian, Japanese, Korean, Portuguese (Brazil), Spanish (Latin America), Spanish (Spain), Simplified Chinese, Traditional Chinese. The Italian exam retires after 31 December 2026.',
    sourceId: 'examPage',
  },
  {
    label: 'Price updates',
    value: 'AWS updates exam prices at least annually in May to reflect exchange rates, with at least 30 days notice for mid-year changes.',
    sourceId: 'beforeTesting',
  },
];

/** Free and paid official practice material (AWS Skill Builder). */
export const officialPractice = [
  {
    name: 'Official Practice Question Set (SAA-C03)',
    detail: '20 AWS-authored questions with detailed feedback; free with a Skill Builder account.',
  },
  {
    name: 'Official Practice Exam (SAA-C03)',
    detail: 'Full-length, exam-style scoring with feedback on each answer choice; requires a Skill Builder subscription.',
  },
  {
    name: 'Exam Prep Plan / Exam Prep Standard Course',
    detail: 'Structured AWS-run prep content on Skill Builder; see the prep page for what is currently included.',
  },
];

/** Typical scenario-question patterns (editorial guidance, not AWS-published). */
export const questionPatterns = [
  {
    keyword: 'MOST cost-effective / LOWEST cost',
    meaning: 'Pick the cheapest option that still satisfies every stated requirement (Spot, S3 storage classes, serverless, VPC endpoints, single NAT per AZ trade-offs).',
  },
  {
    keyword: 'LEAST operational overhead',
    meaning: 'Prefer fully managed / serverless services (Lambda, Fargate, DynamoDB, Aurora Serverless, managed policies) over self-managed EC2 solutions.',
  },
  {
    keyword: 'Highly available / fault tolerant',
    meaning: 'Spread across multiple Availability Zones; add Multi-AZ databases, load balancers, Auto Scaling; for Regions add Route 53 failover or replication.',
  },
  {
    keyword: 'Decouple / loosely coupled',
    meaning: 'Introduce SQS, SNS, EventBridge or Kinesis between components instead of direct synchronous calls.',
  },
  {
    keyword: 'MOST secure / least privilege',
    meaning: 'IAM roles over keys, private subnets, security groups referencing security groups, KMS/SSE, VPC endpoints, no public access.',
  },
  {
    keyword: 'Minimal changes to the application',
    meaning: 'Prefer lift-and-shift style managed equivalents (Storage Gateway, RDS Proxy, ElastiCache, Application Migration Service) over rewrites.',
  },
  {
    keyword: 'Real-time vs near-real-time vs batch',
    meaning: 'Kinesis Data Streams = real-time; Firehose = near-real-time delivery (buffered); S3 + Athena/Glue/EMR = batch analytics.',
  },
];

/** Exam-day and preparation strategy tips (editorial, grounded in the scoring rules above). */
export const examStrategy = [
  'Answer every question: unanswered = wrong and there is no guessing penalty. Flag hard questions and return to them.',
  'Budget time: 130 minutes for 65 questions is about 2 minutes per question. Aim to finish a first pass in about 100 minutes and keep the rest for flagged questions.',
  'Read the last sentence of the question first (what is being asked: cost, availability, security, operational overhead), then the scenario.',
  'Eliminate options that violate a stated requirement. Two options are usually obviously wrong; decide between the remaining two using the key phrase (cost, overhead, latency).',
  'For multiple-response questions, the number of required answers is stated in the question - select exactly that many.',
  'If you are a non-native English speaker, request ESL +30 before you register - it adds 30 minutes at no cost.',
  'Use the exam Help feature: it lists the short service names used on the exam.',
];
