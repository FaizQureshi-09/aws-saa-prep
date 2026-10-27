import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS Lambda. Schema: see s3.js. */
export default {
  tagline: 'Run code without managing servers - event-driven functions that scale automatically and bill per millisecond.',
  intro: [
    'AWS Lambda runs your function code in response to events, provisioning and scaling the execution environments for you; you pay only for requests and execution time (GB-seconds).',
    'Configuration: memory from 128 MB to 10,240 MB (CPU scales with memory; 1,769 MB is about one vCPU), timeout up to 15 minutes, /tmp storage 512 MB to 10,240 MB.',
    'Invocation models: synchronous (API Gateway, ALB, SDK), asynchronous (S3, SNS, EventBridge - with retries, DLQ and destinations) and poll-based event source mappings (SQS, Kinesis, DynamoDB Streams).',
    'Each function has an execution role (what it may call) and an optional resource-based policy (who may invoke it); functions can attach to a VPC to reach private resources.',
    'Scaling: concurrency scales out per request; reserved concurrency guarantees and caps capacity, provisioned concurrency keeps environments initialised to avoid cold starts.',
    'Packaging: zip archives (50 MB zipped / 250 MB unzipped) or container images up to 10 GB; layers share libraries; versions and aliases support safe, weighted deployments.',
  ],
  useCases: [
    { title: 'Event-driven file processing', detail: 'Process S3 uploads: resize images, validate files, extract metadata.' },
    { title: 'Serverless APIs', detail: 'API Gateway + Lambda + DynamoDB for fully managed backends.' },
    { title: 'Stream and queue consumers', detail: 'Consume SQS, Kinesis or DynamoDB Streams records with automatic scaling.' },
    { title: 'Automation and glue', detail: 'Scheduled EventBridge jobs, infrastructure automation, custom CloudWatch responses.' },
  ],
  importance: {
    points: [
      'Serverless is explicit in Tasks 2.1, 3.2 and 4.2 - including "the amount of Lambda memory" as a sizing skill.',
      'Lambda is the default answer for "least operational overhead" event processing questions.',
      'Know its limits (15 minutes, payload sizes, concurrency) so you can reject it when a job is too long-running.',
    ],
  },
  cli: [
    { command: 'aws lambda create-function --function-name resize --runtime python3.12 --handler app.handler --role arn:aws:iam::111111111111:role/LambdaRole --zip-file fileb://function.zip', description: 'Create a function from a zip file.' },
    { command: 'aws lambda invoke --function-name resize --payload file://event.json out.json', description: 'Invoke a function synchronously.' },
    { command: 'aws lambda update-function-configuration --function-name resize --memory-size 1024 --timeout 60', description: 'Change memory (and therefore CPU) and timeout.' },
    { command: 'aws lambda put-function-concurrency --function-name resize --reserved-concurrent-executions 50', description: 'Reserve (and cap) concurrency.' },
    { command: 'aws lambda put-provisioned-concurrency-config --function-name resize --qualifier prod --provisioned-concurrent-executions 10', description: 'Keep warm environments to avoid cold starts.' },
    { command: 'aws lambda create-event-source-mapping --function-name worker --event-source-arn <sqs-arn> --batch-size 10', description: 'Connect a queue/stream to a function.' },
    { command: 'aws lambda publish-version --function-name resize && aws lambda update-alias --function-name resize --name prod --function-version 5', description: 'Publish an immutable version and point an alias to it.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python: a Lambda handler for S3 upload events',
        language: 'python',
        code: `import json
import urllib.parse

def handler(event, context):
    for record in event["Records"]:
        bucket = record["s3"]["bucket"]["name"]
        key = urllib.parse.unquote_plus(record["s3"]["object"]["key"])
        print(json.dumps({"bucket": bucket, "key": key}))
        # ... process the object ...
    return {"statusCode": 200}`,
      },
    ],
  },
  examples: [
    {
      title: 'Thumbnail pipeline',
      scenario: 'Every image uploaded to S3 must be resized automatically with no servers to manage.',
      steps: [
        'Create an execution role with s3:GetObject on the source bucket and s3:PutObject on the destination.',
        'Create the function and add an S3 trigger for ObjectCreated events on the source prefix.',
        'Write thumbnails to a different bucket (or prefix excluded from the trigger) to avoid recursive invocation.',
        'Configure a DLQ or on-failure destination to capture failed events.',
      ],
    },
  ],
  diagram: {
    title: 'Event-driven Lambda processing',
    nodes: [
      ['user', 'Client upload', 'actor', 0, 1],
      ['s3', 'S3 bucket', 'storage', 1, 1],
      ['fn', 'Lambda function', 'compute', 2, 1],
      ['ddb', 'DynamoDB table', 'database', 3, 1],
      ['dlq', 'SQS dead-letter queue', 'integration', 2, 2],
    ],
    edges: [
      ['user', 's3', '1. Upload object'],
      ['s3', 'fn', '2. ObjectCreated event'],
      ['fn', 'ddb', '3. Write metadata'],
      ['fn', 'dlq', 'On failure', 'dashed'],
    ],
    steps: [
      'A client uploads an object to S3.',
      'S3 invokes the function asynchronously with an event describing the object.',
      'The function processes the object and writes results (for example to DynamoDB).',
      'If asynchronous retries are exhausted, the event goes to a dead-letter queue or failure destination for inspection.',
    ],
  },
  questionTypes: [
    { pattern: 'Least operational overhead for event processing', hint: 'Lambda triggered by S3, SQS, EventBridge or DynamoDB Streams.' },
    { pattern: 'Is Lambda suitable?', hint: 'Not for jobs over 15 minutes, large stateful processes or specialised hardware - use Fargate/EC2/Batch.' },
    { pattern: 'Cold start or throttling', hint: 'Provisioned concurrency for latency; reserved concurrency to guarantee/cap capacity.' },
    { pattern: 'Private resource access', hint: 'Attach the function to VPC subnets; add NAT/endpoints for outbound access.' },
    { pattern: 'Failure handling', hint: 'DLQ or destinations for async; partial batch response and DLQ for queues.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A company processes images uploaded to Amazon S3. Uploads are unpredictable, and the company wants to avoid managing servers and pay only when images are processed. Which design is the MOST suitable?',
      options: [
        'An S3 event notification that invokes an AWS Lambda function',
        'A fleet of EC2 instances polling the bucket every minute',
        'A single large EC2 instance running 24x7 with a cron job',
        'An Amazon RDS instance with a stored procedure',
      ],
      answer: ['A'],
      explanation: 'S3 events triggering Lambda are fully event-driven and serverless; you pay per invocation and duration, with no servers to manage.',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A Lambda function processes records quickly but is CPU-bound and takes too long. Which change is the simplest way to increase its CPU power?',
      options: ['Increase the function\'s memory setting', 'Add more layers', 'Increase the timeout only', 'Enable X-Ray tracing'],
      answer: ['A'],
      explanation: 'Lambda allocates CPU in proportion to configured memory, so increasing memory increases CPU (and often shortens duration).',
    },
    {
      source: 'mock', domain: 3,
      stem: 'A latency-sensitive API backed by Lambda suffers occasional multi-second delays on the first request after idle periods (cold starts). Which feature reduces this?',
      options: ['Reserved concurrency', 'Provisioned concurrency', 'A larger /tmp directory', 'Lambda layers'],
      answer: ['B'],
      explanation: 'Provisioned concurrency keeps a configured number of execution environments initialised and ready, removing cold-start latency for those requests. Reserved concurrency only guarantees/caps capacity.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A nightly data transformation takes about 40 minutes and currently runs as a single script on EC2. The company wants a serverless approach with minimal changes. Which option is MOST appropriate?',
      options: [
        'Run the script in a single AWS Lambda function',
        'Package the script as a container and run it on AWS Fargate through ECS',
        'Run it in API Gateway',
        'Run it in an SQS queue',
      ],
      answer: ['B'],
      explanation: 'Lambda\'s maximum timeout is 15 minutes, so a 40-minute job does not fit. Fargate runs containers serverlessly without time limits and needs minimal code changes.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'A function consuming messages from an Amazon SQS queue sometimes receives a poison message that always fails. The company needs failed messages isolated for later analysis without blocking the queue. What should be configured?',
      options: ['Increase the Lambda timeout', 'A dead-letter queue (redrive policy) on the source queue', 'Reserved concurrency of 1', 'An S3 lifecycle rule'],
      answer: ['B'],
      explanation: 'A redrive policy moves messages that exceed the maximum receive count to a dead-letter queue, isolating poison messages for investigation.',
    },
  ],
  keyFacts: [
    'Limits: timeout 15 minutes; memory 128-10,240 MB; /tmp 512-10,240 MB; default 1,000 concurrent executions per Region (can be raised).',
    'Payload: 6 MB for synchronous request/response; 1 MB for asynchronous invocations.',
    'Deployment package: 50 MB zipped (direct upload), 250 MB unzipped; container images up to 10 GB; up to 5 layers.',
    'CPU scales with memory: about 1 vCPU at 1,769 MB.',
    'Reserved concurrency guarantees and limits a function\'s share; provisioned concurrency pre-warms environments (extra cost).',
    'Async invocations retry twice by default; use DLQ or on-failure destinations. Stream/queue sources retry until success or expiry unless configured otherwise.',
    'A function outside a VPC reaches the internet by default; inside a VPC it needs a NAT gateway or VPC endpoints for outbound access.',
    'Lambda@Edge and CloudFront Functions run code at the edge for CloudFront customisation.',
  ],
  traps: [
    { clue: 'Job runs longer than 15 minutes', answer: 'Not Lambda - use Fargate, ECS/EC2, Batch or Step Functions.' },
    { clue: 'First-request latency after idle', answer: 'Provisioned concurrency.' },
    { clue: 'Guarantee capacity or limit downstream load', answer: 'Reserved concurrency.' },
    { clue: 'Lambda must reach a private RDS instance', answer: 'Attach the function to the VPC (and use RDS Proxy for connection pooling).' },
    { clue: 'Failed async events must not be lost', answer: 'Dead-letter queue or on-failure destination.' },
  ],
  related: ['api-gateway', 'sqs', 'eventbridge', 'step-functions', 'dynamodb', 'fargate'],
  sources: [
    { title: 'What is AWS Lambda?', url: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html' },
    { title: 'Lambda quotas', url: 'https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html' },
    { title: 'Configuring function memory', url: 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html' },
    { title: 'Configuring reserved and provisioned concurrency', url: 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html' },
    { title: 'Asynchronous invocation', url: 'https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html' },
    { title: 'AWS CLI lambda commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/lambda/index.html' },
  ],
};
