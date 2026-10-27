import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Detective. Schema: see s3.js. */
export default {
  tagline: 'Investigate and find the root cause of security findings with automatically built relationship graphs.',
  intro: [
    'Amazon Detective helps analysts investigate potential security issues and quickly find the root cause by turning log data into an interactive graph of relationships and activity over time.',
    'It automatically ingests and correlates data such as AWS CloudTrail logs, Amazon VPC Flow Logs and Amazon GuardDuty findings into a behavior graph, without you collecting or organising logs.',
    'Analysts can pivot from a finding (for example from GuardDuty or Security Hub) to see which IP addresses, roles and resources were involved and how behaviour changed compared with the baseline.',
    'Detective supports multiple accounts through AWS Organizations, using an administrator account that manages member accounts.',
    'It is for investigation after detection: GuardDuty detects threats, Security Hub aggregates, Macie finds sensitive data and Detective explains what happened.',
  ],
  useCases: [
    { title: 'Investigate a GuardDuty finding', detail: 'See which instances and principals were involved and what else they did.' },
    { title: 'Scope an incident', detail: 'Check which accounts and resources a compromised credential touched.' },
    { title: 'Threat hunting', detail: 'Explore unusual API call volumes or new geolocations.' },
  ],
  importance: {
    points: [
      'A Domain 1 security service that is easy to confuse with GuardDuty; the key word is "investigate" or "root cause".',
      'It needs no setup of log pipelines: it builds the graph from existing sources.',
    ],
  },
  cli: [
    { command: 'aws detective create-graph', description: 'Enable Detective and create a behavior graph.' },
    { command: 'aws detective list-graphs', description: 'List behavior graphs in the Region.' },
    { command: 'aws detective create-members --graph-arn <arn> --accounts AccountId=444455556666,EmailAddress=sec@example.com', description: 'Invite member accounts.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list behavior graphs',
        language: 'python',
        code: `import boto3

detective = boto3.client("detective")
for g in detective.list_graphs()["GraphList"]:
    print(g["Arn"], g["CreatedTime"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Root cause of a suspicious API call',
      scenario: 'GuardDuty reports unusual API calls from an IAM role; the analyst needs to know what else the role did.',
      steps: [
        'Open the finding from GuardDuty or Security Hub and pivot into Detective.',
        'Review the role\'s API call volume, geolocation and resources over time.',
        'Identify the entry point (for example leaked credentials) and scope the impact.',
      ],
    },
  ],
  diagram: {
    title: 'Detective investigation flow',
    nodes: [
      ['src', 'CloudTrail, VPC Flow Logs, GuardDuty', 'integration', 0, 1],
      ['graph', 'Detective behavior graph', 'analytics', 1, 1],
      ['find', 'GuardDuty / Security Hub finding', 'security', 1, 0],
      ['viz', 'Investigation timelines and visuals', 'analytics', 2, 1],
      ['analyst', 'Security analyst', 'actor', 3, 1],
    ],
    edges: [
      ['src', 'graph', 'Ingested automatically'],
      ['find', 'graph', 'Pivot to investigate'],
      ['graph', 'viz', 'Visual analysis'],
      ['viz', 'analyst', 'Root cause'],
    ],
    steps: [
      'Detective continuously ingests logs and findings and builds a behavior graph.',
      'An analyst pivots from a finding into the graph.',
      'Timelines and relationships show the root cause and the blast radius.',
    ],
  },
  questionTypes: [
    { pattern: 'Investigate the root cause of a security finding', hint: 'Amazon Detective.' },
    { pattern: 'Detective vs GuardDuty', hint: 'Detect vs investigate.' },
  ],
  questions: [
    {
      source: 'mock', domain: 1,
      stem: 'After GuardDuty reports a suspicious finding, a security analyst needs to explore related activity over time to determine the root cause. Which service helps with this?',
      options: ['Amazon Detective', 'AWS Artifact', 'AWS Shield', 'Amazon Macie'],
      answer: ['A'],
      explanation: 'Detective builds relationship graphs from CloudTrail, VPC Flow Logs and GuardDuty data for investigation.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'Which data sources does Amazon Detective use to build its behavior graph? (Select TWO.)',
      multi: true,
      options: ['EBS volume data', 'Route 53 hosted zone records only', 'Amazon S3 object contents', 'AWS CloudTrail logs', 'Amazon VPC Flow Logs'],
      answer: ['D', 'E'],
      explanation: 'Detective ingests CloudTrail, VPC Flow Logs and GuardDuty findings (and EKS audit logs), not your object or volume data.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'What is the primary difference between Amazon GuardDuty and Amazon Detective?',
      options: ['GuardDuty scans containers; Detective scans S3', 'They are the same service', 'GuardDuty detects threats; Detective helps investigate their cause', 'GuardDuty investigates; Detective detects'],
      answer: ['C'],
      explanation: 'GuardDuty generates findings; Detective analyses related data to find the root cause.',
    },
  ],
  keyFacts: [
    'Builds a behavior graph automatically from CloudTrail, VPC Flow Logs and GuardDuty findings.',
    'Used after detection to find root cause and scope; no log collection setup.',
    'Supports multi-account through Organizations.',
    'Companion to GuardDuty and Security Hub; it does not block threats.',
  ],
  traps: [
    { clue: 'Root cause or investigation of findings', answer: 'Detective.' },
    { clue: 'Detect threats and anomalies', answer: 'GuardDuty.' },
  ],
  related: ['guardduty', 'security-hub', 'cloudtrail', 'vpc', 'macie'],
  sources: [
    { title: 'What is Amazon Detective?', url: 'https://docs.aws.amazon.com/detective/latest/userguide/detective-investigation-about.html' },
    { title: 'Amazon Detective behavior graphs', url: 'https://docs.aws.amazon.com/detective/latest/adminguide/graph-concepts.html' },
    { title: 'AWS CLI detective commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/detective/index.html' },
  ],
};
