import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon DynamoDB. Schema: see s3.js. */
export default {
  tagline: 'Fully managed, serverless NoSQL key-value and document database with single-digit-millisecond performance at any scale.',
  intro: [
    'Amazon DynamoDB is a serverless NoSQL database: no servers to provision, automatic multi-AZ replication, and virtually unlimited table size and throughput.',
    'Data model: tables of items (up to 400 KB each) identified by a partition key, optionally with a sort key; access patterns must be designed around keys.',
    'Capacity modes: on-demand (pay per request, no planning) and provisioned (set read/write capacity units, optionally with auto scaling).',
    'Secondary indexes: global secondary indexes (any keys, eventually consistent, can be added any time) and local secondary indexes (same partition key, created with the table).',
    'Performance and resilience features: DAX in-memory cache (microsecond reads), DynamoDB Streams, TTL, point-in-time recovery (35 days), on-demand backups and global tables for multi-Region, multi-active replication.',
    'Security: IAM and fine-grained access control, encryption at rest by default (KMS), VPC endpoints, and transactions across items (ACID) when needed.',
  ],
  useCases: [
    { title: 'Serverless backends', detail: 'API Gateway + Lambda + DynamoDB for user profiles, sessions, carts and IoT data.' },
    { title: 'Gaming leaderboards and real-time apps', detail: 'Predictable low latency at massive scale.' },
    { title: 'Global, multi-Region applications', detail: 'Global tables replicate writes between Regions with multi-active access.' },
    { title: 'Event-driven processing', detail: 'Streams trigger Lambda on item changes for aggregation and auditing.' },
  ],
  importance: {
    points: [
      'DynamoDB vs Aurora/RDS selection is repeated in Tasks 3.3 and 4.3 ("DynamoDB compared with Amazon RDS").',
      'Capacity planning (capacity units), caching (DAX) and Global tables are classic exam topics.',
      'Often the correct "serverless, least operational overhead" database answer.',
    ],
  },
  cli: [
    { command: 'aws dynamodb create-table --table-name Orders --attribute-definitions AttributeName=OrderId,AttributeType=S --key-schema AttributeName=OrderId,KeyType=HASH --billing-mode PAY_PER_REQUEST', description: 'Create an on-demand table.' },
    { command: 'aws dynamodb put-item --table-name Orders --item \'{"OrderId":{"S":"o-1001"},"Total":{"N":"49.90"}}\'', description: 'Write an item.' },
    { command: 'aws dynamodb get-item --table-name Orders --key \'{"OrderId":{"S":"o-1001"}}\' --consistent-read', description: 'Read an item with a strongly consistent read.' },
    { command: 'aws dynamodb query --table-name Orders --index-name CustomerIndex --key-condition-expression "CustomerId = :c" --expression-attribute-values \'{":c":{"S":"c-7"}}\'', description: 'Query a global secondary index.' },
    { command: 'aws dynamodb update-time-to-live --table-name Sessions --time-to-live-specification Enabled=true,AttributeName=expiresAt', description: 'Enable TTL to expire items automatically.' },
    { command: 'aws dynamodb update-continuous-backups --table-name Orders --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true', description: 'Enable point-in-time recovery.' },
    { command: 'aws dynamodb update-table --table-name Orders --replica-updates \'[{"Create":{"RegionName":"us-east-1"}}]\'', description: 'Add a global table replica Region.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): conditional write and query',
        language: 'python',
        code: `import boto3
from boto3.dynamodb.conditions import Key

table = boto3.resource("dynamodb").Table("Orders")

# Fails if the order already exists (prevents overwriting)
table.put_item(
    Item={"OrderId": "o-1002", "CustomerId": "c-7", "Total": 75},
    ConditionExpression="attribute_not_exists(OrderId)",
)

resp = table.query(
    IndexName="CustomerIndex",
    KeyConditionExpression=Key("CustomerId").eq("c-7"),
)
print(resp["Items"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Session store with automatic expiry and caching',
      scenario: 'A web app stores user sessions that must expire after 24 hours and be read with microsecond latency.',
      steps: [
        'Create a table with SessionId as the partition key, on-demand capacity.',
        'Store an expiresAt epoch timestamp and enable TTL on that attribute.',
        'Put DAX in front of the table for microsecond cached reads.',
        'Enable point-in-time recovery for accidental deletion protection.',
      ],
    },
  ],
  diagram: {
    title: 'DynamoDB with DAX, Streams and Global Tables',
    nodes: [
      ['app', 'Application / Lambda', 'compute', 0, 1],
      ['dax', 'DAX cache cluster', 'database', 1, 0],
      ['ddb', 'DynamoDB table', 'database', 1, 1],
      ['stream', 'DynamoDB Streams', 'integration', 2, 1],
      ['replica', 'Replica table (Region B)', 'database', 1, 2],
    ],
    edges: [
      ['app', 'dax', 'Cached reads'],
      ['dax', 'ddb', 'Cache miss'],
      ['app', 'ddb', 'Writes'],
      ['ddb', 'stream', 'Item changes'],
      ['ddb', 'replica', 'Global table sync', 'dashed'],
    ],
    steps: [
      'The application reads through DAX for microsecond latency; on a miss DAX fetches from the table and caches the result.',
      'Writes go to the table (DAX is write-through for writes made via DAX).',
      'DynamoDB Streams records item changes in order for 24 hours, triggering Lambda or other consumers.',
      'Global tables replicate changes to tables in other Regions for multi-Region access and DR.',
    ],
  },
  questionTypes: [
    { pattern: 'Key-value at massive scale with minimal ops', hint: 'DynamoDB on-demand + DAX if reads need microseconds.' },
    { pattern: 'Capacity unit math', hint: '1 RCU = one 4 KB strongly consistent read per second (two eventually consistent); 1 WCU = one 1 KB write per second.' },
    { pattern: 'Multi-Region active-active', hint: 'Global tables.' },
    { pattern: 'React to item changes', hint: 'DynamoDB Streams + Lambda.' },
    { pattern: 'Expire old data cheaply', hint: 'TTL (deletions do not consume write capacity).' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A gaming company needs a database that supports single-digit-millisecond reads and writes at a scale of millions of requests per second, with no capacity planning. Which solution should the solutions architect recommend?',
      options: ['Amazon RDS for MySQL with read replicas', 'Amazon DynamoDB with on-demand capacity', 'Amazon Redshift', 'A self-managed Cassandra cluster on EC2'],
      answer: ['B'],
      explanation: 'DynamoDB on-demand scales automatically for key-value workloads with consistent single-digit-millisecond latency and no capacity planning.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A read-heavy DynamoDB application requires response times in microseconds for frequently read items, with minimal application changes. What should be added?',
      options: ['A global secondary index', 'Amazon DynamoDB Accelerator (DAX)', 'An RDS read replica', 'Provisioned capacity with a higher RCU count'],
      answer: ['B'],
      explanation: 'DAX is a fully managed, API-compatible in-memory cache for DynamoDB that delivers microsecond read latency.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'An application deployed in two AWS Regions must read and write the same data in both Regions with low latency and survive a Regional failure. Which database feature meets this?',
      options: ['DynamoDB global tables', 'DynamoDB local secondary indexes', 'RDS Multi-AZ', 'DynamoDB Streams only'],
      answer: ['A'],
      explanation: 'Global tables provide fully managed multi-Region, multi-active replication so each Region can serve reads and writes locally.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A table must support an application that queries items by an attribute that is not the primary key, and the requirement was added after the table was created. What should be used?',
      options: ['A local secondary index', 'A global secondary index', 'A scan with a filter on every request', 'A new table with a different partition key only'],
      answer: ['B'],
      explanation: 'GSIs can be added at any time and use different partition/sort keys; LSIs must be defined at table creation and share the table\'s partition key.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'A table of temporary session records grows constantly. The company wants to delete records after 7 days without consuming write capacity or running custom jobs. What should be configured?',
      options: ['A scheduled Lambda that scans and deletes items', 'DynamoDB Time to Live (TTL) on an expiry attribute', 'A DynamoDB Stream consumer that deletes records', 'An S3 lifecycle rule'],
      answer: ['B'],
      explanation: 'TTL automatically deletes expired items at no extra write-capacity cost. Scans and custom jobs consume capacity and add operational overhead.',
    },
  ],
  keyFacts: [
    'Item size limit is 400 KB; partition key is mandatory, sort key optional; choose keys that spread requests evenly (avoid hot partitions).',
    'Read capacity: 1 RCU = one strongly consistent read of up to 4 KB per second (two eventually consistent); transactional reads cost double. 1 WCU = one write of up to 1 KB per second.',
    'On-demand = pay per request with no planning; provisioned = set RCU/WCU (with auto scaling) and is usually cheaper for steady, predictable traffic.',
    'Default of 20 GSIs and 5 LSIs per table; LSIs must be created with the table; GSIs are eventually consistent.',
    'DAX is for read-heavy, eventually consistent workloads and is not useful for write-heavy or strongly consistent reads.',
    'Streams keep ordered item-level changes for 24 hours; PITR allows restore to any second in the last 35 days.',
    'Global tables give multi-Region multi-active replication; it requires Streams (managed for you).',
    'Query uses keys and is efficient; Scan reads the whole table and is expensive - avoid in production paths.',
  ],
  traps: [
    { clue: 'Microsecond read latency for DynamoDB', answer: 'DAX.' },
    { clue: 'Multi-Region active-active NoSQL', answer: 'DynamoDB global tables.' },
    { clue: 'Automatic expiry of items', answer: 'TTL.' },
    { clue: 'Trigger code when items change', answer: 'DynamoDB Streams + Lambda.' },
    { clue: 'Complex joins / SQL reporting', answer: 'Not DynamoDB - use Aurora/RDS or Redshift.' },
  ],
  related: ['aurora', 'lambda', 'elasticache', 'kinesis', 'backup'],
  sources: [
    { title: 'What is Amazon DynamoDB?', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html' },
    { title: 'DynamoDB quotas', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ServiceQuotas.html' },
    { title: 'Read/write capacity mode', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html' },
    { title: 'DynamoDB Accelerator (DAX)', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html' },
    { title: 'Global tables', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html' },
    { title: 'Time to Live (TTL)', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html' },
    { title: 'AWS CLI dynamodb commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/dynamodb/index.html' },
  ],
};
