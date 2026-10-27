import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Macie. Schema: see s3.js. */
export default {
  tagline: 'Discover and protect sensitive data, such as personal information, stored in Amazon S3.',
  intro: [
    'Amazon Macie is a data security service that uses machine learning and pattern matching to discover sensitive data, such as personally identifiable information (PII), in Amazon S3.',
    'It continuously evaluates your S3 buckets, giving an inventory and flagging security and access risks such as publicly accessible buckets, unencrypted buckets or buckets shared outside the organization.',
    'Sensitive data discovery jobs scan objects on demand or on a schedule using managed data identifiers (credit card numbers, names, addresses, credentials) and your own custom data identifiers (regular expressions).',
    'Macie produces policy findings (bucket-level security issues) and sensitive data findings (what was found in which object); findings go to Amazon EventBridge and AWS Security Hub for alerts and automation.',
    'It integrates with AWS Organizations: a delegated administrator account can manage Macie for all member accounts.',
    'Macie analyses S3 only; it does not scan databases or EBS volumes, and it detects data exposure, not network threats (GuardDuty).',
  ],
  useCases: [
    { title: 'Find PII in S3', detail: 'Locate personal data in a data lake before sharing or migrating it.' },
    { title: 'Compliance support', detail: 'Continuously check that buckets holding regulated data are private and encrypted.' },
    { title: 'Automated response', detail: 'EventBridge rules trigger Lambda to quarantine objects or lock down a bucket when sensitive data is found.' },
  ],
  importance: {
    points: [
      'Part of Domain 1 data protection (Task 1.3): the standard answer for "discover sensitive data in S3".',
      'Frequently contrasted with GuardDuty (threats) and Inspector (vulnerabilities).',
    ],
  },
  cli: [
    { command: 'aws macie2 enable-macie', description: 'Enable Macie in the Region.' },
    { command: 'aws macie2 create-classification-job --job-type ONE_TIME --name pii-scan --s3-job-definition file://job.json', description: 'Create a sensitive data discovery job.' },
    { command: 'aws macie2 list-findings', description: 'List finding IDs.' },
    { command: 'aws macie2 get-findings --finding-ids <id>', description: 'Read the details of a finding.' },
    { command: 'aws macie2 create-custom-data-identifier --name employee-id --regex "EMP-[0-9]{6}"', description: 'Define a custom pattern to detect.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): start a one-time scan of a bucket',
        language: 'python',
        code: `import boto3

macie = boto3.client("macie2")
job = macie.create_classification_job(
    jobType="ONE_TIME",
    name="pii-scan",
    s3JobDefinition={"bucketDefinitions": [{"accountId": "111122223333", "buckets": ["customer-exports"]}]},
)
print(job["jobId"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Find PII before sharing a data lake',
      scenario: 'An analytics team wants to share a bucket with a partner but must be sure it holds no personal data.',
      steps: [
        'Enable Macie and run a discovery job against the bucket.',
        'Review sensitive data findings listing the object keys and data types.',
        'Remove or mask the flagged objects, then re-run the job.',
        'Alert on new findings with EventBridge and SNS.',
      ],
    },
  ],
  diagram: {
    title: 'Amazon Macie data discovery',
    nodes: [
      ['id', 'Managed and custom data identifiers', 'security', 1, 0],
      ['s3', 'S3 buckets', 'storage', 0, 1],
      ['macie', 'Amazon Macie', 'security', 1, 1],
      ['find', 'Findings (policy and sensitive data)', 'security', 2, 1],
      ['eb', 'EventBridge / Security Hub', 'integration', 3, 1],
    ],
    edges: [
      ['id', 'macie', 'Detection rules'],
      ['macie', 's3', 'Inventories and scans'],
      ['macie', 'find', 'Generates'],
      ['find', 'eb', 'Alerts and automation'],
    ],
    steps: [
      'Macie inventories your S3 buckets and checks their security posture.',
      'Discovery jobs scan objects using managed and custom data identifiers.',
      'Findings are sent to EventBridge and Security Hub for alerting or remediation.',
    ],
  },
  questionTypes: [
    { pattern: 'Discover PII or sensitive data in S3', hint: 'Amazon Macie.' },
    { pattern: 'Macie vs GuardDuty vs Inspector', hint: 'Sensitive data vs threats vs vulnerabilities.' },
    { pattern: 'Alert when a bucket becomes public', hint: 'Macie policy findings (also Config/Access Analyzer).' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company stores millions of documents in S3 and must identify which objects contain personally identifiable information. Which service is MOST suitable?',
      options: ['Amazon GuardDuty', 'Amazon Inspector', 'Amazon Macie', 'AWS Shield'],
      answer: ['C'],
      explanation: 'Macie uses machine learning and pattern matching to discover sensitive data in S3.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which of the following does Amazon Macie provide? (Select TWO.)',
      multi: true,
      options: ['Scanning EC2 instances for CVEs', 'Sensitive data discovery in S3 objects', 'Network traffic filtering', 'An inventory of S3 buckets and detection of publicly accessible or unencrypted buckets', 'DDoS mitigation'],
      answer: ['B', 'D'],
      explanation: 'Macie reports S3 bucket security posture and discovers sensitive data. CVE scanning is Inspector; DDoS is Shield.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A Macie finding must automatically start a Lambda function that tags the affected object. What is the simplest integration?',
      options: ['An S3 lifecycle rule', 'Polling the Macie console every hour', 'A VPC peering connection', 'An Amazon EventBridge rule that matches Macie findings and targets the function'],
      answer: ['D'],
      explanation: 'Macie publishes findings to EventBridge, where a rule can invoke Lambda.',
    },
  ],
  keyFacts: [
    'Macie works on Amazon S3 data only.',
    'Finding types: policy findings (bucket security) and sensitive data findings (what was found).',
    'Managed data identifiers cover PII, financial data and credentials; custom identifiers use regular expressions.',
    'Findings flow to EventBridge and Security Hub; multi-account management through Organizations.',
    'Not for threat detection (GuardDuty) or CVE scanning (Inspector).',
  ],
  traps: [
    { clue: 'PII or sensitive data in S3', answer: 'Macie.' },
    { clue: 'Compromised credentials or unusual API calls', answer: 'GuardDuty.' },
    { clue: 'Vulnerable packages on EC2', answer: 'Inspector.' },
  ],
  related: ['s3', 'guardduty', 'inspector', 'security-hub', 'kms', 'eventbridge'],
  sources: [
    { title: 'What is Amazon Macie?', url: 'https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html' },
    { title: 'Discovering sensitive data with Macie', url: 'https://docs.aws.amazon.com/macie/latest/user/discovery-supported-storage.html' },
    { title: 'Types of Macie findings', url: 'https://docs.aws.amazon.com/macie/latest/user/findings-types.html' },
    { title: 'AWS CLI macie2 commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/macie2/index.html' },
  ],
};
