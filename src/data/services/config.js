import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Config. Schema: see s3.js. */
export default {
  tagline: 'Track resource configuration over time and evaluate it continuously against compliance rules.',
  intro: [
    'AWS Config records the configuration of supported AWS resources and the relationships between them, keeping a history of every change as configuration items.',
    'Config rules (AWS managed or custom with Lambda) evaluate resources for compliance, for example "S3 buckets must not be public" or "EBS volumes must be encrypted".',
    'Non-compliant resources can trigger automatic remediation through AWS Systems Manager Automation documents.',
    'Conformance packs bundle rules and remediation as a single deployable compliance framework; aggregators collect data across accounts and Regions.',
    'Config answers "what did this resource look like and when did it change"; it is detective (evaluates) rather than preventive, unlike SCPs or IAM policies.',
    'Config works with CloudTrail: CloudTrail shows who made the change; Config shows what the resulting configuration was and whether it complies.',
  ],
  useCases: [
    { title: 'Continuous compliance', detail: 'Detect unencrypted volumes, open security groups and public buckets.' },
    { title: 'Change tracking and troubleshooting', detail: 'See the configuration timeline of a resource before an incident.' },
    { title: 'Audit across accounts', detail: 'Aggregators and conformance packs for organization-wide reporting.' },
  ],
  importance: {
    points: [
      'Appears in Domain 1 governance and compliance scenarios (Task 1.3 aligning technologies to compliance).',
      'Exam hint: resource configuration history and compliance = Config; API activity = CloudTrail.',
    ],
  },
  cli: [
    { command: 'aws configservice put-configuration-recorder --configuration-recorder name=default,roleARN=<role-arn> --recording-group allSupported=true,includeGlobalResourceTypes=true', description: 'Set up the configuration recorder.' },
    { command: 'aws configservice put-config-rule --config-rule file://s3-public-rule.json', description: 'Create a rule (for example s3-bucket-public-read-prohibited).' },
    { command: 'aws configservice describe-compliance-by-config-rule', description: 'See compliance status of rules.' },
    { command: 'aws configservice get-resource-config-history --resource-type AWS::EC2::SecurityGroup --resource-id sg-0abc', description: 'Show the change history of a resource.' },
    { command: 'aws configservice put-remediation-configurations --remediation-configurations file://remediation.json', description: 'Attach an automatic remediation action.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list non-compliant resources',
        language: 'python',
        code: `import boto3

cfg = boto3.client("config")
resp = cfg.get_compliance_details_by_config_rule(
    ConfigRuleName="s3-bucket-public-read-prohibited",
    ComplianceTypes=["NON_COMPLIANT"],
)
for r in resp["EvaluationResults"]:
    print(r["EvaluationResultIdentifier"]["EvaluationResultQualifier"]["ResourceId"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Enforce encryption on EBS volumes',
      scenario: 'Compliance requires all EBS volumes to be encrypted, with automatic detection of violations.',
      steps: [
        'Enable Config recording in all Regions.',
        'Add the managed rule encrypted-volumes.',
        'Review non-compliant volumes in the dashboard and aggregate across accounts.',
        'Optionally add remediation (SSM Automation) or notify via EventBridge/SNS.',
      ],
    },
  ],
  diagram: {
    title: 'AWS Config recording and rules',
    nodes: [
      ['res', 'AWS resources', 'compute', 0, 1],
      ['cfg', 'AWS Config recorder', 'integration', 1, 1],
      ['rules', 'Config rules (compliance)', 'security', 2, 1],
      ['rem', 'SSM Automation remediation', 'integration', 3, 1],
      ['s3', 'S3 history bucket', 'storage', 1, 0],
    ],
    edges: [
      ['res', 'cfg', 'Config changes'],
      ['cfg', 'rules', 'Evaluate'],
      ['rules', 'rem', 'Non-compliant'],
      ['cfg', 's3', 'Stores history'],
    ],
    steps: [
      'Config continuously records resource configuration changes and stores history.',
      'Rules evaluate each change (or on a schedule) and mark resources compliant or non-compliant.',
      'Non-compliance can trigger notifications or automatic remediation.',
    ],
  },
  questionTypes: [
    { pattern: 'Compliance of resource configuration', hint: 'AWS Config rules.' },
    { pattern: 'Configuration history', hint: 'Config timeline.' },
    { pattern: 'Config vs CloudTrail', hint: 'Config = state over time; CloudTrail = API calls.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'A company must continuously verify that all S3 buckets are encrypted and not publicly readable, and view how a bucket\'s configuration changed over time. Which service should be used?',
      options: ['AWS Config', 'Amazon GuardDuty', 'Amazon Macie', 'AWS WAF'],
      answer: ['A'],
      explanation: 'Config rules evaluate resource configuration for compliance and Config keeps the configuration history.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which statement best distinguishes AWS Config from AWS CloudTrail?',
      options: ['Config records API calls; CloudTrail records resource configurations', 'Config records resource configuration and compliance; CloudTrail records API calls and who made them', 'They are the same service', 'Config monitors network traffic; CloudTrail monitors CPU'],
      answer: ['B'],
      explanation: 'Config shows the configuration state and compliance over time; CloudTrail records the API activity that caused changes.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A Config rule marks an unencrypted EBS volume as non-compliant. The company wants this to be fixed automatically. What should be configured?',
      options: ['A remediation action using AWS Systems Manager Automation', 'A larger instance', 'An S3 lifecycle rule', 'A Route 53 health check'],
      answer: ['A'],
      explanation: 'Config supports automatic remediation through SSM Automation documents when a rule evaluates a resource as non-compliant.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company wants to detect any security group that allows unrestricted SSH access (0.0.0.0/0 on port 22) and review how that group changed over time. Which service provides both?',
      options: ['AWS CloudTrail', 'AWS Config with the restricted-ssh managed rule', 'Amazon Inspector', 'VPC Flow Logs'],
      answer: ['B'],
      explanation: 'A Config managed rule evaluates security group rules for compliance and Config keeps the configuration history. CloudTrail shows only who made the API call.',
    },
  ],
  keyFacts: [
    'Config records configuration items and relationships; supports a timeline of changes per resource.',
    'Rules are managed or custom (Lambda); trigger on configuration change or periodically.',
    'Remediation uses Systems Manager Automation; conformance packs deploy rules at scale.',
    'Aggregators view compliance across accounts and Regions.',
    'Config detects and reports; it does not prevent actions (use IAM/SCPs for prevention).',
    'Config needs a configuration recorder and a delivery channel (an S3 bucket) and is enabled per Region.',
  ],
  traps: [
    { clue: 'Is this resource compliant? configuration history', answer: 'AWS Config.' },
    { clue: 'Who made the change', answer: 'CloudTrail.' },
    { clue: 'Prevent an action', answer: 'IAM/SCP, not Config.' },
  ],
  related: ['cloudtrail', 'systems-manager', 'organizations', 'security-hub', 'control-tower'],
  sources: [
    { title: 'What is AWS Config?', url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html' },
    { title: 'AWS Config rules', url: 'https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config.html' },
    { title: 'Remediating noncompliant resources', url: 'https://docs.aws.amazon.com/config/latest/developerguide/remediation.html' },
    { title: 'AWS CLI configservice commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/configservice/index.html' },
  ],
};
