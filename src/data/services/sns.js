import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon SNS. Schema: see s3.js. */
export default {
  tagline: 'Fully managed publish/subscribe messaging that fans messages out to many subscribers at once.',
  intro: [
    'Amazon SNS is a pub/sub service: publishers send a message to a topic and SNS delivers a copy to every subscriber.',
    'Subscriber types include SQS queues, Lambda functions, HTTP/HTTPS endpoints, email, SMS, mobile push notifications and Amazon Data Firehose.',
    'Standard topics offer high throughput and best-effort ordering; FIFO topics provide strict ordering and deduplication (delivered to SQS FIFO queues).',
    'Subscription filter policies deliver only matching messages to each subscriber, so one topic can serve many consumers without extra code.',
    'Delivery is retried automatically; failed deliveries can go to a subscription dead-letter queue; topics support encryption with KMS and access policies.',
    'SNS is push-based, while SQS is pull-based - together they form the classic fan-out pattern.',
  ],
  useCases: [
    { title: 'Fan-out to multiple systems', detail: 'One event reaches billing, inventory and analytics queues in parallel.' },
    { title: 'Alerts and notifications', detail: 'CloudWatch alarms and AWS events notify teams by email, SMS or chat integrations.' },
    { title: 'Mobile push', detail: 'Send push notifications to iOS, Android and other devices.' },
    { title: 'Event filtering', detail: 'Route different message attributes to different subscribers.' },
  ],
  importance: {
    points: [
      'Pub/sub is named explicitly in Tasks 2.1 and 3.2 ("queuing and messaging concepts, for example publish/subscribe").',
      'SNS + SQS fan-out and CloudWatch alarm notifications show up in many architectures.',
      'Know SNS vs SQS vs EventBridge vs Kinesis: who pushes, who pulls, who streams.',
    ],
  },
  cli: [
    { command: 'aws sns create-topic --name order-events', description: 'Create a standard topic.' },
    { command: 'aws sns subscribe --topic-arn <topic-arn> --protocol sqs --notification-endpoint <queue-arn>', description: 'Subscribe an SQS queue (queue policy must allow SNS).' },
    { command: 'aws sns subscribe --topic-arn <topic-arn> --protocol email --notification-endpoint ops@example.com', description: 'Subscribe an email address (needs confirmation).' },
    { command: 'aws sns publish --topic-arn <topic-arn> --message "Order created" --message-attributes \'{"region":{"DataType":"String","StringValue":"in"}}\'', description: 'Publish a message with attributes.' },
    { command: 'aws sns set-subscription-attributes --subscription-arn <arn> --attribute-name FilterPolicy --attribute-value \'{"region":["in"]}\'', description: 'Add a filter policy to a subscription.' },
    { command: 'aws sns create-topic --name orders.fifo --attributes FifoTopic=true', description: 'Create a FIFO topic.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): publish with message attributes',
        language: 'python',
        code: `import boto3, json

sns = boto3.client("sns")
sns.publish(
    TopicArn="arn:aws:sns:ap-south-1:111111111111:order-events",
    Message=json.dumps({"orderId": 1001}),
    MessageAttributes={"region": {"DataType": "String", "StringValue": "in"}},
)`,
      },
    ],
  },
  examples: [
    {
      title: 'Order event fan-out',
      scenario: 'When an order is placed, the billing, inventory and analytics systems must each process it independently.',
      steps: [
        'Create an SNS topic "order-events".',
        'Create three SQS queues and subscribe each to the topic (allow SNS in each queue policy).',
        'The order service publishes once; each queue gets its own copy.',
        'Each downstream system scales and fails independently.',
      ],
    },
  ],
  diagram: {
    title: 'SNS to SQS fan-out',
    nodes: [
      ['pub', 'Order service (publisher)', 'compute', 0, 1],
      ['topic', 'SNS topic', 'integration', 1, 1],
      ['q1', 'SQS: billing', 'integration', 2, 0],
      ['q2', 'SQS: inventory', 'integration', 2, 1],
      ['fn', 'Lambda: notifications', 'compute', 2, 2],
    ],
    edges: [
      ['pub', 'topic', '1. Publish once'],
      ['topic', 'q1', 'Copy 1'],
      ['topic', 'q2', 'Copy 2'],
      ['topic', 'fn', 'Copy 3'],
    ],
    steps: [
      'The publisher sends one message to the SNS topic.',
      'SNS pushes a copy to every subscription, optionally filtered by message attributes.',
      'Each subscriber (queue, function, endpoint) processes its copy independently.',
    ],
  },
  questionTypes: [
    { pattern: 'One message, many consumers', hint: 'SNS topic with multiple subscribers (fan-out).' },
    { pattern: 'Notify operators of alarms', hint: 'CloudWatch alarm action to an SNS topic with email/SMS subscriptions.' },
    { pattern: 'SNS vs SQS', hint: 'SNS pushes to many; SQS holds messages for one consumer to pull.' },
    { pattern: 'Filter messages per subscriber', hint: 'Subscription filter policies.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company wants every new image upload event to be processed independently by a thumbnail service and a metadata service, each at its own pace and with retries. Which design is MOST appropriate?',
      options: [
        'S3 event to an SNS topic with two SQS queue subscriptions, one per service',
        'S3 event directly to one SQS queue read by both services',
        'S3 event to a single Lambda function that calls both services synchronously',
        'Two EC2 instances polling the bucket',
      ],
      answer: ['A'],
      explanation: 'SNS fan-out to separate SQS queues gives each service its own durable copy of every event so they can process and retry independently.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Operations staff must receive an email and an SMS when a CloudWatch alarm enters the ALARM state. What is the simplest solution?',
      options: ['Configure the alarm action to publish to an SNS topic with email and SMS subscriptions', 'Poll the alarm state with a Lambda function every minute', 'Write alarm state to DynamoDB', 'Send alarm state to Kinesis Data Streams'],
      answer: ['A'],
      explanation: 'CloudWatch alarms natively publish to SNS topics, which can notify email and SMS subscribers.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'Subscribers to a single SNS topic should receive only the messages relevant to them, such as orders from their own Region, without code changes in the publisher. What should be used?',
      options: ['A separate topic per subscriber, published to manually', 'Subscription filter policies based on message attributes', 'A dead-letter queue', 'SQS long polling'],
      answer: ['B'],
      explanation: 'Filter policies on subscriptions deliver only messages whose attributes match, so one topic can serve many consumers.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which statement correctly describes the difference between Amazon SNS and Amazon SQS?',
      options: [
        'SNS is pull-based and SQS is push-based.',
        'SNS pushes a message to multiple subscribers, whereas an SQS message is processed by one consumer that pulls it.',
        'Both only support a single consumer per message.',
        'SQS supports email and SMS endpoints natively.',
      ],
      answer: ['B'],
      explanation: 'SNS is a push-based pub/sub service for fan-out; SQS is a pull-based queue where each message is consumed by one consumer.',
    },
  ],
  keyFacts: [
    'SNS topic subscribers: SQS, Lambda, HTTP/S, email, SMS, mobile push and Amazon Data Firehose.',
    'SNS is push-based pub/sub; SQS is pull-based queuing - combine them for durable fan-out.',
    'Standard topics: at-least-once, best-effort ordering. FIFO topics: ordered, deduplicated, delivered to SQS FIFO queues.',
    'Filter policies on subscriptions control which messages each subscriber receives.',
    'Failed deliveries retry automatically; attach a dead-letter queue to a subscription to capture permanent failures.',
    'The SQS queue policy must allow the SNS topic to send messages.',
    'Topics support server-side encryption with KMS and cross-account publishing through access policies.',
  ],
  traps: [
    { clue: 'Publish once, many systems react', answer: 'SNS fan-out (often to SQS).' },
    { clue: 'Email/SMS notification to humans', answer: 'SNS.' },
    { clue: 'Only some subscribers want some messages', answer: 'Subscription filter policy.' },
    { clue: 'Ordered fan-out', answer: 'SNS FIFO topic + SQS FIFO queues.' },
  ],
  related: ['sqs', 'eventbridge', 'lambda', 'cloudwatch', 'kinesis'],
  sources: [
    { title: 'What is Amazon SNS?', url: 'https://docs.aws.amazon.com/sns/latest/dg/welcome.html' },
    { title: 'Amazon SNS fan-out to SQS', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html' },
    { title: 'Subscription filter policies', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-subscription-filter-policies.html' },
    { title: 'Amazon SNS FIFO topics', url: 'https://docs.aws.amazon.com/sns/latest/dg/sns-fifo-topics.html' },
    { title: 'AWS CLI sns commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/sns/index.html' },
  ],
};
