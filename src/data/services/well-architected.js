import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for the AWS Well-Architected Framework. Schema: see s3.js. */
export default {
  tagline: 'The six pillars and design principles that every SAA-C03 question is built on.',
  intro: [
    'The AWS Well-Architected Framework is a set of best practices for designing and operating reliable, secure, efficient, cost-effective and sustainable workloads.',
    'It has six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization and Sustainability.',
    'The SAA-C03 exam validates your ability to design solutions "based on the AWS Well-Architected Framework"; its four content domains map to Security, Reliability, Performance Efficiency and Cost Optimization.',
    'Each pillar has design principles, for example "implement a strong identity foundation" (Security), "automatically recover from failure" (Reliability) and "stop guessing capacity" (Reliability/Performance).',
    'The AWS Well-Architected Tool (in console) lets you review workloads against the pillars, record answers and track improvements; lenses add domain-specific guidance (for example Serverless, SaaS).',
    'Trade-offs are expected: the best answer balances pillars according to the stated requirements.',
  ],
  useCases: [
    { title: 'Architecture reviews', detail: 'Assess an existing workload against the pillars and prioritise remediation.' },
    { title: 'Design decisions', detail: 'Use the principles to choose between options in a design.' },
    { title: 'Exam reasoning', detail: 'Map a question keyword (cheapest, most secure, least overhead) to the pillar being tested.' },
  ],
  importance: {
    points: [
      'The exam guide states the exam is based on the Well-Architected Framework and describes designing "secure, resilient, high-performing and cost-optimized" architectures.',
      'Knowing the pillars lets you decode what a question optimises for, which eliminates distractors fast.',
      'The AWS Well-Architected Tool is on the in-scope service list.',
    ],
  },
  cli: [
    { command: 'aws wellarchitected list-workloads', description: 'List workloads in the Well-Architected Tool.' },
    { command: 'aws wellarchitected create-workload --workload-name shop --description "Online shop" --environment PRODUCTION --lenses wellarchitected --review-owner you@example.com --aws-regions ap-south-1', description: 'Create a workload to review.' },
    { command: 'aws wellarchitected list-lens-reviews --workload-id <id>', description: 'List lens reviews for a workload.' },
    { command: 'aws wellarchitected get-lens-review-report --workload-id <id> --lens-alias wellarchitected', description: 'Fetch a review report.' },
    { command: 'aws wellarchitected list-lenses', description: 'List the available lenses (for example the Well-Architected Framework or Serverless lens).' },
    { command: 'aws wellarchitected create-milestone --workload-id <id> --milestone-name pre-launch', description: 'Save a milestone of the workload review.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list workloads',
        language: 'python',
        code: `import boto3

wa = boto3.client("wellarchitected", region_name="ap-south-1")
for workload in wa.list_workloads()["WorkloadSummaries"]:
    print(workload["WorkloadName"], workload["RiskCounts"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Decode a question with the pillars',
      scenario: '"Which solution is the MOST cost-effective while remaining highly available?"',
      steps: [
        'Cost Optimization is the tiebreaker, but Reliability is a hard requirement - discard single-AZ options.',
        'Among multi-AZ options, prefer managed/serverless or right-sized resources.',
        'Check the remaining option for unnecessary components (extra NAT gateways, over-provisioned instances).',
      ],
    },
  ],
  diagram: {
    title: 'The six pillars and the exam domains',
    nodes: [
      ['sec', 'Security (Domain 1)', 'security', 0, 0],
      ['rel', 'Reliability (Domain 2)', 'compute', 1, 0],
      ['perf', 'Performance Efficiency (Domain 3)', 'analytics', 2, 0],
      ['cost', 'Cost Optimization (Domain 4)', 'storage', 0, 2],
      ['ops', 'Operational Excellence', 'integration', 1, 2],
      ['sus', 'Sustainability', 'ml', 2, 2],
      ['arch', 'Well-Architected workload', 'actor', 1, 1],
    ],
    edges: [
      ['sec', 'arch', 'Protect'],
      ['rel', 'arch', 'Recover'],
      ['perf', 'arch', 'Scale'],
      ['cost', 'arch', 'Optimise'],
      ['ops', 'arch', 'Operate'],
      ['sus', 'arch', 'Reduce impact'],
    ],
    steps: [
      'Every workload is evaluated against all six pillars.',
      'The four exam domains correspond to Security, Reliability, Performance Efficiency and Cost Optimization.',
      'Operational Excellence and Sustainability influence answers (automation, right-sizing) even though they are not separate domains.',
    ],
  },
  questionTypes: [
    { pattern: 'Identify the pillar', hint: 'Least privilege = Security; multi-AZ = Reliability; right-sizing = Cost/Performance; automation = Operational Excellence.' },
    { pattern: 'Design principles', hint: 'Stop guessing capacity, automate, test recovery, go global in minutes.' },
    { pattern: 'Trade-offs', hint: 'Choose the option that meets all stated requirements at the stated priority (cost vs availability).' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'Which Well-Architected design principle encourages using monitoring and automation to replace failed components without manual intervention?',
      options: ['Automatically recover from failure (Reliability)', 'Implement traceability (Security)', 'Stop spending money on undifferentiated heavy lifting (Cost Optimization)', 'Experiment more often (Performance Efficiency)'],
      answer: ['A'],
      explanation: 'Automatically recovering from failure is a Reliability pillar design principle - monitor key indicators and trigger automation when thresholds are breached.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Granting each service only the permissions it needs and enabling MFA for administrators best supports which Well-Architected pillar?',
      options: ['Performance Efficiency', 'Security', 'Sustainability', 'Cost Optimization'],
      answer: ['B'],
      explanation: 'Least privilege and strong identity controls are core to the Security pillar.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A team replaces always-on over-provisioned servers with right-sized instances and Auto Scaling. Which pillar does this primarily support?',
      options: ['Cost Optimization', 'Operational Excellence', 'Security', 'None of the pillars'],
      answer: ['A'],
      explanation: 'Matching supply to demand and eliminating idle capacity is central to Cost Optimization (and also supports Sustainability and Performance Efficiency).',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which tool allows teams to review a workload against the Well-Architected pillars and record improvement plans in the AWS console?',
      options: ['AWS Well-Architected Tool', 'AWS CloudTrail', 'Amazon Inspector', 'AWS Service Catalog'],
      answer: ['A'],
      explanation: 'The AWS Well-Architected Tool is the service for reviewing workloads against the framework and tracking improvements.',
    },
  ],
  keyFacts: [
    'Six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability.',
    'Exam domains map to four pillars: Security (30%), Reliability = Resilient (26%), Performance Efficiency (24%), Cost Optimization (20%).',
    'Security principles include least privilege, traceability, protect data in transit and at rest, and automate security best practices.',
    'Reliability principles: automatically recover, test recovery procedures, scale horizontally, stop guessing capacity, manage change through automation.',
    'Cost principles: implement cloud financial management, adopt a consumption model, measure efficiency, stop spending on undifferentiated heavy lifting, analyse and attribute expenditure.',
    'Questions that say "least operational overhead" lean on managed/serverless services (Operational Excellence and Cost).',
  ],
  traps: [
    { clue: 'Question stresses "most secure"', answer: 'Least privilege, encryption, private networking, no public access.' },
    { clue: 'Question stresses "highly available / fault tolerant"', answer: 'Multi-AZ, automatic failover, no single point of failure.' },
    { clue: 'Question stresses "cost-effective"', answer: 'Right-sizing, purchase options, storage tiering, serverless - while still meeting requirements.' },
    { clue: 'Question stresses "least operational overhead"', answer: 'Managed or serverless services.' },
  ],
  related: ['global-infrastructure', 'dr-strategies', 'cost-management', 'iam', 'cloudwatch'],
  sources: [
    { title: 'AWS Well-Architected Framework', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html' },
    { title: 'The pillars of the framework', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html' },
    { title: 'AWS Well-Architected Tool', url: 'https://docs.aws.amazon.com/wellarchitected/latest/userguide/intro.html' },
    { title: 'SAA-C03 Exam Guide', url: 'https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html' },
  ],
};
