import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon Kinesis. Schema: see s3.js. */
export default {
  tagline: 'Real-time streaming data: ingest, buffer, deliver and analyse streams with Data Streams, Firehose and Flink.',
  intro: [
    'Amazon Kinesis is a family of services for streaming data: Kinesis Data Streams, Amazon Data Firehose, Amazon Managed Service for Apache Flink (formerly Kinesis Data Analytics) and Kinesis Video Streams.',
    'Kinesis Data Streams ingests and stores ordered records in shards (each shard accepts up to 1 MB/s or 1,000 records/s of writes and provides 2 MB/s of reads); retention is 24 hours by default and extendable to 365 days; on-demand mode removes shard management.',
    'Records are routed to shards by partition key; order is preserved within a shard; multiple consumers can read the same stream and replay data (enhanced fan-out gives each consumer dedicated throughput).',
    'Amazon Data Firehose is fully managed delivery: it buffers streaming data and loads it near-real-time into S3, Redshift, OpenSearch, Splunk or HTTP endpoints, optionally transforming with Lambda and converting to Parquet/ORC.',
    'Managed Service for Apache Flink runs SQL/Java/Python stream processing for real-time analytics on streams.',
    'Choose Data Streams for custom real-time processing and replay; Firehose when you just need to land data in a destination with no code; SQS when you need a simple queue with one consumer per message.',
  ],
  useCases: [
    { title: 'Real-time analytics', detail: 'Clickstream, IoT telemetry and application logs processed within seconds.' },
    { title: 'Data lake ingestion', detail: 'Firehose delivers streams to S3 in Parquet for Athena.' },
    { title: 'Event sourcing with replay', detail: 'Multiple consumers process the same ordered stream independently.' },
  ],
  importance: {
    points: [
      'Task 3.5 names streaming data services (Amazon Kinesis) and designing data streaming architectures.',
      'Key exam contrasts: Kinesis Data Streams vs Firehose vs SQS vs MSK, and real-time vs near-real-time vs batch.',
    ],
  },
  cli: [
    { command: 'aws kinesis create-stream --stream-name clicks --shard-count 2', description: 'Create a provisioned stream with 2 shards.' },
    { command: 'aws kinesis put-record --stream-name clicks --partition-key user42 --data "eyJldmVudCI6ImNsaWNrIn0="', description: 'Write a record (data is base64).' },
    { command: 'aws kinesis describe-stream-summary --stream-name clicks', description: 'View stream details.' },
    { command: 'aws kinesis update-shard-count --stream-name clicks --target-shard-count 4 --scaling-type UNIFORM_SCALING', description: 'Resize a provisioned stream.' },
    { command: 'aws firehose create-delivery-stream --delivery-stream-name logs-to-s3 --s3-destination-configuration RoleARN=<arn>,BucketARN=arn:aws:s3:::logs-bucket,BufferingHints={IntervalInSeconds=60,SizeInMBs=64}', description: 'Create a Firehose delivery stream to S3.' },
    { command: 'aws kinesis increase-stream-retention-period --stream-name clicks --retention-period-hours 168', description: 'Extend retention to 7 days.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): put records to a stream',
        language: 'python',
        code: `import boto3, json

kinesis = boto3.client("kinesis")
kinesis.put_record(
    StreamName="clicks",
    PartitionKey="user42",           # same key => same shard => ordered
    Data=json.dumps({"event": "click", "page": "/home"}).encode(),
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Clickstream to a data lake',
      scenario: 'A website\'s click events must be analysed in real time and stored in S3 for later SQL analysis.',
      steps: [
        'Applications write events to a Kinesis Data Stream with a user ID partition key.',
        'A Lambda or Flink consumer computes real-time metrics.',
        'Data Firehose reads the stream (or receives events directly) and delivers batches to S3 as Parquet.',
        'Athena queries the S3 data.',
      ],
    },
  ],
  diagram: {
    title: 'Kinesis streaming architecture',
    nodes: [
      ['prod', 'Producers (apps, IoT)', 'compute', 0, 1],
      ['kds', 'Kinesis Data Streams (shards)', 'analytics', 1, 1],
      ['cons', 'Consumers (Lambda / Flink)', 'compute', 2, 0],
      ['fh', 'Data Firehose', 'analytics', 2, 2],
      ['s3', 'S3 data lake', 'storage', 3, 2],
    ],
    edges: [
      ['prod', 'kds', 'PutRecord'],
      ['kds', 'cons', 'Real-time read'],
      ['kds', 'fh', 'Deliver'],
      ['fh', 's3', 'Batched writes'],
    ],
    steps: [
      'Producers write records with a partition key; Kinesis spreads them across shards while keeping per-key order.',
      'Real-time consumers (Lambda, Flink, KCL apps) read the stream within seconds.',
      'Firehose buffers the stream and delivers it to S3 (and other destinations) without consumer code.',
    ],
  },
  questionTypes: [
    { pattern: 'Real-time stream with replay and multiple consumers', hint: 'Kinesis Data Streams.' },
    { pattern: 'Load streaming data into S3/Redshift with no code', hint: 'Amazon Data Firehose (near-real-time).' },
    { pattern: 'Kinesis vs SQS', hint: 'Kinesis = ordered stream, multiple consumers, replay; SQS = queue, one consumer per message.' },
    { pattern: 'Scaling throughput', hint: 'Add shards (or use on-demand mode); distribute partition keys to avoid hot shards.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company needs to ingest clickstream data in real time, allow multiple independent applications to process the same data, and replay data for 7 days. Which service should be used?',
      options: ['Amazon SQS standard queue', 'Amazon Kinesis Data Streams with extended retention', 'Amazon SNS', 'Amazon S3 Standard-IA'],
      answer: ['B'],
      explanation: 'Kinesis Data Streams supports multiple consumers reading the same ordered data and retention up to 365 days, enabling replay.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A company wants streaming application logs delivered to Amazon S3 in near real time with no consumer code to manage and automatic batching. Which service is BEST?',
      options: ['Amazon Data Firehose', 'Kinesis Data Streams with a custom consumer fleet', 'AWS Glue crawler', 'Amazon SQS FIFO'],
      answer: ['A'],
      explanation: 'Firehose is a fully managed delivery service that buffers and loads streaming data into destinations such as S3 without writing consumers.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A Kinesis stream\'s write throughput is throttled because one partition key is extremely hot. What should the architect do?',
      options: ['Choose a partition key with higher cardinality to distribute records across shards', 'Decrease the shard count', 'Disable encryption', 'Use a smaller record size only'],
      answer: ['A'],
      explanation: 'Records with the same partition key go to the same shard. A more evenly distributed key spreads load across shards.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which statements about Kinesis Data Streams are true? (Select TWO.)',
      multi: true,
      options: ['Records with the same partition key are ordered within a shard.', 'Data is retained for 24 hours by default and can be extended.', 'Each message is deleted when one consumer reads it.', 'It cannot have more than one consumer.', 'It guarantees ordering across all shards.'],
      answer: ['A', 'B'],
      explanation: 'Ordering is per shard (per partition key), and retention defaults to 24 hours (extendable). Records are not deleted on read, and multiple consumers are supported.',
    },
  ],
  keyFacts: [
    'Data Streams shard: 1 MB/s or 1,000 records/s in; 2 MB/s out. Retention 24 hours default, up to 365 days. On-demand capacity mode available.',
    'Order is guaranteed only within a shard (same partition key).',
    'Firehose is near-real-time (buffered by size/time), manages scaling itself, and supports transformation and format conversion.',
    'Managed Service for Apache Flink replaces Kinesis Data Analytics for stream processing.',
    'Kinesis supports replay and multiple consumers; SQS deletes messages once processed.',
    'Encryption at rest via KMS; use enhanced fan-out for dedicated consumer throughput.',
  ],
  traps: [
    { clue: 'Real-time, ordered, replayable, multiple consumers', answer: 'Kinesis Data Streams.' },
    { clue: 'Deliver streams to S3/Redshift with no code', answer: 'Firehose.' },
    { clue: 'Run Apache Kafka compatible workload', answer: 'Amazon MSK.' },
    { clue: 'Simple decoupling, one consumer per message', answer: 'SQS.' },
  ],
  related: ['sqs', 'lambda', 's3', 'athena', 'glue', 'msk', 'opensearch'],
  sources: [
    { title: 'What is Amazon Kinesis Data Streams?', url: 'https://docs.aws.amazon.com/streams/latest/dev/introduction.html' },
    { title: 'Kinesis Data Streams key concepts', url: 'https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html' },
    { title: 'What is Amazon Data Firehose?', url: 'https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html' },
    { title: 'What is Managed Service for Apache Flink?', url: 'https://docs.aws.amazon.com/managed-flink/latest/java/what-is.html' },
    { title: 'AWS CLI kinesis commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/kinesis/index.html' },
  ],
};
