import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Compute Optimizer. Schema: see s3.js. */
export default {
  tagline: 'Machine-learning right-sizing recommendations that cut cost and improve performance.',
  intro: [
    'AWS Compute Optimizer analyses the configuration and utilisation metrics of your AWS resources and gives right-sizing recommendations and idle-resource findings to reduce cost and improve performance.',
    'It supports EC2 instances, Auto Scaling groups, EBS volumes, Lambda functions, ECS services on Fargate, RDS and Aurora databases and several other resource types.',
    'After you opt in, it analyses the last 14 days of Amazon CloudWatch metrics by default; the paid enhanced infrastructure metrics feature extends the lookback period to 93 days.',
    'Each resource is classified, for example as under-provisioned, over-provisioned or optimized, and the console shows up to three recommended options with projected utilisation and price-performance trade-offs.',
    'You can view findings across accounts and Regions when the management account of an organization opts in; the service itself has no additional charge for the basic recommendations.',
  ],
  useCases: [
    { title: 'Right-size EC2 instances', detail: 'Find over-provisioned instances that can move to a smaller size or a Graviton type.' },
    { title: 'Tune Lambda memory', detail: 'Pick the memory setting that balances cost and duration.' },
    { title: 'Remove waste', detail: 'Identify idle or oversized EBS volumes and unused resources.' },
  ],
  importance: {
    points: [
      'A Domain 4 (cost-optimised compute) service: the answer when a question asks how to determine optimal instance sizes from historical utilisation.',
      'Contrast with Cost Explorer (spend analysis), Trusted Advisor-style checks and Auto Scaling (runtime elasticity).',
    ],
  },
  cli: [
    { command: 'aws compute-optimizer update-enrollment-status --status Active', description: 'Opt in to Compute Optimizer.' },
    { command: 'aws compute-optimizer get-ec2-instance-recommendations', description: 'List EC2 instance recommendations.' },
    { command: 'aws compute-optimizer get-lambda-function-recommendations', description: 'List Lambda memory recommendations.' },
    { command: 'aws compute-optimizer get-recommendation-summaries', description: 'Summarise findings by resource type.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): over-provisioned EC2 instances',
        language: 'python',
        code: `import boto3

co = boto3.client("compute-optimizer")
resp = co.get_ec2_instance_recommendations(filters=[{"name": "Finding", "values": ["Overprovisioned"]}])
for r in resp["instanceRecommendations"]:
    best = r["recommendationOptions"][0]["instanceType"]
    print(r["instanceArn"], r["currentInstanceType"], "->", best)`,
      },
    ],
  },
  examples: [
    {
      title: 'Cut cost without hurting performance',
      scenario: 'A company suspects many EC2 instances are larger than needed.',
      steps: [
        'Opt in from the management account so findings cover all accounts.',
        'Filter for over-provisioned instances and review the recommended types and projected utilisation.',
        'Resize in a maintenance window or update the launch template for Auto Scaling groups.',
        'Re-check after a few weeks.',
      ],
    },
  ],
  diagram: {
    title: 'Compute Optimizer workflow',
    nodes: [
      ['res', 'EC2, ASG, EBS, Lambda, Fargate', 'compute', 0, 1],
      ['cw', 'CloudWatch utilisation metrics', 'management', 1, 0],
      ['co', 'Compute Optimizer (ML analysis)', 'analytics', 1, 1],
      ['rec', 'Right-sizing recommendations', 'management', 2, 1],
      ['eng', 'Engineer applies change', 'actor', 3, 1],
    ],
    edges: [
      ['res', 'co', 'Configuration'],
      ['cw', 'co', 'Metrics (14 days)'],
      ['co', 'rec', 'Findings'],
      ['rec', 'eng', 'Resize or stop'],
    ],
    steps: [
      'Compute Optimizer reads resource configuration and CloudWatch utilisation history.',
      'Machine learning classifies resources and proposes better-fitting configurations.',
      'Engineers apply the changes to reduce cost or fix under-provisioning.',
    ],
  },
  questionTypes: [
    { pattern: 'Determine optimal instance size from utilisation', hint: 'AWS Compute Optimizer.' },
    { pattern: 'Compute Optimizer vs Cost Explorer', hint: 'Right-size resources vs analyse spend.' },
  ],
  questions: [
    {
      source: 'mock', domain: 4,
      stem: 'A company wants data-driven recommendations on whether its EC2 instances are over-provisioned based on historical CPU and network utilisation. Which service should be used?',
      options: ['AWS Compute Optimizer', 'AWS Config', 'AWS Cost Explorer', 'AWS CloudTrail'],
      answer: ['A'],
      explanation: 'Compute Optimizer uses CloudWatch metrics and machine learning to recommend right-sizing.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Which resource types can AWS Compute Optimizer analyse? (Select TWO.)',
      multi: true,
      options: ['Amazon EC2 instances', 'AWS Organizations accounts', 'AWS Lambda functions', 'Amazon CloudFront distributions', 'Amazon Route 53 hosted zones'],
      answer: ['A', 'C'],
      explanation: 'Compute Optimizer supports EC2, Auto Scaling groups, EBS, Lambda, ECS on Fargate and databases, among others.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'How much utilisation history does AWS Compute Optimizer analyse by default?',
      options: ['Only the current minute', 'The last 24 hours', 'The last 5 years', 'The last 14 days of CloudWatch metrics'],
      answer: ['D'],
      explanation: 'The default lookback is 14 days; enhanced infrastructure metrics (paid) extend it to 93 days.',
    },
  ],
  keyFacts: [
    'Opt-in service using CloudWatch metrics; 14-day default lookback, 93 days with enhanced infrastructure metrics (paid).',
    'Supports EC2, Auto Scaling groups, EBS, Lambda, ECS on Fargate, RDS/Aurora and more.',
    'Findings: under-provisioned, over-provisioned, optimized (plus idle findings).',
    'Management-account opt-in gives organization-wide view.',
  ],
  traps: [
    { clue: 'Right-size instances from utilisation history', answer: 'Compute Optimizer.' },
    { clue: 'Analyse and forecast spend', answer: 'Cost Explorer.' },
  ],
  related: ['cost-management', 'ec2', 'ec2-auto-scaling', 'lambda', 'cloudwatch', 'ebs'],
  sources: [
    { title: 'What is AWS Compute Optimizer?', url: 'https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html' },
    { title: 'Enhanced infrastructure metrics', url: 'https://docs.aws.amazon.com/compute-optimizer/latest/ug/enhanced-infrastructure-metrics.html' },
    { title: 'AWS CLI compute-optimizer commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/compute-optimizer/index.html' },
  ],
};
