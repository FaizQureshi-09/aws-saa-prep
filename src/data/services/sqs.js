import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon SQS. Schema: see s3.js. */
export default {
  tagline: 'Fully managed message queues that decouple and buffer components so each can scale and fail independently.',
  intro: [
    'Amazon SQS is a fully managed message queuing service: producers send messages, consumers poll for them, process, then delete them.',
    'Standard queues offer nearly unlimited throughput, at-least-once delivery and best-effort ordering; FIFO queues provide strict ordering per message group and exactly-once processing.',
    'Messages can be up to 1 MiB (larger payloads can reference S3 through the Extended Client Library), retained 60 seconds to 14 days (default 4 days).',
    'After a consumer receives a message it is hidden for the visibility timeout (default 30 seconds, max 12 hours); if not deleted in time, it becomes visible again.',
    'Dead-letter queues capture messages that fail repeatedly; long polling reduces empty responses and cost; delay queues postpone delivery by up to 15 minutes.',
    'Queues are protected with IAM and queue policies and server-side encryption (SSE-SQS or KMS); scale consumers (EC2 Auto Scaling, Lambda) on queue depth.',
  ],
  useCases: [
    { title: 'Absorb traffic spikes', detail: 'Buffer writes (votes, orders) so a backend database is not overwhelmed.' },
    { title: 'Decouple microservices', detail: 'Producers continue working even when consumers are slow or down.' },
    { title: 'Work queues for batch jobs', detail: 'Worker fleets pull tasks and scale on backlog.' },
    { title: 'Ordered processing', detail: 'FIFO queues with message groups for per-entity ordering (for example per account).' },
  ],
  importance: {
    points: [
      'Decoupling is the central theme of Task 2.1 ("determining the AWS services required to achieve loose coupling") and SQS is the named example.',
      'AWS\'s official sample set includes an SQS buffering scenario.',
      'Expect Standard vs FIFO, visibility timeout, DLQ and SNS fan-out questions.',
    ],
  },
  cli: [
    { command: 'aws sqs create-queue --queue-name orders --attributes VisibilityTimeout=60,ReceiveMessageWaitTimeSeconds=20', description: 'Create a standard queue with long polling and a 60-second visibility timeout.' },
    { command: 'aws sqs create-queue --queue-name orders.fifo --attributes FifoQueue=true,ContentBasedDeduplication=true', description: 'Create a FIFO queue (name must end with .fifo).' },
    { command: 'aws sqs send-message --queue-url <url> --message-body \'{"orderId":1001}\'', description: 'Send a message.' },
    { command: 'aws sqs receive-message --queue-url <url> --max-number-of-messages 10 --wait-time-seconds 20', description: 'Long-poll for up to 10 messages.' },
    { command: 'aws sqs delete-message --queue-url <url> --receipt-handle <handle>', description: 'Delete a message after successful processing.' },
    { command: 'aws sqs set-queue-attributes --queue-url <url> --attributes RedrivePolicy=\'{"deadLetterTargetArn":"<dlq-arn>","maxReceiveCount":"5"}\'', description: 'Attach a dead-letter queue.' },
    { command: 'aws sqs get-queue-attributes --queue-url <url> --attribute-names ApproximateNumberOfMessages', description: 'Read queue depth (a scaling signal).' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): a long-polling worker',
        language: 'python',
        code: `import boto3

sqs = boto3.client("sqs")
queue_url = "https://sqs.ap-south-1.amazonaws.com/111111111111/orders"

while True:
    resp = sqs.receive_message(QueueUrl=queue_url, MaxNumberOfMessages=10, WaitTimeSeconds=20)
    for msg in resp.get("Messages", []):
        process(msg["Body"])          # your business logic (must be idempotent)
        sqs.delete_message(QueueUrl=queue_url, ReceiptHandle=msg["ReceiptHandle"])`,
      },
    ],
  },
  examples: [
    {
      title: 'Protect a database from a traffic spike',
      scenario: 'Hundreds of thousands of writes arrive in minutes, and the database cannot keep up.',
      steps: [
        'Front-end instances send each request to an SQS queue instead of writing directly.',
        'A worker fleet (Auto Scaling group) reads from the queue and writes to the database at a sustainable rate.',
        'Scale workers on backlog per instance.',
        'Use a DLQ for messages that fail repeatedly.',
      ],
    },
  ],
  diagram: {
    title: 'Decoupling with SQS and a dead-letter queue',
    nodes: [
      ['prod', 'Producers (web tier)', 'compute', 0, 1],
      ['q', 'SQS queue', 'integration', 1, 1],
      ['workers', 'Workers (Auto Scaling)', 'compute', 2, 1],
      ['db', 'Database', 'database', 3, 1],
      ['dlq', 'Dead-letter queue', 'integration', 1, 2],
    ],
    edges: [
      ['prod', 'q', '1. SendMessage'],
      ['workers', 'q', '2. ReceiveMessage'],
      ['workers', 'db', '3. Write, then delete msg'],
      ['q', 'dlq', 'After max receives', 'dashed'],
    ],
    steps: [
      'Producers send messages to the queue and return immediately - the queue absorbs bursts.',
      'Workers poll the queue (long polling) and receive messages, which become invisible for the visibility timeout.',
      'After successful processing the worker deletes the message; otherwise it reappears and is retried.',
      'Messages that exceed the maximum receive count move to the dead-letter queue for investigation.',
    ],
  },
  questionTypes: [
    { pattern: 'Decouple tiers / absorb spikes', hint: 'Put SQS between producers and consumers.' },
    { pattern: 'Standard vs FIFO', hint: 'Order and no duplicates = FIFO; maximum throughput = Standard.' },
    { pattern: 'Message processed twice or too early', hint: 'Adjust the visibility timeout; make consumers idempotent.' },
    { pattern: 'Poison messages', hint: 'Dead-letter queue with maxReceiveCount.' },
    { pattern: 'Fan-out', hint: 'SNS topic with multiple SQS queue subscribers.' },
  ],
  questions: [
    {
      source: 'official', reference: 'AWS SAA-C03 Sample Exam Questions, Q7', domain: 2,
      stem: 'A company runs an online voting system for a weekly live television program. During broadcasts, users submit hundreds of thousands of votes within minutes to a front-end fleet of Amazon EC2 instances that run in an Auto Scaling group. The EC2 instances write the votes to an Amazon RDS database. However, the database is unable to keep up with the requests that come from the EC2 instances. A solutions architect must design a solution that processes the votes in the most efficient manner and without downtime. Which solution meets these requirements?',
      options: [
        'Migrate the front-end application to AWS Lambda. Use Amazon API Gateway to route user requests to the Lambda functions.',
        'Scale the database horizontally by converting it to a Multi-AZ deployment. Configure the front-end application to write to both the primary and secondary DB instances.',
        'Configure the front-end application to send votes to an Amazon Simple Queue Service (Amazon SQS) queue. Provision worker instances to read the SQS queue and write the vote information to the database.',
        'Use Amazon EventBridge (Amazon CloudWatch Events) to create a scheduled event to re-provision the database with larger, memory optimized instances during voting periods. When voting ends, re-provision the database to use smaller instances.',
      ],
      answer: ['C'],
      explanation: 'Decouple the ingestion of votes from the database to allow the voting system to continue processing votes without waiting for the database writes. Add dedicated workers to read from the SQS queue to allow votes to be entered into the database at a controllable rate. The votes will be added to the database as fast as the database can process them, but no votes will be lost. (AWS official explanation.)',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A payment processing application must process each transaction exactly once and in the order in which it was received for each customer account. Which AWS service configuration meets this requirement?',
      options: ['Amazon SQS standard queue', 'Amazon SQS FIFO queue using the account ID as the message group ID', 'Amazon SNS standard topic', 'Amazon Kinesis Data Firehose'],
      answer: ['B'],
      explanation: 'FIFO queues preserve order within a message group and prevent duplicates through deduplication, giving per-account ordering with exactly-once processing.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Some messages in an SQS queue are being processed twice because processing takes about 90 seconds, but the queue uses the default visibility timeout. What should be done?',
      options: ['Increase the visibility timeout to more than the processing time', 'Reduce the retention period', 'Switch to short polling', 'Delete the messages before processing'],
      answer: ['A'],
      explanation: 'If processing outlasts the visibility timeout, the message becomes visible again and another consumer receives it. Set the timeout longer than the maximum processing time.',
    },
    {
      source: 'mock', domain: 4,
      stem: 'Consumers poll an SQS queue continuously and receive many empty responses, increasing API cost. How can the cost be reduced?',
      options: ['Use short polling', 'Enable long polling by setting a receive wait time', 'Decrease the message retention period', 'Use a FIFO queue'],
      answer: ['B'],
      explanation: 'Long polling waits (up to 20 seconds) for messages to arrive, reducing the number of empty receives and the associated request cost.',
    },
    {
      source: 'mock', domain: 2, multi: true,
      stem: 'A single event must be delivered to a billing queue, an inventory queue and an analytics queue in parallel and reliably. Which combination provides this fan-out? (Select TWO.)',
      options: [
        'Publish the event to an Amazon SNS topic.',
        'Subscribe each SQS queue to the SNS topic.',
        'Have the producer write to each queue sequentially.',
        'Use one SQS queue with three consumers that each delete the message.',
        'Use an S3 bucket notification for each queue.',
      ],
      answer: ['A', 'B'],
      explanation: 'The SNS-to-SQS fan-out pattern publishes once to a topic and delivers a copy to every subscribed queue. A single queue delivers each message to only one consumer.',
    },
  ],
  keyFacts: [
    'Max message size is 1 MiB (1,048,576 bytes); use the Extended Client Library with S3 for larger payloads (up to 2 GB).',
    'Retention: 60 seconds to 14 days, default 4 days. Visibility timeout: 0 seconds to 12 hours, default 30 seconds. Delay queue: up to 15 minutes. Long polling: up to 20 seconds.',
    'Standard queues: nearly unlimited throughput, at-least-once, possible out-of-order and duplicates - design idempotent consumers.',
    'FIFO queues: names end in .fifo; ordering per MessageGroupId; deduplication for 5 minutes; 300 transactions/second per API action (3,000 messages/second with batching) unless high-throughput mode is enabled.',
    'A batch request can contain up to 10 messages.',
    'A dead-letter queue is selected through a redrive policy with maxReceiveCount; the DLQ must be the same queue type (FIFO for FIFO).',
    'Scale consumers using queue depth (ApproximateNumberOfMessages) or backlog per instance.',
    'Encryption at rest with SSE-SQS (default) or SSE-KMS; encryption in transit via HTTPS.',
  ],
  traps: [
    { clue: 'Database cannot keep up with write bursts', answer: 'SQS queue between the tier and the database.' },
    { clue: 'Strict ordering and exactly-once', answer: 'SQS FIFO.' },
    { clue: 'One event to many consumers', answer: 'SNS topic with SQS subscriptions (fan-out).' },
    { clue: 'Messages stuck failing repeatedly', answer: 'Dead-letter queue.' },
    { clue: 'Message processed twice', answer: 'Increase visibility timeout / idempotent processing.' },
  ],
  related: ['sns', 'lambda', 'ec2-auto-scaling', 'eventbridge', 'kinesis'],
  sources: [
    { title: 'What is Amazon SQS?', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' },
    { title: 'Amazon SQS message quotas', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html' },
    { title: 'Amazon SQS visibility timeout', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html' },
    { title: 'Amazon SQS FIFO queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-fifo-queues.html' },
    { title: 'Dead-letter queues', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html' },
    { title: 'AWS CLI sqs commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/sqs/index.html' },
  ],
};
