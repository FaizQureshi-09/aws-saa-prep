import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon MSK. Schema: see s3.js. */
export default {
  tagline: 'Fully managed Apache Kafka for building and running streaming data applications.',
  intro: [
    'Amazon Managed Streaming for Apache Kafka (MSK) is a fully managed service that runs open-source Apache Kafka, so existing Kafka applications and tools work without code changes.',
    'AWS provisions and operates the Kafka brokers and the cluster metadata layer across multiple Availability Zones, replaces failed brokers and handles patching; you choose provisioned clusters or MSK Serverless.',
    'Security options include VPC isolation, encryption at rest and in transit, and authentication with IAM, SASL/SCRAM or mutual TLS; MSK Connect runs Kafka Connect connectors for moving data in and out.',
    'Producers write to topics and consumers read them; common consumers include Lambda, Managed Service for Apache Flink, Glue, EMR and S3 sinks.',
    'Choose MSK when applications already use Kafka APIs or need Kafka features; choose Kinesis Data Streams for an AWS-native, serverless-style stream with simpler operations.',
  ],
  useCases: [
    { title: 'Migrate existing Kafka workloads', detail: 'Move self-managed Kafka clusters to AWS without changing producers and consumers.' },
    { title: 'Real-time analytics pipelines', detail: 'Stream clickstreams or IoT data into Flink, Redshift or OpenSearch.' },
    { title: 'Event-driven microservices', detail: 'Use Kafka topics as the backbone between services.' },
  ],
  importance: {
    points: [
      'Domain 3 data ingestion: the exam asks you to separate Kafka-compatible (MSK) from AWS-native streaming (Kinesis).',
      'Know the protocols and the AZ layout; cluster tuning is not tested.',
    ],
  },
  cli: [
    { command: 'aws kafka create-cluster-v2 --cluster-name events --provisioned file://provisioned.json', description: 'Create a provisioned MSK cluster from a JSON definition.' },
    { command: 'aws kafka list-clusters-v2', description: 'List MSK clusters.' },
    { command: 'aws kafka get-bootstrap-brokers --cluster-arn <arn>', description: 'Get the broker connection strings.' },
    { command: 'aws kafka describe-cluster-v2 --cluster-arn <arn>', description: 'Show cluster state and configuration.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): get bootstrap brokers',
        language: 'python',
        code: `import boto3

kafka = boto3.client("kafka")
resp = kafka.get_bootstrap_brokers(ClusterArn="arn:aws:kafka:us-east-1:111122223333:cluster/events/abc")
print(resp.get("BootstrapBrokerStringTls"))`,
      },
    ],
  },
  examples: [
    {
      title: 'Kafka pipeline into a data lake',
      scenario: 'An existing Kafka producer fleet must feed a data lake without changing application code.',
      steps: [
        'Create an MSK cluster across three AZs and update the producers\' bootstrap servers.',
        'Use MSK Connect with an S3 sink connector to write topics to S3.',
        'Query the data with Athena and secure the cluster with IAM or mutual TLS.',
      ],
    },
  ],
  diagram: {
    title: 'Amazon MSK pipeline',
    nodes: [
      ['prod', 'Producers (apps, IoT, CDC)', 'compute', 0, 1],
      ['auth', 'IAM / SASL / mutual TLS', 'security', 1, 0],
      ['msk', 'MSK cluster (brokers in 3 AZs)', 'integration', 1, 1],
      ['conn', 'MSK Connect S3 sink', 'integration', 1, 2],
      ['cons', 'Consumers (Lambda, Flink, Glue)', 'compute', 2, 1],
    ],
    edges: [
      ['prod', 'msk', 'Kafka topics'],
      ['auth', 'msk', 'Authenticates clients'],
      ['msk', 'conn', 'Connector'],
      ['msk', 'cons', 'Consume streams'],
    ],
    steps: [
      'Producers publish records to Kafka topics on brokers spread across AZs.',
      'Authentication and encryption protect the cluster.',
      'Consumers and MSK Connect read the topics to process or store the data.',
    ],
  },
  questionTypes: [
    { pattern: 'Managed Kafka / existing Kafka applications', hint: 'Amazon MSK.' },
    { pattern: 'MSK vs Kinesis Data Streams', hint: 'Kafka API compatibility vs AWS-native stream.' },
  ],
  questions: [
    {
      source: 'mock', domain: 3,
      stem: 'A company runs Apache Kafka on EC2 and wants a managed service that keeps Kafka APIs and clients unchanged. Which service should be used?',
      options: ['Amazon Kinesis Data Firehose', 'Amazon MSK', 'Amazon SQS', 'Amazon SNS'],
      answer: ['B'],
      explanation: 'MSK runs open-source Kafka as a managed service so existing producers and consumers continue to work.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Which authentication options does Amazon MSK support? (Select TWO.)',
      multi: true,
      options: ['Kerberos through AWS WAF', 'S3 bucket policies', 'IAM access control', 'Anonymous public access only', 'Mutual TLS'],
      answer: ['C', 'E'],
      explanation: 'MSK supports IAM, SASL/SCRAM and mutual TLS client authentication.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A new application needs a simple AWS-native streaming service with no Kafka compatibility requirement. Which is MOST suitable?',
      options: ['Self-managed Kafka on EC2', 'AWS DataSync', 'Amazon MQ', 'Amazon Kinesis Data Streams'],
      answer: ['D'],
      explanation: 'Kinesis Data Streams is the AWS-native option; MSK is chosen when Kafka compatibility is required.',
    },
  ],
  keyFacts: [
    'Managed Apache Kafka; brokers across multiple AZs; provisioned or serverless.',
    'Auth: IAM, SASL/SCRAM, mutual TLS; encryption at rest and in transit.',
    'MSK Connect for Kafka Connect connectors (for example S3 sink).',
    'Use when Kafka APIs are required; Kinesis for AWS-native streaming.',
  ],
  traps: [
    { clue: 'Kafka compatibility', answer: 'MSK.' },
    { clue: 'AWS-native stream with minimal ops', answer: 'Kinesis Data Streams.' },
  ],
  related: ['kinesis', 'amazon-mq', 'sqs', 'glue', 'athena', 'lambda'],
  sources: [
    { title: 'What is Amazon MSK?', url: 'https://docs.aws.amazon.com/msk/latest/developerguide/what-is-msk.html' },
    { title: 'Authentication and authorization for Amazon MSK', url: 'https://docs.aws.amazon.com/msk/latest/developerguide/kafka_apis_iam.html' },
    { title: 'AWS CLI kafka commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/kafka/index.html' },
  ],
};
