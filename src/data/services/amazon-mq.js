import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon MQ. Schema: see s3.js. */
export default {
  tagline: 'Managed ActiveMQ and RabbitMQ message brokers for migrating applications without rewriting them.',
  intro: [
    'Amazon MQ is a managed message broker service for Apache ActiveMQ Classic and RabbitMQ that handles broker setup, operation, maintenance and version upgrades.',
    'It supports industry-standard messaging APIs and protocols such as JMS, AMQP, MQTT, OpenWire, STOMP and WebSocket, so existing applications can move without rewriting their messaging code.',
    'Brokers run in your VPC and can be single-instance for development or highly available across Availability Zones (ActiveMQ active/standby, RabbitMQ cluster with quorum queues).',
    'Security includes encryption at rest and in transit, VPC private endpoints, and IAM for management actions; metrics flow to CloudWatch.',
    'Amazon MQ is the right answer for migrating an existing broker-based application; for new cloud-native applications prefer SQS and SNS, which are serverless, scale almost without limit and use AWS APIs.',
  ],
  useCases: [
    { title: 'Lift-and-shift of message brokers', detail: 'Move an on-premises ActiveMQ or RabbitMQ broker to AWS with no code changes.' },
    { title: 'Protocol-specific integrations', detail: 'Connect systems that speak JMS, AMQP, MQTT or STOMP.' },
  ],
  importance: {
    points: [
      'Domain 2 decoupling: exam stems mention "existing application uses JMS/AMQP/MQTT" to steer you to Amazon MQ instead of SQS.',
      'It is not serverless: you size brokers and pay per broker-hour and storage.',
    ],
  },
  cli: [
    { command: 'aws mq create-broker --broker-name orders --engine-type ACTIVEMQ --engine-version 5.18 --host-instance-type mq.m5.large --deployment-mode ACTIVE_STANDBY_MULTI_AZ --users Username=admin,Password=<password> --publicly-accessible false', description: 'Create a highly available ActiveMQ broker.' },
    { command: 'aws mq list-brokers', description: 'List brokers.' },
    { command: 'aws mq describe-broker --broker-id b-abc', description: 'Show endpoints and state.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): list brokers',
        language: 'python',
        code: `import boto3

mq = boto3.client("mq")
for b in mq.list_brokers()["BrokerSummaries"]:
    print(b["BrokerName"], b["EngineType"], b["DeploymentMode"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Migrate a JMS-based application',
      scenario: 'A legacy application uses ActiveMQ with JMS and cannot be rewritten before the data centre closes.',
      steps: [
        'Create an Amazon MQ for ActiveMQ broker in active/standby mode in the VPC.',
        'Point the application\'s JMS connection URL to the broker endpoint.',
        'Monitor queue depth in CloudWatch and plan a later move to SQS/SNS for new services.',
      ],
    },
  ],
  diagram: {
    title: 'Amazon MQ broker',
    nodes: [
      ['app', 'Existing app (JMS / AMQP / MQTT)', 'external', 0, 1],
      ['cw', 'CloudWatch metrics', 'management', 1, 0],
      ['broker', 'Amazon MQ broker', 'integration', 1, 1],
      ['standby', 'Standby broker (second AZ)', 'integration', 1, 2],
      ['cons', 'Consumers', 'compute', 2, 1],
    ],
    edges: [
      ['app', 'broker', 'Standard protocols'],
      ['broker', 'cw', 'Metrics'],
      ['broker', 'standby', 'Failover pair'],
      ['broker', 'cons', 'Delivers messages'],
    ],
    steps: [
      'Existing applications connect with their current protocol and client libraries.',
      'The broker queues or publishes messages; a standby in another AZ takes over on failure.',
      'Consumers receive messages and CloudWatch tracks queue metrics.',
    ],
  },
  questionTypes: [
    { pattern: 'Migrate existing broker apps using JMS/AMQP/MQTT', hint: 'Amazon MQ.' },
    { pattern: 'New cloud-native decoupling', hint: 'SQS and SNS.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company\'s application uses Apache ActiveMQ with JMS and must move to AWS without code changes. Which service should be used?',
      options: ['Amazon Kinesis Data Streams', 'Amazon SNS', 'Amazon MQ', 'Amazon SQS'],
      answer: ['C'],
      explanation: 'Amazon MQ supports industry-standard protocols such as JMS, so applications migrate without rewriting messaging code.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which statements about Amazon MQ are true? (Select TWO.)',
      multi: true,
      options: ['It provides managed maintenance and upgrades for brokers.', 'It supports ActiveMQ and RabbitMQ brokers.', 'It only works with proprietary AWS protocols.', 'It is a stream processing service.', 'It is a serverless service with unlimited throughput and no broker sizing.'],
      answer: ['A', 'B'],
      explanation: 'Amazon MQ manages broker engines (ActiveMQ, RabbitMQ) but you choose broker instance types; it is not serverless.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A new cloud-native application needs a simple, highly scalable queue with no brokers to size or manage. Which is the BEST choice?',
      options: ['AWS Snowball Edge', 'A self-managed RabbitMQ on EC2', 'Amazon MQ with a large broker', 'Amazon SQS'],
      answer: ['D'],
      explanation: 'SQS is serverless and scales automatically; Amazon MQ is for compatibility with existing broker protocols.',
    },
  ],
  keyFacts: [
    'Managed ActiveMQ Classic and RabbitMQ brokers; JMS, AMQP, MQTT, OpenWire, STOMP.',
    'Not serverless: choose broker instance types; high availability across AZs.',
    'Use for migrations preserving protocols; SQS/SNS for new applications.',
    'Encryption at rest/in transit, VPC endpoints, CloudWatch metrics.',
  ],
  traps: [
    { clue: 'Existing JMS/AMQP/MQTT application, no code change', answer: 'Amazon MQ.' },
    { clue: 'New app, serverless queue', answer: 'SQS.' },
  ],
  related: ['sqs', 'sns', 'eventbridge', 'msk', 'vpc'],
  sources: [
    { title: 'What is Amazon MQ?', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/welcome.html' },
    { title: 'Deployment options for ActiveMQ brokers', url: 'https://docs.aws.amazon.com/amazon-mq/latest/developer-guide/amazon-mq-broker-architecture.html' },
    { title: 'AWS CLI mq commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/mq/index.html' },
  ],
};
