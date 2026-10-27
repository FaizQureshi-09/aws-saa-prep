import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon GuardDuty. Schema: see s3.js. */
export default {
  tagline: 'Continuous, agentless threat detection that analyses your AWS logs for malicious activity.',
  intro: [
    'Amazon GuardDuty is a managed threat detection service that uses threat intelligence, anomaly detection and machine learning on AWS data sources.',
    'Core data sources: AWS CloudTrail events, VPC Flow Logs and DNS logs; optional protections cover S3 data events, EKS audit logs, RDS login activity, Lambda network activity and EBS malware scanning.',
    'There is nothing to install - you enable it and it analyses independent copies of the log streams without affecting performance.',
    'Findings (for example an EC2 instance communicating with a known crypto-mining host, or unusual API calls from an IAM user) are sent to the console, EventBridge and Security Hub.',
    'GuardDuty detects; it does not block. Combine it with EventBridge, Lambda or Step Functions to automate remediation.',
    'Multi-account: enable through AWS Organizations with a delegated administrator for organization-wide coverage.',
  ],
  useCases: [
    { title: 'Detect compromised instances and credentials', detail: 'Findings flag instances contacting malicious IPs or API calls from unusual locations.' },
    { title: 'S3 and account threat monitoring', detail: 'Detect suspicious bucket access and anomalous IAM behaviour.' },
    { title: 'Automated response', detail: 'EventBridge rule on a finding triggers Lambda to isolate an instance.' },
  ],
  importance: {
    points: [
      'Task 1.2 names GuardDuty explicitly as a security service with an appropriate use case.',
      'Key exam skill: pick the right security service - GuardDuty (threat detection), Inspector (vulnerabilities), Macie (sensitive data), Detective (investigation), Security Hub (aggregation).',
    ],
  },
  cli: [
    { command: 'aws guardduty create-detector --enable', description: 'Enable GuardDuty in a Region.' },
    { command: 'aws guardduty list-detectors', description: 'Find the detector ID.' },
    { command: 'aws guardduty list-findings --detector-id <id> --finding-criteria \'{"Criterion":{"severity":{"Gte":7}}}\'', description: 'List high-severity findings.' },
    { command: 'aws guardduty get-findings --detector-id <id> --finding-ids <finding-id>', description: 'Read finding details.' },
    { command: 'aws guardduty enable-organization-admin-account --admin-account-id 111111111111', description: 'Delegate administration for the organization.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list high-severity findings',
        language: 'python',
        code: `import boto3

gd = boto3.client("guardduty")
detector = gd.list_detectors()["DetectorIds"][0]
ids = gd.list_findings(
    DetectorId=detector,
    FindingCriteria={"Criterion": {"severity": {"Gte": 7}}},
)["FindingIds"]
if ids:
    for f in gd.get_findings(DetectorId=detector, FindingIds=ids)["Findings"]:
        print(f["Type"], f["Severity"], f["Title"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Auto-isolate a compromised instance',
      scenario: 'GuardDuty reports an EC2 instance communicating with a command-and-control server.',
      steps: [
        'EventBridge rule matches GuardDuty findings of that type with high severity.',
        'The rule invokes a Lambda function that replaces the instance\'s security group with a quarantine group.',
        'SNS notifies the security team; Detective helps investigate the root cause.',
      ],
    },
  ],
  diagram: {
    title: 'GuardDuty detection and response',
    nodes: [
      ['logs', 'CloudTrail, VPC Flow, DNS logs', 'integration', 0, 1],
      ['gd', 'Amazon GuardDuty', 'security', 1, 1],
      ['eb', 'EventBridge rule', 'integration', 2, 1],
      ['fn', 'Lambda remediation', 'compute', 3, 1],
      ['hub', 'Security Hub', 'security', 1, 0],
    ],
    edges: [
      ['logs', 'gd', 'Analyses'],
      ['gd', 'hub', 'Findings'],
      ['gd', 'eb', 'Finding event'],
      ['eb', 'fn', 'Auto-remediate'],
    ],
    steps: [
      'GuardDuty analyses CloudTrail, VPC Flow Logs and DNS logs (and optional sources) using threat intelligence and ML.',
      'It produces findings with severity, shown in the console and sent to Security Hub.',
      'EventBridge can route findings to Lambda or other targets to remediate automatically.',
    ],
  },
  questionTypes: [
    { pattern: 'Detect malicious activity or compromised resources', hint: 'GuardDuty.' },
    { pattern: 'Which security service?', hint: 'GuardDuty threats; Inspector vulnerabilities; Macie sensitive S3 data; Config compliance; CloudTrail audit.' },
    { pattern: 'Automated remediation', hint: 'GuardDuty -> EventBridge -> Lambda.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company wants to detect unusual API calls, communication with known malicious IP addresses and potential cryptocurrency mining on EC2 without deploying agents. Which service should be used?',
      options: ['Amazon Inspector', 'Amazon GuardDuty', 'AWS Config', 'AWS Trusted Advisor'],
      answer: ['B'],
      explanation: 'GuardDuty analyses CloudTrail, VPC Flow Logs and DNS logs to detect threats with no agents; Inspector scans for vulnerabilities.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which log sources does Amazon GuardDuty analyse by default? (Select TWO.)',
      multi: true,
      options: ['AWS CloudTrail management events', 'VPC Flow Logs', 'Application logs on EC2 file systems', 'ALB access logs only', 'Database slow-query logs'],
      answer: ['A', 'B'],
      explanation: 'GuardDuty natively analyses CloudTrail events, VPC Flow Logs and DNS query logs; it does not read arbitrary application log files.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A finding shows an EC2 instance contacting a known malicious host. The company wants it quarantined automatically. What is the BEST design?',
      options: ['Email the security team and wait', 'EventBridge rule on the GuardDuty finding invoking Lambda that applies a restrictive security group', 'Stop GuardDuty', 'Increase the instance size'],
      answer: ['B'],
      explanation: 'GuardDuty publishes findings to EventBridge, which can trigger Lambda for automated remediation.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company wants GuardDuty enabled automatically for all existing and future accounts in its organization. What should it do?',
      options: ['Enable GuardDuty manually in each account only after an incident', 'Create a VPC peering connection between all accounts', 'Use AWS Artifact to enable it', 'Designate a delegated administrator through AWS Organizations and auto-enable GuardDuty for members'],
      answer: ['D'],
      explanation: 'GuardDuty integrates with Organizations: a delegated administrator can enable it for all member accounts, including new ones.',
    },
  ],
  keyFacts: [
    'GuardDuty is agentless and uses CloudTrail, VPC Flow Logs and DNS logs as core sources.',
    'It detects threats; it does not block traffic or patch vulnerabilities.',
    'Findings integrate with EventBridge and Security Hub; use Detective to investigate root cause.',
    'Enable it in every Region you use; manage centrally with Organizations delegated administrator.',
    'Inspector = vulnerabilities (CVEs); Macie = sensitive data in S3; GuardDuty = threats and anomalies.',
    'Findings carry severity and a type (for example UnauthorizedAccess:EC2/SSHBruteForce); trusted IP lists, threat lists and suppression rules tune detections.',
  ],
  traps: [
    { clue: 'Detect crypto-mining, malicious IP contact, credential compromise', answer: 'GuardDuty.' },
    { clue: 'Scan EC2/ECR/Lambda for software vulnerabilities', answer: 'Inspector.' },
    { clue: 'Find PII in S3', answer: 'Macie.' },
    { clue: 'Block malicious requests', answer: 'WAF / security groups / NACLs - not GuardDuty.' },
  ],
  related: ['security-hub', 'inspector', 'macie', 'detective', 'cloudtrail', 'eventbridge'],
  sources: [
    { title: 'What is Amazon GuardDuty?', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html' },
    { title: 'GuardDuty foundational data sources', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_data-sources.html' },
    { title: 'GuardDuty findings', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_findings.html' },
    { title: 'AWS CLI guardduty commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/guardduty/index.html' },
  ],
};
