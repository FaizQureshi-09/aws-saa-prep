import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon DocumentDB. Schema: see s3.js. */
export default {
  tagline: 'Managed document database with MongoDB compatibility for JSON workloads.',
  intro: [
    'Amazon DocumentDB (with MongoDB compatibility) is a fully managed document database that stores, queries and indexes JSON data, and works with MongoDB drivers and tools.',
    'It is designed like Aurora: a cluster has one primary instance and up to 15 read replicas sharing a cluster volume that stores six copies of data across three Availability Zones and scales automatically.',
    'Compute and storage are separated, so you can add replicas for read scaling without copying data; failover to a replica typically completes within about 30 seconds.',
    'It provides continuous backup to S3 with point-in-time restore, encryption at rest with KMS, TLS in transit and VPC isolation.',
    'DocumentDB is compatible with the MongoDB API but is not MongoDB itself; choose it to migrate existing MongoDB-style applications with little change, and DynamoDB for serverless key-value access.',
  ],
  useCases: [
    { title: 'Content management and catalogues', detail: 'Flexible JSON documents with rich queries and indexes.' },
    { title: 'User profiles and personalisation', detail: 'Store varied attributes per user without a fixed schema.' },
    { title: 'Migrating MongoDB workloads', detail: 'Use DMS to move data and keep MongoDB drivers.' },
  ],
  importance: {
    points: [
      'Domain 3 database selection: "MongoDB-compatible, JSON documents, managed" means DocumentDB.',
      'Compare with DynamoDB (key-value/document, serverless, single-digit ms at any scale) and Aurora (relational).',
    ],
  },
  cli: [
    { command: 'aws docdb create-db-cluster --db-cluster-identifier docs --engine docdb --master-username admin --master-user-password <password> --storage-encrypted', description: 'Create an encrypted DocumentDB cluster.' },
    { command: 'aws docdb create-db-instance --db-instance-identifier docs-1 --db-instance-class db.r6g.large --engine docdb --db-cluster-identifier docs', description: 'Add the primary instance.' },
    { command: 'aws docdb describe-db-clusters', description: 'List clusters.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (pymongo): connect with TLS',
        language: 'python',
        code: `from pymongo import MongoClient

client = MongoClient(
    "mongodb://admin:<password>@docs.cluster-abc.us-east-1.docdb.amazonaws.com:27017/"
    "?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false"
)
client.shop.products.insert_one({"sku": "A1", "name": "Mug", "tags": ["kitchen"]})`,
      },
    ],
  },
  examples: [
    {
      title: 'Move a MongoDB application to AWS',
      scenario: 'A company runs MongoDB on EC2 and wants a managed service without rewriting the application.',
      steps: [
        'Create a DocumentDB cluster with replicas in three AZs.',
        'Use AWS DMS to replicate data from MongoDB to DocumentDB.',
        'Point the application at the cluster endpoint and the reader endpoint for reads.',
      ],
    },
  ],
  diagram: {
    title: 'DocumentDB cluster',
    nodes: [
      ['app', 'Application (MongoDB driver)', 'compute', 0, 1],
      ['bak', 'Continuous backup to S3', 'storage', 1, 0],
      ['primary', 'Primary instance', 'database', 1, 1],
      ['rep', 'Replicas (up to 15)', 'database', 1, 2],
      ['vol', 'Cluster volume (6 copies, 3 AZs)', 'storage', 2, 1],
    ],
    edges: [
      ['app', 'primary', 'MongoDB API'],
      ['primary', 'bak', 'Backups'],
      ['primary', 'rep', 'Replicates'],
      ['primary', 'vol', 'Writes durably'],
    ],
    steps: [
      'Applications use MongoDB drivers against the cluster endpoint.',
      'The primary writes to a shared cluster volume across three AZs; replicas serve reads.',
      'Backups run continuously to S3 for point-in-time restore.',
    ],
  },
  questionTypes: [
    { pattern: 'MongoDB-compatible managed database', hint: 'Amazon DocumentDB.' },
    { pattern: 'JSON documents with flexible schema', hint: 'DocumentDB or DynamoDB.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company wants to move its self-managed MongoDB workload to a managed AWS service that keeps using MongoDB drivers. Which service should be used?',
      options: ['Amazon Redshift', 'Amazon Neptune', 'Amazon RDS for MySQL', 'Amazon DocumentDB (with MongoDB compatibility)'],
      answer: ['D'],
      explanation: 'DocumentDB is MongoDB-compatible and managed; DMS can migrate the data.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'How is data stored in an Amazon DocumentDB cluster?',
      options: ['In EFS file systems per replica', 'In an S3 bucket per document', 'In a shared cluster volume with six copies across three Availability Zones', 'On local instance storage only'],
      answer: ['C'],
      explanation: 'DocumentDB uses Aurora-like storage shared by the primary and replicas.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which statements about Amazon DocumentDB are true? (Select TWO.)',
      multi: true,
      options: ['It supports up to 15 read replicas.', 'It provides continuous backup with point-in-time restore.', 'It is a graph database.', 'It has no encryption options.', 'It is MongoDB itself running as a licensed product.'],
      answer: ['A', 'B'],
      explanation: 'DocumentDB supports up to 15 replicas and PITR; it is API-compatible with MongoDB, not MongoDB itself, and is a document database.',
    },
  ],
  keyFacts: [
    'MongoDB-compatible document database; JSON documents with indexing.',
    'Cluster: primary + up to 15 replicas; shared volume with six copies in three AZs.',
    'Continuous backup to S3, PITR, KMS encryption, TLS.',
    'Compatible with the MongoDB API, not MongoDB software; migrate with DMS.',
  ],
  traps: [
    { clue: 'MongoDB workloads, managed', answer: 'DocumentDB.' },
    { clue: 'Serverless key-value, any scale', answer: 'DynamoDB.' },
  ],
  related: ['dynamodb', 'aurora', 'neptune', 'dms', 'kms'],
  sources: [
    { title: 'What is Amazon DocumentDB?', url: 'https://docs.aws.amazon.com/documentdb/latest/developerguide/what-is.html' },
    { title: 'Amazon DocumentDB cluster architecture', url: 'https://docs.aws.amazon.com/documentdb/latest/developerguide/replication.html' },
    { title: 'AWS CLI docdb commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/docdb/index.html' },
  ],
};
