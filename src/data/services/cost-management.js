import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Cost Management & Pricing Models. Schema: see s3.js. */
export default {
  tagline: 'See, control and reduce what you spend: Cost Explorer, Budgets, cost reports, tags and the right purchasing option.',
  intro: [
    'AWS Cost Management is a family of billing tools: Cost Explorer (analyse and forecast), AWS Budgets (thresholds and alerts), Cost and Usage Reports / Data Exports (the most detailed data) and Cost Anomaly Detection (spike alerts).',
    'Cost Explorer shows up to 13 months of history and forecasts up to 18 months ahead; the console is free, but each paginated Cost Explorer API request costs $0.01.',
    'AWS Budgets tracks cost, usage, Reserved Instance / Savings Plans coverage and utilisation against a limit and notifies through email or SNS (budget actions can also apply a policy or stop resources).',
    'Cost allocation tags (user-defined or AWS-generated) split spend by project, team or environment, but a tag only appears in billing data after you activate it as a cost allocation tag.',
    'Purchasing options: On-Demand (no commitment), Savings Plans and Reserved Instances (1- or 3-year commitment for steady usage), Spot (spare capacity, up to 90% off, can be interrupted) and Dedicated Hosts (licence/compliance needs).',
    'With AWS Organizations, consolidated billing combines usage from all member accounts into one bill so volume discounts and Savings Plans / Reserved Instance benefits are shared across the organization.',
  ],
  useCases: [
    { title: 'Reduce compute cost for steady workloads', detail: 'Cover the predictable baseline with Compute Savings Plans or Reserved Instances and burst with On-Demand or Spot.' },
    { title: 'Prevent bill surprises', detail: 'A Budget with forecast alerts at 80% and 100%, plus Cost Anomaly Detection for unexpected spikes.' },
    { title: 'Charge back to teams', detail: 'Activate cost allocation tags (Project, Team, Env) and group Cost Explorer or CUR data by tag or by linked account.' },
    { title: 'Deep cost analysis', detail: 'Deliver the Cost and Usage Report to S3 and query it with Athena or visualise it in Amazon Quick.' },
  ],
  importance: {
    points: [
      'Domain 4 (20% of scored content) asks you to design cost-optimised storage, compute, database and network architectures; the cheapest option that still meets the stated requirement is usually the answer.',
      'Questions test the match between a usage pattern and a purchasing model: steady = Savings Plans / Reserved, interruptible = Spot, short and unpredictable = On-Demand.',
      'Know which tool answers which question: analyse past spend (Cost Explorer), alert on a limit (Budgets), raw line items (CUR), tag-based reporting (cost allocation tags).',
    ],
  },
  cli: [
    { command: 'aws ce get-cost-and-usage --time-period Start=2026-10-01,End=2026-11-01 --granularity MONTHLY --metrics UnblendedCost --group-by Type=DIMENSION,Key=SERVICE', description: 'Monthly cost grouped by service (Cost Explorer API).' },
    { command: 'aws ce get-cost-forecast --time-period Start=2026-11-01,End=2026-12-01 --metric UNBLENDED_COST --granularity MONTHLY', description: 'Forecast next month\'s spend.' },
    { command: 'aws ce get-savings-plans-purchase-recommendation --savings-plans-type COMPUTE_SP --term-in-years ONE_YEAR --payment-option NO_UPFRONT --lookback-period-in-days THIRTY_DAYS', description: 'Get a Compute Savings Plans commitment recommendation.' },
    { command: 'aws budgets create-budget --account-id 111122223333 --budget file://budget.json --notifications-with-subscribers file://notifications.json', description: 'Create a monthly cost budget with alert subscribers.' },
    { command: 'aws ce update-cost-allocation-tags-status --cost-allocation-tags-status TagKey=Project,Status=Active', description: 'Activate a tag as a cost allocation tag.' },
    { command: 'aws ce create-anomaly-monitor --anomaly-monitor \'{"MonitorName":"all-services","MonitorType":"DIMENSIONAL","MonitorDimension":"SERVICE"}\'', description: 'Create a Cost Anomaly Detection monitor per service.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): cost per service for one month',
        language: 'python',
        code: `import boto3

ce = boto3.client("ce", region_name="us-east-1")
resp = ce.get_cost_and_usage(
    TimePeriod={"Start": "2026-10-01", "End": "2026-11-01"},
    Granularity="MONTHLY",
    Metrics=["UnblendedCost"],
    GroupBy=[{"Type": "DIMENSION", "Key": "SERVICE"}],
)
for group in resp["ResultsByTime"][0]["Groups"]:
    amount = float(group["Metrics"]["UnblendedCost"]["Amount"])
    print(f'{group["Keys"][0]}: {amount:.2f} USD')`,
      },
    ],
  },
  examples: [
    {
      title: 'Cut the bill of a steady web tier without losing flexibility',
      scenario: 'A web fleet runs 24x7 on EC2 and a few Lambda functions; the team may change instance families and Regions next year.',
      steps: [
        'Review 30 days of usage in Cost Explorer and read the Savings Plans recommendation.',
        'Buy a Compute Savings Plans commitment sized to the always-on baseline (it also discounts Fargate and Lambda).',
        'Run the burst above the baseline On-Demand or on Spot in an Auto Scaling group.',
        'Create a Budget with alerts at 80% (actual) and 100% (forecasted), and tag everything with Project and Env.',
      ],
    },
    {
      title: 'Show each team its own cost',
      scenario: 'Finance wants a monthly report per team across 30 accounts.',
      steps: [
        'Use AWS Organizations consolidated billing so all accounts are on one bill.',
        'Enforce a Team tag and activate it as a cost allocation tag in the management account.',
        'Group Cost Explorer by tag, or deliver the Cost and Usage Report to S3 and query it with Athena.',
      ],
    },
  ],
  diagram: {
    title: 'AWS cost visibility and control',
    nodes: [
      ['acc', 'Member accounts + cost tags', 'actor', 0, 1],
      ['bill', 'Consolidated billing (Organizations)', 'management', 1, 1],
      ['ce', 'Cost Explorer', 'analytics', 1, 0],
      ['cur', 'Cost and Usage Report in S3', 'storage', 1, 2],
      ['bud', 'AWS Budgets', 'management', 2, 1],
      ['sns', 'SNS / email alerts', 'integration', 3, 1],
      ['ath', 'Athena / Amazon Quick', 'analytics', 2, 2],
    ],
    edges: [
      ['acc', 'bill', 'Usage and tags'],
      ['bill', 'ce', 'Analyse, forecast'],
      ['bill', 'cur', 'Detailed export'],
      ['bill', 'bud', 'Thresholds'],
      ['bud', 'sns', 'Alert or action'],
      ['cur', 'ath', 'Query'],
    ],
    steps: [
      'Usage from every member account (with its cost allocation tags) rolls up into one consolidated bill.',
      'Cost Explorer analyses the bill and forecasts future spend; the CUR delivers line-item detail to S3 for Athena or Amazon Quick.',
      'Budgets compare actual or forecasted cost with a limit and notify through SNS or email, or run a budget action.',
    ],
  },
  questionTypes: [
    { pattern: 'Match the workload pattern to the pricing model', hint: 'Steady = Savings Plans/Reserved; interruptible = Spot; unpredictable or short = On-Demand.' },
    { pattern: 'Alert me before spend exceeds a limit', hint: 'AWS Budgets (forecast alerts).' },
    { pattern: 'Allocate cost to teams or projects', hint: 'Cost allocation tags (activated) and consolidated billing.' },
    { pattern: 'Most flexible commitment across families, Regions, Fargate, Lambda', hint: 'Compute Savings Plans.' },
    { pattern: 'Most detailed billing data for custom analysis', hint: 'Cost and Usage Report to S3 + Athena.' },
  ],
  questions: [
    {
      source: 'mock', domain: 4,
      stem: 'A company runs a baseline of EC2 instances 24 hours a day and expects to change instance families and move some workloads to AWS Fargate over the next year. Which purchasing option gives the lowest cost while keeping this flexibility?',
      options: ['Standard Reserved Instances for one instance type', 'On-Demand Instances only', 'Dedicated Hosts', 'Compute Savings Plans'],
      answer: ['D'],
      explanation: 'Compute Savings Plans apply to EC2 regardless of family, size, Region, OS or tenancy and also cover Fargate and Lambda. Standard Reserved Instances are tied to specific attributes.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A finance team wants an automatic email when the forecasted monthly AWS spend is expected to exceed $5,000. Which solution requires the LEAST effort?',
      options: ['Review the invoice at the end of each month', 'Create a CloudWatch alarm on EC2 CPUUtilization', 'Write a Lambda function that polls Cost Explorer every hour', 'Create an AWS Budget with a forecasted-cost alert'],
      answer: ['D'],
      explanation: 'AWS Budgets supports actual and forecasted threshold alerts delivered by email or SNS without custom code.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A company wants a monthly report showing the cost of each project across many accounts that belong to the same organization. What should the solutions architect do? (Select TWO.)',
      multi: true,
      options: ['Create one IAM user per project', 'Apply a Project tag to resources', 'Activate the Project tag as a cost allocation tag', 'Move every project into a single AWS account', 'Enable VPC Flow Logs'],
      answer: ['B', 'C'],
      explanation: 'Tags must be applied to resources and then activated as cost allocation tags before they appear in Cost Explorer and the Cost and Usage Report.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A batch image-processing job can be restarted at any time and must finish at the lowest possible cost. Which EC2 purchasing option is MOST cost-effective?',
      options: ['Three-year Standard Reserved Instances', 'On-Demand Instances', 'Dedicated Hosts', 'Spot Instances'],
      answer: ['D'],
      explanation: 'Spot Instances use spare capacity at a large discount and can be interrupted, which a restartable batch job tolerates.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'An analyst needs hourly, line-item billing data for every resource so it can be queried with SQL. Which option provides the MOST detailed data?',
      options: ['The Cost Explorer monthly bar chart', 'AWS Cost and Usage Report delivered to Amazon S3', 'The AWS Free Tier dashboard', 'AWS Budgets email notifications'],
      answer: ['B'],
      explanation: 'The Cost and Usage Report (now also available through Data Exports) is the most granular billing dataset; it is delivered to S3 and can be queried with Athena.',
    },
  ],
  keyFacts: [
    'Cost Explorer: up to 13 months of history and an 18-month forecast; free in the console, $0.01 per paginated API request.',
    'Budgets types: cost, usage, Savings Plans/RI utilisation and coverage; alerts on actual or forecasted values via email or SNS.',
    'Cost allocation tags must be activated in the Billing console before they show in reports.',
    'Compute Savings Plans: up to 66% off, apply to EC2 (any family/Region/OS/tenancy), Fargate and Lambda. EC2 Instance Savings Plans: up to 72% but tied to one family in one Region. Terms are 1 or 3 years; pay all, partial or no upfront.',
    'Standard Reserved Instances give the largest RI discount; Convertible Reserved Instances let you change attributes in exchange for a smaller discount.',
    'Spot Instances: up to 90% off On-Demand, can be interrupted with a two-minute warning; use for fault-tolerant, flexible work, not databases or critical single instances.',
    'Consolidated billing in AWS Organizations shares volume pricing and Savings Plans / RI discounts across member accounts.',
    'Data transfer into AWS from the internet is free; transfer out to the internet, between Regions and between AZs is charged; traffic inside one AZ over private IPs is free.',
  ],
  traps: [
    { clue: 'Steady 24x7 baseline, flexible across instance families or compute services', answer: 'Compute Savings Plans.' },
    { clue: 'Fault-tolerant, interruptible, cheapest', answer: 'Spot Instances.' },
    { clue: 'Notify when spend crosses a limit', answer: 'AWS Budgets, not Cost Explorer.' },
    { clue: 'Cost per project or team', answer: 'Cost allocation tags (activated).' },
    { clue: 'Software licence bound to physical sockets or cores', answer: 'Dedicated Hosts.' },
  ],
  related: ['ec2', 'ec2-auto-scaling', 'organizations', 'compute-optimizer', 's3', 'lambda'],
  sources: [
    { title: 'Analyzing your costs and usage with AWS Cost Explorer', url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html' },
    { title: 'Managing your costs with AWS Budgets', url: 'https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html' },
    { title: 'What are Savings Plans?', url: 'https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html' },
    { title: 'Savings Plans types', url: 'https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html' },
    { title: 'Using cost allocation tags', url: 'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html' },
    { title: 'What are AWS Cost and Usage Reports?', url: 'https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html' },
    { title: 'Amazon EC2 instance purchasing options', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html' },
    { title: 'AWS CLI ce commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/ce/index.html' },
  ],
};
