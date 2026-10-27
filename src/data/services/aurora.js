import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Aurora. Schema: see s3.js. */
export default {
  tagline: 'MySQL- and PostgreSQL-compatible relational database built for the cloud, with shared distributed storage and fast failover.',
  intro: [
    'Amazon Aurora is a fully managed, MySQL- and PostgreSQL-compatible relational database engine within the RDS family.',
    'Storage is separated from compute: a cluster volume replicates data six ways across three Availability Zones, grows automatically, and tolerates the loss of AZ-level copies without downtime.',
    'One writer instance and up to 15 Aurora Replicas share the same storage, so replica lag is typically very low and any replica can be promoted on failover.',
    'Endpoints: the cluster (writer) endpoint, the reader endpoint that load balances across replicas, and optional custom endpoints.',
    'Aurora Serverless v2 scales capacity in fine-grained ACU increments for variable or unpredictable workloads; Aurora Global Database replicates to other Regions for low-latency reads and fast cross-Region recovery.',
    'Also includes continuous backup to S3 with point-in-time restore, fast database cloning, Backtrack (Aurora MySQL), IAM authentication and encryption with KMS.',
  ],
  useCases: [
    { title: 'High-performance OLTP', detail: 'Mission-critical relational workloads needing fast failover and read scaling.' },
    { title: 'Variable or spiky workloads', detail: 'Aurora Serverless v2 adjusts capacity automatically.' },
    { title: 'Global applications', detail: 'Aurora Global Database provides cross-Region reads and disaster recovery.' },
    { title: 'Dev/test copies', detail: 'Fast cloning creates copies without duplicating storage up front.' },
  ],
  importance: {
    points: [
      'Appears in Tasks 2.2, 3.3 and 4.3 as the high-performance relational option and in "Aurora vs DynamoDB" database selection.',
      'AWS\'s sample questions include an Aurora replica/endpoint scenario.',
      'Know replica count, endpoints, Serverless and Global Database use cases.',
    ],
  },
  cli: [
    { command: 'aws rds create-db-cluster --db-cluster-identifier prod-aurora --engine aurora-postgresql --master-username admin --manage-master-user-password --storage-encrypted', description: 'Create an Aurora PostgreSQL cluster.' },
    { command: 'aws rds create-db-instance --db-instance-identifier prod-aurora-1 --db-cluster-identifier prod-aurora --engine aurora-postgresql --db-instance-class db.r6g.large', description: 'Add the writer or an Aurora Replica to the cluster.' },
    { command: 'aws rds describe-db-clusters --db-cluster-identifier prod-aurora', description: 'See cluster, writer and reader endpoints.' },
    { command: 'aws rds failover-db-cluster --db-cluster-identifier prod-aurora', description: 'Trigger a failover to test recovery.' },
    { command: 'aws rds restore-db-cluster-to-point-in-time --source-db-cluster-identifier prod-aurora --db-cluster-identifier prod-aurora-clone --restore-type copy-on-write --use-latest-restorable-time', description: 'Create a fast clone using copy-on-write.' },
    { command: 'aws rds create-global-cluster --global-cluster-identifier orders-global --source-db-cluster-identifier <cluster-arn>', description: 'Create an Aurora Global Database.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): find the reader endpoint',
        language: 'python',
        code: `import boto3

rds = boto3.client("rds")
cluster = rds.describe_db_clusters(DBClusterIdentifier="prod-aurora")["DBClusters"][0]
print("Writer:", cluster["Endpoint"])
print("Reader:", cluster["ReaderEndpoint"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Separate read and write traffic',
      scenario: 'Read-heavy queries are adding I/O and latency to writes on an Aurora cluster.',
      steps: [
        'Add one or more Aurora Replicas to the cluster.',
        'Point write operations at the cluster (writer) endpoint.',
        'Point read-only operations at the reader endpoint, which load balances across replicas.',
        'Optionally use Aurora Auto Scaling to add replicas based on CPU or connections.',
      ],
    },
  ],
  diagram: {
    title: 'Aurora cluster with shared storage',
    nodes: [
      ['app', 'Application', 'compute', 0, 1],
      ['writer', 'Writer instance (AZ-a)', 'database', 1, 0],
      ['reader', 'Aurora Replicas (up to 15)', 'database', 1, 2],
      ['vol', 'Cluster volume: 6 copies / 3 AZs', 'storage', 2, 1],
      ['global', 'Secondary Region (Global DB)', 'database', 3, 1],
    ],
    edges: [
      ['app', 'writer', 'Writes (cluster endpoint)'],
      ['app', 'reader', 'Reads (reader endpoint)'],
      ['writer', 'vol', 'Shared storage'],
      ['reader', 'vol', 'Read from storage'],
      ['vol', 'global', 'Cross-Region replication', 'dashed'],
    ],
    steps: [
      'The application writes through the cluster endpoint to the single writer instance.',
      'Reads go to the reader endpoint, which spreads queries across Aurora Replicas.',
      'All instances use the same cluster volume, replicated six ways across three AZs, so replicas stay nearly in sync and can be promoted quickly.',
      'With Aurora Global Database, storage-level replication feeds read-only clusters in other Regions.',
    ],
  },
  questionTypes: [
    { pattern: 'Separate reads from writes', hint: 'Aurora Replicas and the reader endpoint.' },
    { pattern: 'Unpredictable workload, minimal management', hint: 'Aurora Serverless v2.' },
    { pattern: 'Cross-Region DR for a relational database', hint: 'Aurora Global Database.' },
    { pattern: 'Aurora vs RDS vs DynamoDB', hint: 'Aurora for high-performance relational; DynamoDB for key-value at any scale; RDS for standard engine needs.' },
  ],
  questions: [
    {
      source: 'official', reference: 'AWS SAA-C03 Sample Exam Questions, Q10', domain: 3,
      stem: 'An application running on AWS uses an Amazon Aurora Multi-AZ DB cluster deployment for its database. When evaluating performance metrics, a solutions architect discovered that the database reads are causing high I/O and adding latency to the write requests against the database. What should the solutions architect do to separate the read requests from the write requests?',
      options: [
        'Enable read-through caching on the Aurora database.',
        'Update the application to read from the Multi-AZ standby instance.',
        'Create an Aurora replica and modify the application to use the appropriate endpoints.',
        'Create a second Aurora database and link it to the primary database as a read replica.',
      ],
      answer: ['C'],
      explanation: 'Aurora Replicas provide a way to offload read traffic. Aurora Replicas share the same underlying storage as the main database, so lag time is generally very low. Aurora Replicas have their own endpoints, so the application will need to be configured to direct read traffic to the new endpoints. (AWS official explanation.)',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A SaaS company has an unpredictable relational workload with long idle periods and sudden spikes. It wants to minimise cost and administration. Which database option is the BEST fit?',
      options: ['Amazon RDS for MySQL with the largest instance class', 'Amazon Aurora Serverless v2', 'A self-managed database on EC2', 'Amazon Redshift'],
      answer: ['B'],
      explanation: 'Aurora Serverless v2 scales capacity up and down automatically in fine-grained increments, matching variable workloads without manual capacity management.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A global application uses an Aurora MySQL database in us-east-1. Users in Asia need low-latency reads, and the company needs a fast recovery option if us-east-1 becomes unavailable. Which feature should be used?',
      options: ['Aurora Backtrack', 'Aurora Global Database', 'RDS Multi-AZ in us-east-1', 'Manual snapshots copied monthly'],
      answer: ['B'],
      explanation: 'Aurora Global Database replicates storage to secondary Regions with typically sub-second lag, enabling local reads and promotion of a secondary Region during a Regional failure.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'What provides storage durability for an Amazon Aurora cluster?',
      options: [
        'Two copies of data in a single Availability Zone',
        'Six copies of data across three Availability Zones in a cluster volume',
        'A single EBS volume attached to the writer',
        'Daily snapshots stored on instance store',
      ],
      answer: ['B'],
      explanation: 'Aurora\'s cluster volume keeps six copies of data across three AZs, which provides durability and tolerates the loss of copies without losing availability.',
    },
  ],
  keyFacts: [
    'One writer plus up to 15 Aurora Replicas share one cluster volume; replicas are failover targets and serve reads.',
    'Cluster volume: six copies across three AZs, auto-grows (up to 128 TiB), self-heals.',
    'Endpoints: cluster (writer), reader (load-balanced across replicas), custom, and per-instance endpoints.',
    'Aurora Serverless v2 scales in ACUs; Aurora Global Database provides cross-Region replication, typically under one second of lag.',
    'Backups are continuous to S3; retention 1-35 days; cloning uses copy-on-write for fast, cheap copies.',
    'Backtrack rewinds a database without restoring from backup but is available for Aurora MySQL only.',
    'Aurora is MySQL- and PostgreSQL-compatible; DynamoDB is the right answer for key-value access at massive scale.',
  ],
  traps: [
    { clue: 'Offload reads, shared storage, low replica lag', answer: 'Aurora Replicas + reader endpoint.' },
    { clue: 'Spiky/unpredictable relational load', answer: 'Aurora Serverless v2.' },
    { clue: 'Cross-Region low-latency reads + DR (relational)', answer: 'Aurora Global Database.' },
    { clue: 'Undo a bad write quickly without restore (MySQL)', answer: 'Aurora Backtrack.' },
  ],
  related: ['rds', 'dynamodb', 'elasticache', 'dms', 'backup'],
  sources: [
    { title: 'What is Amazon Aurora?', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html' },
    { title: 'Aurora DB clusters and endpoints', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.Endpoints.html' },
    { title: 'Aurora storage and reliability', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.StorageReliability.html' },
    { title: 'Using Amazon Aurora Serverless v2', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html' },
    { title: 'Using Aurora Global Database', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html' },
  ],
};
