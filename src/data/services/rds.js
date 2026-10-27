import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon RDS. Schema: see s3.js. */
export default {
  tagline: 'Managed relational databases with automated backups, patching, Multi-AZ failover and read replicas.',
  intro: [
    'Amazon RDS runs managed relational engines - MySQL, PostgreSQL, MariaDB, Oracle, SQL Server and Db2 - and handles provisioning, patching, backups and failure detection; Aurora is covered separately.',
    'You do not get OS access (except RDS Custom); you choose instance class, storage type (gp3/io1/io2) and can enable storage auto scaling.',
    'Multi-AZ deployments provide high availability: a synchronous standby in another AZ with automatic failover (the standby does not serve reads in the classic Multi-AZ instance deployment; Multi-AZ DB clusters add two readable standbys).',
    'Read replicas use asynchronous replication to scale read-heavy workloads, can be cross-Region, and can be promoted to standalone databases.',
    'Automated backups plus transaction logs enable point-in-time recovery within the retention period (up to 35 days); manual snapshots are kept until you delete them.',
    'RDS Proxy pools and shares connections (valuable for Lambda and bursty apps), speeds up failover and supports IAM authentication; encryption at rest uses KMS and must be chosen at creation.',
  ],
  useCases: [
    { title: 'OLTP applications', detail: 'Line-of-business apps needing SQL, joins and transactions without managing servers.' },
    { title: 'Read scaling and reporting', detail: 'Offload reports and read traffic to read replicas.' },
    { title: 'High availability', detail: 'Multi-AZ keeps the database available through AZ or instance failure.' },
    { title: 'Serverless connection pooling', detail: 'RDS Proxy in front of the database for Lambda functions.' },
  ],
  importance: {
    points: [
      'Database selection, read replicas and RDS Proxy are named in Tasks 2.1, 2.2, 3.3 and 4.3.',
      'The classic exam contrasts Multi-AZ (availability) with read replicas (performance).',
      'Expect backup/retention, encryption and migration (DMS) scenarios.',
    ],
  },
  cli: [
    { command: 'aws rds create-db-instance --db-instance-identifier prod-db --engine postgres --db-instance-class db.m6g.large --allocated-storage 100 --master-username admin --manage-master-user-password --multi-az --storage-encrypted', description: 'Create an encrypted Multi-AZ PostgreSQL instance (password managed in Secrets Manager).' },
    { command: 'aws rds create-db-instance-read-replica --db-instance-identifier prod-db-ro --source-db-instance-identifier prod-db', description: 'Create a read replica.' },
    { command: 'aws rds promote-read-replica --db-instance-identifier prod-db-ro', description: 'Promote a replica to a standalone instance.' },
    { command: 'aws rds create-db-snapshot --db-instance-identifier prod-db --db-snapshot-identifier pre-upgrade', description: 'Take a manual snapshot.' },
    { command: 'aws rds restore-db-instance-to-point-in-time --source-db-instance-identifier prod-db --target-db-instance-identifier prod-db-pitr --restore-time 2026-10-01T10:00:00Z', description: 'Restore to a point in time (creates a new instance).' },
    { command: 'aws rds modify-db-instance --db-instance-identifier prod-db --backup-retention-period 14 --apply-immediately', description: 'Change backup retention.' },
    { command: 'aws rds reboot-db-instance --db-instance-identifier prod-db --force-failover', description: 'Test Multi-AZ failover.' },
    { command: 'aws rds create-db-proxy --db-proxy-name app-proxy --engine-family POSTGRESQL --auth file://auth.json --role-arn <arn> --vpc-subnet-ids subnet-a subnet-b', description: 'Create an RDS Proxy.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): create a read replica',
        language: 'python',
        code: `import boto3

rds = boto3.client("rds", region_name="ap-south-1")
rds.create_db_instance_read_replica(
    DBInstanceIdentifier="prod-db-ro",
    SourceDBInstanceIdentifier="prod-db",
    DBInstanceClass="db.m6g.large",
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Highly available, read-scaled database',
      scenario: 'A reporting-heavy application slows the primary database, and the business needs automatic recovery from an AZ failure.',
      steps: [
        'Enable Multi-AZ on the primary for automatic failover.',
        'Create one or more read replicas and send reporting queries to them.',
        'Put RDS Proxy in front of the writer to pool connections and shorten failover impact.',
        'Retain automated backups for 14 days and copy snapshots to another Region for DR.',
      ],
    },
  ],
  diagram: {
    title: 'RDS Multi-AZ with a read replica',
    nodes: [
      ['app', 'Application', 'compute', 0, 1],
      ['proxy', 'RDS Proxy', 'database', 1, 1],
      ['primary', 'Primary DB (AZ-a)', 'database', 2, 0],
      ['standby', 'Standby (AZ-b)', 'database', 3, 0],
      ['replica', 'Read replica', 'database', 2, 2],
    ],
    edges: [
      ['app', 'proxy', 'SQL connections'],
      ['proxy', 'primary', 'Writes and reads'],
      ['primary', 'standby', 'Synchronous', 'dashed'],
      ['proxy', 'replica', 'Read traffic'],
    ],
    steps: [
      'Applications connect through RDS Proxy, which pools connections to the database.',
      'Writes go to the primary; in Multi-AZ the data is replicated synchronously to a standby in another AZ, which is promoted automatically on failure.',
      'A read replica receives asynchronous updates and serves read-only traffic to offload the primary.',
    ],
  },
  questionTypes: [
    { pattern: 'Multi-AZ vs read replica', hint: 'Multi-AZ = availability and failover; read replicas = read scaling (and cross-Region DR).' },
    { pattern: 'Reduce connection overhead', hint: 'RDS Proxy, especially for Lambda and spiky workloads.' },
    { pattern: 'Recovery', hint: 'Point-in-time restore creates a new instance; snapshots for long-term retention.' },
    { pattern: 'Encrypt an existing unencrypted database', hint: 'Snapshot, copy the snapshot with encryption, restore.' },
    { pattern: 'Database engine migration', hint: 'DMS (+ Schema Conversion Tool for heterogeneous migrations).' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company\'s relational database on Amazon RDS must remain available during an Availability Zone outage with automatic failover and no application changes. What should be enabled?',
      options: ['A read replica in the same AZ', 'Multi-AZ deployment', 'More allocated storage', 'Enhanced Monitoring'],
      answer: ['B'],
      explanation: 'A Multi-AZ deployment maintains a synchronous standby in another AZ and fails over automatically using the same endpoint.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A reporting workload runs heavy read queries that slow the RDS primary instance. Which solution offloads reads with the LEAST application change?',
      options: ['Enable Multi-AZ and send queries to the standby', 'Create read replicas and direct reporting queries to the replica endpoints', 'Increase the backup retention period', 'Move the database to Amazon S3'],
      answer: ['B'],
      explanation: 'Read replicas serve read-only queries asynchronously replicated from the primary. In a classic Multi-AZ instance deployment the standby is not readable.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'AWS Lambda functions that connect to an RDS MySQL database cause "too many connections" errors during traffic bursts. What is the BEST solution?',
      options: ['Increase the Lambda timeout', 'Place Amazon RDS Proxy between the functions and the database', 'Use a smaller DB instance', 'Disable Multi-AZ'],
      answer: ['B'],
      explanation: 'RDS Proxy pools and shares database connections so many short-lived Lambda invocations do not exhaust the database\'s connection limit.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A company has an unencrypted RDS DB instance and must now encrypt it at rest. What is the correct approach?',
      options: ['Enable encryption in the instance settings on the running instance', 'Take a snapshot, copy it with encryption enabled, and restore a new DB instance from the encrypted copy', 'Add a KMS key policy to the existing instance', 'Enable SSL in the parameter group'],
      answer: ['B'],
      explanation: 'Encryption at rest cannot be enabled on an existing unencrypted instance directly; copy a snapshot with encryption and restore from it.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A development database is used only during business hours and does not need high availability. Which action reduces cost the MOST while keeping data?',
      options: ['Enable Multi-AZ', 'Use a Single-AZ instance and stop it outside business hours (or snapshot and delete when idle)', 'Add read replicas', 'Use io2 storage'],
      answer: ['B'],
      explanation: 'Non-production databases do not need Multi-AZ; stopping the instance when not in use (or snapshotting and deleting) cuts compute cost. Multi-AZ, replicas and io2 all add cost.',
    },
  ],
  keyFacts: [
    'Multi-AZ (instance deployment) = synchronous standby, same endpoint, automatic failover, standby is not readable; Multi-AZ DB cluster = two readable standbys (MySQL and PostgreSQL).',
    'Read replicas = asynchronous, have their own endpoints, can be cross-Region, can be promoted; they scale reads, they are not a substitute for Multi-AZ HA.',
    'Automated backups: retention 0-35 days with point-in-time restore; restores always create a NEW instance.',
    'Encryption at rest is set at creation (KMS); to encrypt an existing database, copy an encrypted snapshot.',
    'RDS Proxy pools connections, reduces failover time and supports IAM authentication and Secrets Manager.',
    'Storage auto scaling expands storage automatically up to a maximum you set.',
    'You cannot SSH into an RDS instance (use RDS Custom for OS-level access on supported engines).',
    'For heterogeneous migrations use AWS DMS with the Schema Conversion Tool.',
  ],
  traps: [
    { clue: 'Survive AZ failure automatically', answer: 'Multi-AZ.' },
    { clue: 'Scale read-heavy workload / reporting', answer: 'Read replicas.' },
    { clue: 'Lambda opens too many DB connections', answer: 'RDS Proxy.' },
    { clue: 'Cross-Region disaster recovery for RDS', answer: 'Cross-Region read replica or snapshot copy (Aurora: Global Database).' },
    { clue: 'Need relational with higher performance and 6-way replicated storage', answer: 'Amazon Aurora.' },
  ],
  related: ['aurora', 'dynamodb', 'elasticache', 'dms', 'backup', 'kms'],
  sources: [
    { title: 'What is Amazon RDS?', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html' },
    { title: 'Multi-AZ DB instance deployments', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html' },
    { title: 'Working with DB instance read replicas', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html' },
    { title: 'Backing up and restoring an RDS DB instance', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_CommonTasks.BackupRestore.html' },
    { title: 'Amazon RDS Proxy', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html' },
    { title: 'AWS CLI rds commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/rds/index.html' },
  ],
};
