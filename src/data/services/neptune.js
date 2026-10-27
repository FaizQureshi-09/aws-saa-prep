import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Neptune. Schema: see s3.js. */
export default {
  tagline: 'Managed graph database for highly connected data such as social networks and fraud rings.',
  intro: [
    'Amazon Neptune is a fast, reliable, fully managed graph database built to store billions of relationships and query them with millisecond latency.',
    'It supports property graph models (Apache TinkerPop Gremlin and openCypher) and the W3C RDF model (SPARQL), so you pick the query language that matches your data model.',
    'A Neptune cluster has a primary writer instance and up to 15 read replicas sharing one cluster volume that keeps six copies of the data across three Availability Zones and grows automatically.',
    'It offers Multi-AZ failover, continuous backup to S3 with point-in-time restore, encryption at rest with KMS and in transit, and VPC isolation.',
    'Use it when relationships are the point of the data: social graphs, recommendation engines, fraud detection, knowledge graphs and network security analysis.',
  ],
  useCases: [
    { title: 'Fraud detection', detail: 'Find rings of accounts sharing devices, addresses or cards.' },
    { title: 'Recommendation engines', detail: 'Traverse "people who bought this also bought" relationships.' },
    { title: 'Knowledge graphs', detail: 'Link entities and facts with RDF and SPARQL.' },
  ],
  importance: {
    points: [
      'Domain 3 database selection: graph relationships point to Neptune, documents to DocumentDB, key-value to DynamoDB, relational to RDS/Aurora.',
      'Rarely asked in depth; know the use cases and the query languages.',
    ],
  },
  cli: [
    { command: 'aws neptune create-db-cluster --db-cluster-identifier graph --engine neptune --storage-encrypted', description: 'Create an encrypted Neptune cluster.' },
    { command: 'aws neptune create-db-instance --db-instance-identifier graph-1 --db-instance-class db.r6g.large --engine neptune --db-cluster-identifier graph', description: 'Add the primary instance.' },
    { command: 'aws neptune describe-db-clusters', description: 'List clusters.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Gremlin: find friends of friends',
        language: 'text',
        code: `g.V().has('person','name','Alice').
  out('knows').out('knows').
  dedup().values('name')`,
      },
    ],
  },
  examples: [
    {
      title: 'Spot fraud rings',
      scenario: 'An online retailer wants to detect groups of accounts that share payment cards and addresses.',
      steps: [
        'Load accounts, cards, devices and addresses as vertices and their links as edges.',
        'Query for connected components with unusually many shared attributes.',
        'Flag suspicious clusters for review in near real time.',
      ],
    },
  ],
  diagram: {
    title: 'Neptune cluster',
    nodes: [
      ['app', 'Application (Gremlin / openCypher / SPARQL)', 'compute', 0, 1],
      ['lang', 'Graph query languages', 'integration', 1, 0],
      ['writer', 'Neptune writer instance', 'database', 1, 1],
      ['rep', 'Read replicas (up to 15)', 'database', 1, 2],
      ['vol', 'Cluster volume (6 copies, 3 AZs)', 'storage', 2, 1],
    ],
    edges: [
      ['app', 'writer', 'Graph queries'],
      ['lang', 'writer', 'Supported models'],
      ['writer', 'rep', 'Replicates'],
      ['writer', 'vol', 'Writes durably'],
    ],
    steps: [
      'Applications send graph queries to the writer (or reader endpoint for read scaling).',
      'The writer stores data on a shared cluster volume replicated across three AZs.',
      'Up to 15 read replicas serve read traffic and can take over on failure.',
    ],
  },
  questionTypes: [
    { pattern: 'Highly connected data / relationships', hint: 'Amazon Neptune (graph).' },
    { pattern: 'Graph query languages', hint: 'Gremlin, openCypher, SPARQL.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A social media company needs a database optimised for traversing billions of friend relationships with millisecond latency. Which service should be used?',
      options: ['Amazon ElastiCache', 'Amazon Neptune', 'Amazon Redshift', 'Amazon DynamoDB'],
      answer: ['B'],
      explanation: 'Neptune is a managed graph database designed for highly connected data.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which query languages does Amazon Neptune support? (Select TWO.)',
      multi: true,
      options: ['SPARQL', 'CQL', 'T-SQL', 'Gremlin', 'PL/SQL'],
      answer: ['A', 'D'],
      explanation: 'Neptune supports Gremlin and openCypher (property graph) and SPARQL (RDF).',
    },
    {
      source: 'mock', domain: 2,
      stem: 'How does a Neptune cluster achieve durability and read scaling?',
      options: ['A DynamoDB table per vertex', 'A single instance with local disks', 'One S3 bucket per query', 'A shared cluster volume with six copies across three AZs and up to 15 read replicas'],
      answer: ['D'],
      explanation: 'Neptune shares a self-healing cluster volume among the writer and replicas.',
    },
  ],
  keyFacts: [
    'Graph database: vertices, edges and properties; billions of relationships, millisecond queries.',
    'Languages: Gremlin, openCypher, SPARQL.',
    'Writer + up to 15 read replicas; storage auto-grows with six copies over three AZs.',
    'Multi-AZ failover, PITR backups, KMS encryption.',
  ],
  traps: [
    { clue: 'Relationships and traversals are the core workload', answer: 'Neptune.' },
    { clue: 'Key-value at massive scale', answer: 'DynamoDB.' },
  ],
  related: ['aurora', 'dynamodb', 'documentdb', 'rds', 'kms'],
  sources: [
    { title: 'What is Amazon Neptune?', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/intro.html' },
    { title: 'Neptune storage and replication', url: 'https://docs.aws.amazon.com/neptune/latest/userguide/feature-overview-storage.html' },
    { title: 'AWS CLI neptune commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/neptune/index.html' },
  ],
};
