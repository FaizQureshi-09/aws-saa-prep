import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Inspector. Schema: see s3.js. */
export default {
  tagline: 'Automated, continuous vulnerability scanning for EC2 instances, container images and Lambda functions.',
  intro: [
    'Amazon Inspector is a vulnerability management service that automatically discovers workloads and continually scans them for software vulnerabilities (CVEs) and unintended network exposure.',
    'It scans Amazon EC2 instances, container images in Amazon ECR and AWS Lambda functions; there is no need to schedule scans, because new or changed resources are rescanned automatically.',
    'Each finding includes the affected resource, the vulnerable package and remediation guidance; an Inspector risk score adjusts the base CVSS score using your environment (for example whether the instance is reachable from the internet).',
    'Findings are published to Amazon EventBridge and, if enabled, to AWS Security Hub, so you can notify teams or trigger automated remediation.',
    'With AWS Organizations you can designate a delegated administrator and activate Inspector for every account and Region from one place.',
    'Inspector looks for vulnerabilities and exposure in your workloads; it does not detect threats in progress (GuardDuty) or sensitive data (Macie).',
  ],
  useCases: [
    { title: 'Patch prioritisation', detail: 'Find EC2 instances with exploitable CVEs and feed Systems Manager Patch Manager.' },
    { title: 'Container image scanning', detail: 'Scan images pushed to ECR before they are deployed to ECS or EKS.' },
    { title: 'Serverless code and dependency checks', detail: 'Scan Lambda function code and libraries for known vulnerabilities.' },
  ],
  importance: {
    points: [
      'A Domain 1 service in the exam list; typical questions pick the right security service among Inspector, GuardDuty, Macie and Security Hub.',
      'Remember: Inspector = vulnerabilities in your workloads; GuardDuty = threats; Macie = sensitive data in S3.',
    ],
  },
  cli: [
    { command: 'aws inspector2 enable --resource-types EC2 ECR LAMBDA', description: 'Activate scanning for the account.' },
    { command: 'aws inspector2 list-findings --filter-criteria \'{"severity":[{"comparison":"EQUALS","value":"CRITICAL"}]}\'', description: 'List critical findings.' },
    { command: 'aws inspector2 list-coverage', description: 'Show which resources are being scanned.' },
    { command: 'aws inspector2 batch-get-account-status', description: 'Check the activation status per resource type.' },
    { command: 'aws inspector2 create-filter --name suppress-dev --action SUPPRESS --filter-criteria file://dev-filter.json', description: 'Create a suppression rule for accepted findings.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): critical findings',
        language: 'python',
        code: `import boto3

inspector = boto3.client("inspector2")
resp = inspector.list_findings(
    filterCriteria={"severity": [{"comparison": "EQUALS", "value": "CRITICAL"}]},
    maxResults=10,
)
for f in resp["findings"]:
    print(f["title"], f["resources"][0]["id"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Continuously scan a container pipeline',
      scenario: 'A team pushes images to ECR daily and must block critical vulnerabilities from production.',
      steps: [
        'Activate Inspector for ECR so new images are scanned on push and rescanned when new CVEs are published.',
        'Send critical findings to EventBridge and notify the team through SNS.',
        'Fail the deployment pipeline when a critical finding exists for the image.',
      ],
    },
  ],
  diagram: {
    title: 'Amazon Inspector scanning flow',
    nodes: [
      ['lam', 'Lambda functions', 'compute', 0, 1],
      ['ec2', 'EC2 instances', 'compute', 1, 0],
      ['insp', 'Amazon Inspector', 'security', 1, 1],
      ['ecr', 'ECR container images', 'compute', 1, 2],
      ['sh', 'Security Hub / EventBridge', 'integration', 2, 1],
      ['rem', 'Notify or remediate', 'integration', 3, 1],
    ],
    edges: [
      ['insp', 'ec2', 'Scans packages, network'],
      ['insp', 'lam', 'Scans code, libraries'],
      ['insp', 'ecr', 'Scans images'],
      ['insp', 'sh', 'Findings'],
      ['sh', 'rem', 'Automate'],
    ],
    steps: [
      'Inspector automatically discovers eligible EC2 instances, ECR images and Lambda functions.',
      'It scans them continuously and re-scans when packages change or new CVEs appear.',
      'Findings go to Security Hub and EventBridge for alerting and remediation.',
    ],
  },
  questionTypes: [
    { pattern: 'Automated vulnerability scanning of workloads', hint: 'Amazon Inspector.' },
    { pattern: 'Inspector vs GuardDuty vs Macie', hint: 'Vulnerabilities vs threats vs sensitive data.' },
    { pattern: 'Scan container images in ECR', hint: 'Inspector (enhanced scanning).' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company needs to continuously scan its EC2 instances for known software vulnerabilities and unintended network exposure, without scheduling scans manually. Which service should be used?',
      options: ['AWS Shield', 'Amazon GuardDuty', 'Amazon Macie', 'Amazon Inspector'],
      answer: ['D'],
      explanation: 'Inspector automatically discovers and continuously scans EC2, ECR and Lambda for CVEs and exposure.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which workloads can Amazon Inspector scan? (Select THREE.)',
      multi: true,
      options: ['EC2 instances', 'S3 objects for personal data', 'AWS Lambda functions', 'Route 53 hosted zones', 'Container images in Amazon ECR'],
      answer: ['A', 'C', 'E'],
      explanation: 'Inspector covers EC2, ECR images and Lambda functions. Discovering personal data in S3 is Macie.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A security team wants a central dashboard that combines Inspector findings with results from other AWS security services. What should they enable?',
      options: ['Amazon SQS', 'AWS Security Hub', 'AWS CloudFormation', 'AWS DataSync'],
      answer: ['B'],
      explanation: 'Inspector publishes findings to Security Hub, which aggregates findings from several services.',
    },
  ],
  keyFacts: [
    'Scans EC2, ECR images and Lambda functions for software vulnerabilities and network exposure.',
    'Continuous and automatic: rescans on package changes and new CVE publication; no scheduled assessments needed.',
    'Inspector risk score is the CVSS base score adjusted for your environment.',
    'Findings flow to EventBridge and Security Hub; use Organizations delegated admin for multi-account setups.',
    'It does not detect active threats (GuardDuty) or sensitive data (Macie).',
  ],
  traps: [
    { clue: 'CVE scanning of instances, images, Lambda', answer: 'Inspector.' },
    { clue: 'Detect compromised instances or unusual API activity', answer: 'GuardDuty.' },
    { clue: 'Find PII in S3', answer: 'Macie.' },
  ],
  related: ['guardduty', 'macie', 'security-hub', 'ecr', 'systems-manager', 'ec2'],
  sources: [
    { title: 'What is Amazon Inspector?', url: 'https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html' },
    { title: 'Scanning resources with Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning-resources.html' },
    { title: 'Understanding findings in Amazon Inspector', url: 'https://docs.aws.amazon.com/inspector/latest/user/findings-understanding.html' },
    { title: 'AWS CLI inspector2 commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/inspector2/index.html' },
  ],
};
