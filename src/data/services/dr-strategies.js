import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Disaster Recovery strategies. Schema: see s3.js. */
export default {
  tagline: 'Match recovery objectives (RPO and RTO) to the cheapest DR strategy that meets them.',
  intro: [
    'Recovery Point Objective (RPO) is how much data loss is acceptable (time since the last good copy); Recovery Time Objective (RTO) is how long the workload may be down.',
    'Backup and restore: copy data (snapshots, S3 replication, AWS Backup) to another Region and rebuild on demand - cheapest, highest RPO/RTO (hours or more).',
    'Pilot light: keep the core data tier replicated and running (for example a replicated database) with application servers off or minimal, then scale out during a disaster - RTO in tens of minutes.',
    'Warm standby: a scaled-down but fully functional copy of the whole stack always running; scale up on failover - RTO in minutes.',
    'Multi-site active/active: full capacity in more than one Region serving traffic simultaneously - near-zero RPO and RTO at the highest cost.',
    'Supporting services: Route 53 failover, Aurora Global Database, DynamoDB global tables, S3 cross-Region replication, cross-Region snapshot copy and infrastructure as code (CloudFormation) to rebuild environments.',
  ],
  useCases: [
    { title: 'Regulated, low-tolerance workloads', detail: 'Active/active or warm standby with replicated databases.' },
    { title: 'Cost-sensitive business apps', detail: 'Backup and restore or pilot light when hours of downtime are acceptable.' },
    { title: 'DR testing', detail: 'Regularly fail over using automation to validate RTO and RPO.' },
  ],
  importance: {
    points: [
      'Task 2.2 lists the four strategies and RPO/RTO by name - questions give objectives and ask for the cheapest strategy that meets them.',
      'Supporting service knowledge (Route 53 failover, replication features) is tested alongside.',
      'Typically 1-3 questions: map RTO/RPO to strategy and choose replication services.',
    ],
  },
  cli: [
    { command: 'aws backup start-copy-job --source-backup-vault-name Default --recovery-point-arn <arn> --destination-backup-vault-arn <dr-vault-arn> --iam-role-arn <role>', description: 'Copy a backup to a vault in another Region.' },
    { command: 'aws rds create-db-instance-read-replica --db-instance-identifier dr-replica --source-db-instance-identifier arn:aws:rds:ap-south-1:111111111111:db:prod --region us-east-1', description: 'Create a cross-Region read replica (pilot light data tier).' },
    { command: 'aws s3api put-bucket-replication --bucket src --replication-configuration file://crr.json', description: 'Replicate S3 objects to another Region.' },
    { command: 'aws route53 change-resource-record-sets --hosted-zone-id Z123 --change-batch file://failover.json', description: 'Configure failover records.' },
    { command: 'aws cloudformation deploy --template-file app.yaml --stack-name app-dr --region us-east-1', description: 'Recreate infrastructure in the DR Region from code.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): promote a cross-Region replica during failover',
        language: 'python',
        code: `import boto3

rds = boto3.client("rds", region_name="us-east-1")
rds.promote_read_replica(DBInstanceIdentifier="dr-replica")
# then scale out the app tier and update Route 53 to point at the DR Region`,
      },
    ],
  },
  examples: [
    {
      title: 'Choose by objectives',
      scenario: 'A business app can tolerate 30 minutes of downtime and 5 minutes of data loss at modest cost.',
      steps: [
        'RTO 30 minutes and RPO 5 minutes rule out backup and restore.',
        'Use pilot light or warm standby: a continuously replicated database in the DR Region.',
        'Keep AMIs and launch templates ready; scale the app tier out on failover.',
        'Use Route 53 health checks to fail over DNS.',
      ],
    },
  ],
  diagram: {
    title: 'DR strategies from cheapest to fastest',
    nodes: [
      ['bk', 'Backup & restore (hours)', 'storage', 0, 0],
      ['pl', 'Pilot light (tens of min)', 'compute', 1, 0],
      ['ws', 'Warm standby (minutes)', 'compute', 2, 0],
      ['aa', 'Multi-site active/active (~zero)', 'network', 3, 0],
      ['r53', 'Route 53 failover', 'network', 2, 2],
    ],
    edges: [
      ['bk', 'pl', 'More cost, faster'],
      ['pl', 'ws', 'More cost, faster'],
      ['ws', 'aa', 'More cost, faster'],
      ['r53', 'ws', 'Shifts traffic'],
    ],
    steps: [
      'Backup and restore only keeps copies of data; everything else is rebuilt during a disaster.',
      'Pilot light keeps the data tier live and the rest ready to start.',
      'Warm standby keeps a smaller full environment running, scaled up when needed.',
      'Active/active serves users from several Regions all the time; DNS routing (Route 53) shifts or splits traffic.',
    ],
  },
  questionTypes: [
    { pattern: 'Given RTO/RPO pick the strategy', hint: 'Cheapest strategy that still meets both objectives.' },
    { pattern: 'Cross-Region data replication', hint: 'S3 CRR, Aurora Global Database, DynamoDB global tables, cross-Region read replicas, snapshot copy.' },
    { pattern: 'Automate failover', hint: 'Route 53 failover/health checks plus infrastructure as code.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company can tolerate several hours of downtime and up to 24 hours of data loss for a non-critical application and wants the LOWEST-cost disaster recovery strategy. Which should it choose?',
      options: ['Multi-site active/active', 'Warm standby', 'Backup and restore', 'Pilot light with a replicated database'],
      answer: ['C'],
      explanation: 'Backup and restore has the lowest cost but the longest RTO and RPO, which matches the relaxed objectives.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A critical application requires near-zero RTO and RPO and the company accepts the highest cost. Which strategy should be used?',
      options: ['Backup and restore', 'Pilot light', 'Warm standby', 'Multi-site active/active'],
      answer: ['D'],
      explanation: 'Active/active runs full capacity in multiple Regions simultaneously, so failover is immediate with minimal data loss.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'In a DR design the database is replicated to a second Region and always running, while application servers there are stopped until a disaster is declared. What is this strategy called?',
      options: ['Pilot light', 'Warm standby', 'Backup and restore', 'Active/active'],
      answer: ['A'],
      explanation: 'Pilot light keeps only the critical core (usually the replicated data tier) running; the rest is started on demand.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which statements define RTO and RPO? (Select TWO.)',
      multi: true,
      options: ['RTO is the maximum acceptable time to restore service after a disruption.', 'RPO is the maximum acceptable amount of data loss measured in time.', 'RTO is the cost of the DR environment.', 'RPO is the number of Regions used.', 'RTO is the time between backups.'],
      answer: ['A', 'B'],
      explanation: 'RTO is about downtime; RPO is about data loss (the time since the last recoverable copy).',
    },
  ],
  keyFacts: [
    'Four AWS DR strategies in increasing cost and decreasing RTO/RPO: backup and restore, pilot light, warm standby, multi-site active/active.',
    'RPO = data-loss tolerance; RTO = downtime tolerance.',
    'Replication choices: S3 CRR, DynamoDB global tables, Aurora Global Database, RDS cross-Region read replicas, EBS/RDS snapshot copy, AWS Backup cross-Region copy.',
    'Infrastructure as code (CloudFormation) makes the recreate-on-demand part of DR fast and repeatable.',
    'Test failover regularly; an untested DR plan is a risk.',
    'Pilot light keeps core data and a minimal footprint running; warm standby runs a scaled-down but fully functional copy; multi-site active/active runs at full capacity in more than one Region.',
  ],
  traps: [
    { clue: 'Hours of downtime acceptable, cheapest', answer: 'Backup and restore.' },
    { clue: 'Core database replicated, app tier off', answer: 'Pilot light.' },
    { clue: 'Scaled-down full copy always running', answer: 'Warm standby.' },
    { clue: 'Zero downtime across Regions', answer: 'Multi-site active/active.' },
  ],
  related: ['route53', 'aurora', 's3', 'backup', 'cloudformation', 'global-infrastructure'],
  sources: [
    { title: 'Disaster recovery options in the cloud (AWS whitepaper)', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html' },
    { title: 'Disaster recovery of workloads on AWS', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html' },
    { title: 'Reliability pillar: Plan for disaster recovery', url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html' },
  ],
};
