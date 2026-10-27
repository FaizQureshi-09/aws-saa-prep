import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for Amazon EventBridge. Schema: see s3.js. */
export default {
  tagline: 'A serverless event bus that routes events from AWS services, your apps and SaaS partners to targets.',
  intro: [
    'Amazon EventBridge receives events (JSON documents describing state changes) on event buses and delivers matching events to targets using rules.',
    'Event sources include 90+ AWS services (for example an EC2 state change or an S3 object event), your own applications, and SaaS partner integrations.',
    'Rules match events with event patterns or run on a schedule (cron/rate); each rule can send to up to several targets such as Lambda, SQS, SNS, Step Functions, Kinesis or ECS tasks.',
    'Event buses can be the default bus, custom buses or partner buses and can send events across accounts and Regions; archive and replay help recover or test.',
    'EventBridge Scheduler and Pipes add managed scheduling and point-to-point integrations with filtering and enrichment.',
    'EventBridge is the evolution of CloudWatch Events - same service API, more features.',
  ],
  useCases: [
    { title: 'React to AWS state changes', detail: 'Run Lambda when an EC2 instance stops, a GuardDuty finding appears or a pipeline fails.' },
    { title: 'Scheduled jobs', detail: 'Cron rules trigger Lambda, Fargate tasks or Step Functions.' },
    { title: 'Event-driven microservices and SaaS integration', detail: 'Decouple producers from consumers across accounts.' },
  ],
  importance: {
    points: [
      'Tasks 2.1 lists event-driven architectures; EventBridge is the central AWS event-routing service.',
      'Decision: EventBridge (rule-based routing, AWS and SaaS sources) vs SNS (fan-out) vs SQS (buffer) vs Kinesis (stream).',
    ],
  },
  cli: [
    { command: 'aws events put-rule --name nightly --schedule-expression "cron(0 2 * * ? *)"', description: 'Create a scheduled rule (02:00 UTC daily).' },
    { command: 'aws events put-rule --name ec2-stopped --event-pattern \'{"source":["aws.ec2"],"detail-type":["EC2 Instance State-change Notification"],"detail":{"state":["stopped"]}}\'', description: 'Create an event-pattern rule.' },
    { command: 'aws events put-targets --rule nightly --targets "Id"="1","Arn"="<lambda-arn>"', description: 'Attach a target to the rule.' },
    { command: 'aws events put-events --entries file://events.json', description: 'Publish custom events.' },
    { command: 'aws events create-event-bus --name orders-bus', description: 'Create a custom event bus.' },
    { command: 'aws events create-archive --archive-name orders-archive --event-source-arn <bus-arn> --retention-days 30', description: 'Archive events for replay.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python (Boto3): publish a custom event',
        language: 'python',
        code: `import boto3, json

events = boto3.client("events")
events.put_events(Entries=[{
    "Source": "shop.orders",
    "DetailType": "OrderPlaced",
    "Detail": json.dumps({"orderId": 1001, "total": 49.9}),
    "EventBusName": "orders-bus",
}])`,
      },
    ],
  },
  examples: [
    {
      title: 'Automated response to an instance stopping',
      scenario: 'Operations must be notified and a ticket created whenever a production EC2 instance stops.',
      steps: [
        'Create a rule with an event pattern for EC2 Instance State-change Notification where state = stopped.',
        'Add two targets: an SNS topic and a Lambda function that creates the ticket.',
        'Add input transformation to include instance ID and time in the message.',
      ],
    },
  ],
  diagram: {
    title: 'EventBridge rules and targets',
    nodes: [
      ['src', 'AWS services / apps / SaaS', 'compute', 0, 1],
      ['bus', 'EventBridge event bus', 'integration', 1, 1],
      ['rule', 'Rule (event pattern / schedule)', 'integration', 2, 1],
      ['fn', 'Lambda', 'compute', 3, 0],
      ['q', 'SQS / SNS / Step Functions', 'integration', 3, 2],
    ],
    edges: [
      ['src', 'bus', 'Put events'],
      ['bus', 'rule', 'Match'],
      ['rule', 'fn', 'Invoke'],
      ['rule', 'q', 'Send'],
    ],
    steps: [
      'Events from AWS services, your applications or SaaS partners arrive on an event bus.',
      'Rules compare each event against an event pattern (or fire on a schedule).',
      'Matching events are delivered to one or more targets, with optional input transformation and retry/DLQ settings.',
    ],
  },
  questionTypes: [
    { pattern: 'Schedule a task without servers', hint: 'EventBridge scheduled rule/Scheduler -> Lambda/Fargate.' },
    { pattern: 'React to an AWS service event', hint: 'EventBridge rule with an event pattern.' },
    { pattern: 'EventBridge vs SNS', hint: 'EventBridge for content-based routing and AWS/SaaS sources; SNS for high-fanout pub/sub.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company wants to run a Lambda function every night at 2 AM UTC without managing any servers. What is the simplest solution?',
      options: ['An EC2 instance with cron', 'An EventBridge scheduled rule targeting the Lambda function', 'An SQS delay queue', 'A CloudFront function'],
      answer: ['B'],
      explanation: 'EventBridge supports cron and rate schedules that invoke targets directly.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'When an object is uploaded to a specific S3 prefix, multiple independent systems (a Lambda function, an SQS queue and a Step Functions workflow) must be triggered based on content filters. Which service provides rule-based routing to multiple targets?',
      options: ['Amazon EventBridge', 'Amazon SES', 'AWS Backup', 'Amazon Macie'],
      answer: ['A'],
      explanation: 'EventBridge rules match events using patterns and can route to many different targets.',
    },
    {
      source: 'mock', domain: 1,
      stem: 'A security team wants an automatic notification whenever an Amazon GuardDuty finding of high severity is generated. How can this be done with the LEAST effort?',
      options: ['Poll GuardDuty from an EC2 instance', 'EventBridge rule that matches GuardDuty findings and targets an SNS topic', 'Enable VPC Flow Logs', 'Use AWS Artifact'],
      answer: ['B'],
      explanation: 'GuardDuty publishes findings to EventBridge; a rule can forward them to SNS for notification.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Events from a SaaS partner application must trigger an AWS workflow without polling. Which EventBridge feature receives them?',
      options: ['An S3 bucket notification', 'A CloudWatch metric alarm', 'A Route 53 health check', 'A partner event source delivered to a partner event bus'],
      answer: ['D'],
      explanation: 'SaaS partners send events to a partner event bus in your account where rules route them to targets.',
    },
  ],
  keyFacts: [
    'EventBridge = serverless event bus with rules (patterns or schedules) and many target types.',
    'Default bus receives AWS service events; custom and partner buses isolate application and SaaS events.',
    'Supports cross-account and cross-Region event delivery, archive and replay, and schema registry.',
    'Targets can have retry policies and dead-letter queues.',
    'Formerly Amazon CloudWatch Events (same underlying API).',
    'Scheduled rules use cron or rate expressions in UTC.',
  ],
  traps: [
    { clue: 'Cron job without servers', answer: 'EventBridge scheduled rule + Lambda/Fargate.' },
    { clue: 'Respond to an AWS service state change', answer: 'EventBridge rule.' },
    { clue: 'Buffer messages for a single consumer', answer: 'SQS, not EventBridge.' },
    { clue: 'Real-time ordered data streams', answer: 'Kinesis.' },
  ],
  related: ['sns', 'sqs', 'lambda', 'step-functions', 'guardduty', 'cloudwatch'],
  sources: [
    { title: 'What is Amazon EventBridge?', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html' },
    { title: 'EventBridge rules', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html' },
    { title: 'EventBridge event buses', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-bus.html' },
    { title: 'AWS CLI events commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/events/index.html' },
  ],
};
