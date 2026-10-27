import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Security Hub. Schema: see s3.js. */
export default {
  tagline: 'One place to see security findings and compliance checks across AWS accounts, Regions and services.',
  intro: [
    'AWS Security Hub gives a comprehensive view of your security posture: it collects security data across accounts, AWS services and supported third-party products and helps you prioritise the most important issues.',
    'It runs continuous, automated checks against security standards such as AWS Foundational Security Best Practices, CIS AWS Foundations Benchmark, PCI DSS and NIST; most checks rely on AWS Config, which must be enabled.',
    'It aggregates findings from services such as Amazon GuardDuty, Amazon Inspector and Amazon Macie, normalised into a common format (the AWS Security Finding Format), so you can search them in one place.',
    'Administrator and member accounts (through AWS Organizations) and cross-Region aggregation give a single organization-wide view.',
    'Automation rules can update or suppress findings, and EventBridge integration lets you send findings to ticketing or trigger remediation with Lambda or Systems Manager.',
    'AWS documentation now names the posture-management capability "Security Hub CSPM"; the exam guide still lists AWS Security Hub, and the key idea is the same: aggregate and prioritise findings.',
  ],
  useCases: [
    { title: 'Single pane of glass', detail: 'View GuardDuty, Inspector, Macie and Config findings across all accounts together.' },
    { title: 'Continuous compliance checks', detail: 'Score accounts against CIS, PCI DSS or AWS best practices.' },
    { title: 'Automated response', detail: 'EventBridge triggers remediation when a high-severity finding is created.' },
  ],
  importance: {
    points: [
      'Domain 1 security-governance service: the answer to "centralise and prioritise security findings from several services and accounts".',
      'It aggregates and checks; it does not detect threats itself (GuardDuty) or scan vulnerabilities (Inspector).',
    ],
  },
  cli: [
    { command: 'aws securityhub enable-security-hub --enable-default-standards', description: 'Enable Security Hub and the default standards.' },
    { command: 'aws securityhub get-findings --filters \'{"SeverityLabel":[{"Value":"CRITICAL","Comparison":"EQUALS"}]}\'', description: 'List critical findings.' },
    { command: 'aws securityhub batch-update-findings --finding-identifiers Id=<id>,ProductArn=<arn> --workflow Status=RESOLVED', description: 'Mark findings as resolved.' },
    { command: 'aws securityhub create-finding-aggregator --region-linking-mode ALL_REGIONS', description: 'Aggregate findings from all Regions into the home Region.' },
    { command: 'aws securityhub describe-standards', description: 'List available security standards.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): count critical findings',
        language: 'python',
        code: `import boto3

hub = boto3.client("securityhub")
resp = hub.get_findings(
    Filters={"SeverityLabel": [{"Value": "CRITICAL", "Comparison": "EQUALS"}]},
    MaxResults=100,
)
print(len(resp["Findings"]), "critical findings")`,
      },
    ],
  },
  examples: [
    {
      title: 'Organization-wide security dashboard',
      scenario: 'A security team wants one view of GuardDuty, Inspector and Macie findings from 25 accounts and several Regions.',
      steps: [
        'Enable AWS Config in all accounts and Security Hub through Organizations with a delegated administrator.',
        'Enable GuardDuty, Inspector and Macie; their findings flow into Security Hub automatically.',
        'Create a finding aggregator so all Regions appear in one Region.',
        'Use EventBridge to notify on critical findings or trigger remediation.',
      ],
    },
  ],
  diagram: {
    title: 'Security Hub aggregation',
    nodes: [
      ['gd', 'GuardDuty', 'security', 1, 0],
      ['insp', 'Inspector', 'security', 0, 1],
      ['sh', 'AWS Security Hub', 'security', 1, 1],
      ['macie', 'Macie', 'security', 1, 2],
      ['eb', 'EventBridge', 'integration', 2, 1],
      ['rem', 'Lambda / Systems Manager remediation', 'integration', 3, 1],
    ],
    edges: [
      ['gd', 'sh', 'Findings'],
      ['insp', 'sh', 'Findings'],
      ['macie', 'sh', 'Findings'],
      ['sh', 'eb', 'Finding events'],
      ['eb', 'rem', 'Auto-remediate'],
    ],
    steps: [
      'GuardDuty, Inspector, Macie and Config-based checks send findings to Security Hub.',
      'Security Hub normalises, scores and consolidates them across accounts and Regions.',
      'EventBridge routes selected findings to notification or remediation workflows.',
    ],
  },
  questionTypes: [
    { pattern: 'Centralise security findings across accounts and services', hint: 'AWS Security Hub.' },
    { pattern: 'Check against CIS / PCI DSS benchmarks', hint: 'Security Hub security standards (requires Config).' },
    { pattern: 'Automate response to findings', hint: 'EventBridge + Lambda/SSM.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A security team wants a single dashboard that aggregates findings from Amazon GuardDuty, Amazon Inspector and Amazon Macie across multiple accounts. Which service should they use?',
      options: ['AWS Artifact', 'AWS Security Hub', 'AWS CloudTrail', 'Amazon CloudWatch Logs'],
      answer: ['B'],
      explanation: 'Security Hub collects and prioritises findings from AWS security services and partners in one place.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company must continuously check its accounts against the CIS AWS Foundations Benchmark and see a compliance score. Which service provides this?',
      options: ['Amazon Route 53', 'AWS Security Hub security standards', 'Amazon Macie', 'AWS Shield'],
      answer: ['B'],
      explanation: 'Security Hub runs automated checks against standards such as CIS, PCI DSS and AWS Foundational Security Best Practices.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which statements about AWS Security Hub are true? (Select TWO.)',
      multi: true,
      options: ['It encrypts S3 objects.', 'It only works in a single account.', 'It replaces Amazon GuardDuty for threat detection.', 'It aggregates findings from multiple AWS security services into a standard format.', 'Most of its control checks rely on AWS Config being enabled.'],
      answer: ['D', 'E'],
      explanation: 'Security Hub consolidates findings and uses Config to evaluate controls. It does not replace the detection services or encrypt data, and it supports multiple accounts.',
    },
  ],
  keyFacts: [
    'Security Hub aggregates and prioritises findings; GuardDuty, Inspector and Macie are the detection sources.',
    'Security standards: AWS Foundational Security Best Practices, CIS, PCI DSS, NIST.',
    'Control checks need AWS Config enabled; Security Hub only sees findings created after it is enabled.',
    'Supports Organizations delegated admin and cross-Region aggregation.',
    'Automation: automation rules and EventBridge integration.',
  ],
  traps: [
    { clue: 'Aggregate findings across services and accounts', answer: 'Security Hub.' },
    { clue: 'Detect threats from logs and DNS', answer: 'GuardDuty (a source for Security Hub).' },
    { clue: 'Compliance evidence reports and agreements', answer: 'AWS Artifact.' },
  ],
  related: ['guardduty', 'inspector', 'macie', 'config', 'organizations', 'eventbridge'],
  sources: [
    { title: 'What is AWS Security Hub CSPM?', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html' },
    { title: 'Security standards in Security Hub', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/standards-view-manage.html' },
    { title: 'Cross-Region aggregation', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/finding-aggregation.html' },
    { title: 'AWS CLI securityhub commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/securityhub/index.html' },
  ],
};
