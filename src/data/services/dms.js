import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Database Migration Service. Schema: see s3.js. */
export default {
  tagline: 'Migrate databases to AWS quickly and securely with minimal downtime, between the same or different engines.',
  intro: [
    'AWS Database Migration Service (DMS) moves data between a source and a target database; the source database remains operational during the migration.',
    'Homogeneous migrations keep the same engine (for example Oracle to Oracle on RDS); heterogeneous migrations change engines (for example Oracle to Aurora PostgreSQL).',
    'For heterogeneous migrations the schema must be converted first with the AWS Schema Conversion Tool (SCT) or DMS Schema Conversion; DMS then moves the data.',
    'Migration task types: full load, change data capture (CDC) only, or full load plus CDC to keep the target in sync until cutover.',
    'DMS runs on a replication instance (or serverless replication); use Multi-AZ for high availability and ensure either the source or target is on AWS.',
    'Targets include RDS, Aurora, DynamoDB, Redshift, S3, OpenSearch and Kinesis - so DMS also feeds data lakes and streaming pipelines.',
  ],
  useCases: [
    { title: 'Minimal-downtime database migration', detail: 'Full load plus CDC, then cut over when lag is near zero.' },
    { title: 'Change engines', detail: 'Oracle or SQL Server to Aurora/PostgreSQL using SCT + DMS.' },
    { title: 'Continuous replication to analytics', detail: 'Stream changes into S3 or Redshift.' },
  ],
  importance: {
    points: [
      'Tasks 3.3 and 4.3 name "heterogeneous and homogeneous migrations" and migrating schemas and data between engines.',
      'Exam pattern: DMS (+SCT) for databases; DataSync/Snow for files; Application Migration Service for servers.',
    ],
  },
  cli: [
    { command: 'aws dms create-replication-instance --replication-instance-identifier dms-1 --replication-instance-class dms.r5.large --multi-az --allocated-storage 100', description: 'Create a Multi-AZ replication instance.' },
    { command: 'aws dms create-endpoint --endpoint-identifier src-oracle --endpoint-type source --engine-name oracle --server-name db.example.com --port 1521 --username dms --password <pw> --database-name ORCL', description: 'Create a source endpoint.' },
    { command: 'aws dms create-replication-task --replication-task-identifier mig1 --source-endpoint-arn <src> --target-endpoint-arn <tgt> --replication-instance-arn <ri> --migration-type full-load-and-cdc --table-mappings file://map.json', description: 'Create a full load + CDC task.' },
    { command: 'aws dms start-replication-task --replication-task-arn <arn> --start-replication-task-type start-replication', description: 'Start the task.' },
    { command: 'aws dms describe-table-statistics --replication-task-arn <arn>', description: 'Monitor rows loaded and CDC progress.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): check task status',
        language: 'python',
        code: `import boto3

dms = boto3.client("dms")
for task in dms.describe_replication_tasks()["ReplicationTasks"]:
    print(task["ReplicationTaskIdentifier"], task["Status"], task["MigrationType"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Oracle to Aurora PostgreSQL with minimal downtime',
      scenario: 'An on-premises Oracle database must move to Aurora PostgreSQL with only minutes of downtime.',
      steps: [
        'Use SCT to assess and convert the schema and code to PostgreSQL.',
        'Create the target Aurora cluster and apply the converted schema.',
        'Run a DMS task of type full-load-and-cdc from Oracle to Aurora.',
        'When replication lag is near zero, stop writes, let CDC finish, and repoint the application.',
      ],
    },
  ],
  diagram: {
    title: 'DMS full load + CDC',
    nodes: [
      ['src', 'Source DB (on-premises)', 'external', 0, 1],
      ['dms', 'DMS replication instance', 'ml', 1, 1],
      ['tgt', 'Target DB (Aurora / RDS)', 'database', 2, 1],
      ['sct', 'Schema Conversion Tool', 'ml', 1, 0],
      ['s3', 'S3 / Kinesis (optional target)', 'storage', 1, 2],
    ],
    edges: [
      ['src', 'dms', 'Full load + changes'],
      ['dms', 'tgt', 'Apply to target'],
      ['sct', 'dms', 'Converted schema'],
      ['dms', 's3', 'Optional stream'],
    ],
    steps: [
      'For different engines SCT converts the schema first.',
      'DMS performs the initial full load while the source stays online.',
      'Change data capture streams ongoing changes until you cut the application over to the target.',
    ],
  },
  questionTypes: [
    { pattern: 'Migrate a database with minimal downtime', hint: 'DMS with full load + CDC.' },
    { pattern: 'Different engines', hint: 'SCT/DMS Schema Conversion plus DMS.' },
    { pattern: 'Which migration service?', hint: 'DMS = databases; DataSync = files; MGN = servers; Snow = offline bulk.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company must migrate a production Oracle database to Amazon Aurora PostgreSQL with minimal application downtime. Which approach should be used?',
      options: ['Export to CSV files and import them during a weekend outage', 'Use the AWS Schema Conversion Tool and AWS DMS with ongoing replication (CDC)', 'Use AWS DataSync', 'Copy the database files to S3'],
      answer: ['B'],
      explanation: 'SCT converts the schema for the new engine, and DMS replicates data continuously so cutover is brief.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'During migration the source MySQL database must keep serving users. Which DMS task type keeps the target in sync with changes after the initial copy?',
      options: ['Full load only', 'Full load plus change data capture', 'Schema conversion only', 'Snapshot export'],
      answer: ['B'],
      explanation: 'Full load plus CDC copies existing data and then replicates ongoing changes until cutover.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A team needs to continuously replicate changes from an on-premises PostgreSQL database into Amazon S3 for analytics. Which service can do this natively?',
      options: ['AWS DMS with an S3 target', 'AWS Backup', 'Amazon EFS', 'AWS Snowcone'],
      answer: ['A'],
      explanation: 'DMS supports S3 as a target and CDC, enabling continuous replication to a data lake.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A company migrating from Oracle to Aurora PostgreSQL needs to convert the schema, stored procedures and functions to the new engine. Which tool helps?',
      options: ['AWS DataSync', 'AWS Glue crawlers', 'AWS Schema Conversion Tool (or DMS Schema Conversion)', 'Amazon Macie'],
      answer: ['C'],
      explanation: 'SCT (and DMS Schema Conversion) convert schemas and code between engines; DMS then moves the data.',
    },
  ],
  keyFacts: [
    'DMS moves data; SCT (or DMS Schema Conversion) converts schemas and code for heterogeneous migrations.',
    'Task types: full load, CDC only, full load + CDC.',
    'Replication instance can be Multi-AZ; either the source or the target must be in AWS.',
    'Source stays available during migration, enabling minimal-downtime cutover.',
    'Supported targets include RDS, Aurora, DynamoDB, Redshift, S3, OpenSearch and Kinesis.',
    'Data in transit can be encrypted with SSL; replication storage can be encrypted with KMS.',
  ],
  traps: [
    { clue: 'Same engine migration, minimal downtime', answer: 'DMS (homogeneous), or native tools.' },
    { clue: 'Change database engine', answer: 'SCT + DMS.' },
    { clue: 'Migrate files, not databases', answer: 'DataSync / Transfer Family / Snow.' },
    { clue: 'Lift-and-shift entire servers', answer: 'Application Migration Service.' },
  ],
  related: ['rds', 'aurora', 'dynamodb', 'datasync', 'mgn', 'kinesis'],
  sources: [
    { title: 'What is AWS Database Migration Service?', url: 'https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html' },
    { title: 'AWS DMS Schema Conversion', url: 'https://docs.aws.amazon.com/dms/latest/userguide/schema-conversion.html' },
    { title: 'Ongoing replication (CDC)', url: 'https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Task.CDC.html' },
    { title: 'AWS CLI dms commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/dms/index.html' },
  ],
};
