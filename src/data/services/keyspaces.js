import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Keyspaces. Schema: see s3.js. */
export default {
  tagline: 'Serverless, highly available Apache Cassandra-compatible wide-column database.',
  intro: [
    'Amazon Keyspaces (for Apache Cassandra) is a scalable, highly available and managed Cassandra-compatible database service, so you run Cassandra workloads without managing servers.',
    'It is serverless: tables scale up and down automatically with on-demand capacity, or you choose provisioned capacity with auto scaling; you pay for the reads, writes and storage you use.',
    'Applications keep using Cassandra Query Language (CQL), drivers and tools; data is replicated three times across multiple Availability Zones.',
    'Features include point-in-time recovery, encryption at rest by default with KMS, TLS in transit, IAM integration and multi-Region replication for global applications.',
    'It targets very large, high-throughput wide-column workloads such as time-series, IoT and user activity; DynamoDB is the AWS-native alternative when Cassandra compatibility is not required.',
  ],
  useCases: [
    { title: 'Migrate Cassandra to a managed service', detail: 'Keep CQL applications while eliminating cluster operations.' },
    { title: 'High-volume time-series and activity data', detail: 'Wide-column tables for logs, telemetry or messaging history.' },
    { title: 'Multi-Region Cassandra applications', detail: 'Replicate tables across Regions for low-latency global access.' },
  ],
  importance: {
    points: [
      'Domain 3 database selection: the Cassandra-compatible answer.',
      'Rare on the exam; learn the one-line identification rule and that it is serverless.',
    ],
  },
  cli: [
    { command: 'aws keyspaces create-keyspace --keyspace-name shop', description: 'Create a keyspace.' },
    { command: 'aws keyspaces create-table --keyspace-name shop --table-name orders --schema-definition file://schema.json --capacity-specification throughputMode=PAY_PER_REQUEST', description: 'Create an on-demand table.' },
    { command: 'aws keyspaces update-table --keyspace-name shop --table-name orders --point-in-time-recovery status=ENABLED', description: 'Enable point-in-time recovery.' },
    { command: 'aws keyspaces list-tables --keyspace-name shop', description: 'List tables in a keyspace.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'CQL: create a table',
        language: 'sql',
        code: `CREATE TABLE shop.orders (
  customer_id text,
  order_ts timestamp,
  total decimal,
  PRIMARY KEY (customer_id, order_ts)
) WITH CLUSTERING ORDER BY (order_ts DESC);`,
      },
    ],
  },
  examples: [
    {
      title: 'Retire a Cassandra cluster',
      scenario: 'A team spends significant effort patching and scaling a self-managed Cassandra cluster.',
      steps: [
        'Create a keyspace and tables in Amazon Keyspaces with on-demand capacity.',
        'Copy the data with a migration tool and point the CQL driver at the Keyspaces endpoint.',
        'Enable point-in-time recovery and monitor usage with CloudWatch.',
      ],
    },
  ],
  diagram: {
    title: 'Amazon Keyspaces',
    nodes: [
      ['app', 'Cassandra client (CQL driver)', 'compute', 0, 1],
      ['cap', 'On-demand or provisioned capacity', 'management', 1, 0],
      ['ks', 'Amazon Keyspaces (serverless)', 'database', 1, 1],
      ['pitr', 'Point-in-time recovery backups', 'storage', 1, 2],
      ['store', 'Data replicated across 3 AZs', 'storage', 2, 1],
    ],
    edges: [
      ['app', 'ks', 'CQL queries'],
      ['cap', 'ks', 'Scales tables'],
      ['ks', 'pitr', 'Continuous backups'],
      ['ks', 'store', 'Durable storage'],
    ],
    steps: [
      'Applications use CQL drivers against a Keyspaces endpoint.',
      'Capacity scales automatically (on-demand) or by provisioned throughput.',
      'Data is replicated across three AZs and can be restored to a point in time.',
    ],
  },
  questionTypes: [
    { pattern: 'Cassandra-compatible managed database', hint: 'Amazon Keyspaces.' },
    { pattern: 'Serverless wide-column store', hint: 'Keyspaces (or DynamoDB if Cassandra not required).' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company runs a self-managed Apache Cassandra cluster and wants a serverless managed service that supports CQL. Which service should be used?',
      options: ['Amazon Neptune', 'Amazon RDS for PostgreSQL', 'Amazon Keyspaces', 'Amazon DocumentDB'],
      answer: ['C'],
      explanation: 'Keyspaces is a serverless Cassandra-compatible service that supports CQL.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which capacity modes does Amazon Keyspaces offer? (Select TWO.)',
      multi: true,
      options: ['Reserved nodes only', 'Dedicated hosts', 'Spot capacity', 'On-demand', 'Provisioned with auto scaling'],
      answer: ['D', 'E'],
      explanation: 'Keyspaces tables can use on-demand or provisioned (with auto scaling) throughput modes.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'How does Amazon Keyspaces provide durability?',
      options: ['Data is replicated three times across multiple Availability Zones', 'Data is stored on a single EC2 instance', 'Data is stored only in memory', 'Data is stored in one S3 bucket without replication'],
      answer: ['A'],
      explanation: 'Keyspaces replicates data across multiple AZs and supports point-in-time recovery.',
    },
  ],
  keyFacts: [
    'Serverless, Cassandra-compatible; use CQL and Cassandra drivers.',
    'Capacity: on-demand or provisioned with auto scaling.',
    'Data replicated 3 times across AZs; PITR; KMS encryption by default.',
    'Multi-Region replication available for global applications.',
  ],
  traps: [
    { clue: 'Cassandra compatibility required', answer: 'Keyspaces.' },
    { clue: 'No compatibility requirement, key-value at any scale', answer: 'DynamoDB.' },
  ],
  related: ['dynamodb', 'documentdb', 'neptune', 'dms', 'kms'],
  sources: [
    { title: 'What is Amazon Keyspaces?', url: 'https://docs.aws.amazon.com/keyspaces/latest/devguide/what-is-keyspaces.html' },
    { title: 'Read/write capacity modes in Amazon Keyspaces', url: 'https://docs.aws.amazon.com/keyspaces/latest/devguide/ReadWriteCapacityMode.html' },
    { title: 'AWS CLI keyspaces commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/keyspaces/index.html' },
  ],
};
