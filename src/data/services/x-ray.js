import { SDK_SUMMARY } from '../sdkNote.js';

/** Study content for AWS X-Ray. Schema: see s3.js. */
export default {
  tagline: 'Distributed tracing: follow a request across services to find bottlenecks and errors.',
  intro: [
    'AWS X-Ray collects data about requests that your application serves and lets you view, filter and analyse it to find performance bottlenecks, latency spikes and errors across distributed services.',
    'A trace follows one request end to end and is made of segments (and subsegments) from each service, including downstream calls to AWS services, databases and web APIs.',
    'X-Ray builds a service map (trace map) showing the client, front-end service and backend dependencies, with latency and error rates per node.',
    'Instrumentation uses SDKs or agents (including OpenTelemetry-based tooling); segments are sent to a daemon that batches them to X-Ray, and the daemon is built in on Elastic Beanstalk and Lambda.',
    'Many AWS services can add trace headers or send trace data, such as API Gateway, Lambda (active tracing), ELB, ECS and Elastic Beanstalk.',
    'Use X-Ray for tracing requests, CloudWatch for metrics, logs and alarms, and CloudTrail for API audit history.',
  ],
  useCases: [
    { title: 'Find the slow microservice', detail: 'See which downstream call adds the latency in a request chain.' },
    { title: 'Debug serverless applications', detail: 'Trace API Gateway, Lambda and DynamoDB calls in one view.' },
    { title: 'Error analysis', detail: 'Filter traces by fault or throttle to find root causes.' },
  ],
  importance: {
    points: [
      'Domain 2 (resilient architectures): the observability answer for "trace requests across microservices".',
      'Easily separated from CloudWatch (metrics/logs) and CloudTrail (API calls).',
    ],
  },
  cli: [
    { command: 'aws xray get-service-graph --start-time 2026-10-27T00:00:00Z --end-time 2026-10-27T01:00:00Z', description: 'Retrieve the service map for a time window.' },
    { command: 'aws xray get-trace-summaries --start-time 2026-10-27T00:00:00Z --end-time 2026-10-27T01:00:00Z --filter-expression "responsetime > 3"', description: 'Find slow traces.' },
    { command: 'aws xray batch-get-traces --trace-ids <trace-id>', description: 'Read full trace details.' },
    { command: 'aws lambda update-function-configuration --function-name orders --tracing-config Mode=Active', description: 'Enable active tracing for a Lambda function.' },
  ],
  sdk: {
    summary: SDK_SUMMARY,
    snippets: [
      {
        title: 'Python: trace a function with the X-Ray SDK',
        language: 'python',
        code: `from aws_xray_sdk.core import xray_recorder, patch_all

patch_all()  # trace boto3, requests and other libraries

@xray_recorder.capture("process_order")
def process_order(order_id):
    xray_recorder.current_subsegment().put_annotation("order_id", order_id)
    ...`,
      },
    ],
  },
  examples: [
    {
      title: 'Find why checkout is slow',
      scenario: 'Customers report slow checkout calls through API Gateway and Lambda.',
      steps: [
        'Enable active tracing on API Gateway and Lambda.',
        'Open the service map and look for nodes with high latency or fault rates.',
        'Drill into slow traces to see the downstream DynamoDB or HTTP call that dominates the time.',
      ],
    },
  ],
  diagram: {
    title: 'X-Ray tracing a request',
    nodes: [
      ['client', 'Client', 'actor', 0, 1],
      ['api', 'API Gateway / ALB', 'network', 1, 1],
      ['svc', 'Lambda / ECS / EC2 (instrumented)', 'compute', 2, 1],
      ['xray', 'AWS X-Ray', 'management', 2, 0],
      ['map', 'Service map and traces', 'analytics', 3, 0],
      ['db', 'DynamoDB / RDS / external API', 'database', 3, 1],
    ],
    edges: [
      ['client', 'api', 'Request'],
      ['api', 'svc', 'Trace header'],
      ['svc', 'db', 'Downstream calls'],
      ['svc', 'xray', 'Segments'],
      ['xray', 'map', 'Visualises'],
    ],
    steps: [
      'The request carries a trace ID through each service.',
      'Each instrumented service sends segments describing its work and downstream calls.',
      'X-Ray assembles the trace and draws the service map to show latency and errors.',
    ],
  },
  questionTypes: [
    { pattern: 'Trace a request across microservices', hint: 'AWS X-Ray.' },
    { pattern: 'X-Ray vs CloudWatch vs CloudTrail', hint: 'Tracing vs metrics/logs vs API audit.' },
  ],
  questions: [
    {
      source: 'mock', domain: 2,
      stem: 'A team operates a microservices application and needs to identify which downstream service adds the most latency to a request. Which service should be used?',
      options: ['AWS CloudTrail', 'Amazon Inspector', 'AWS X-Ray', 'AWS Config'],
      answer: ['C'],
      explanation: 'X-Ray traces requests end to end and shows latency per service in a service map.',
    },
    {
      source: 'mock', domain: 2,
      stem: 'How can an AWS Lambda function send trace data to X-Ray?',
      options: ['Attach an EBS volume', 'Enable active tracing on the function', 'Enable S3 versioning', 'Create a Route 53 record'],
      answer: ['B'],
      explanation: 'Lambda active tracing sends trace data to X-Ray (the function role needs permission to write traces).',
    },
    {
      source: 'mock', domain: 2,
      stem: 'Which statements are true about AWS X-Ray? (Select TWO.)',
      multi: true,
      options: ['It performs DDoS protection.', 'It generates a service map of the components handling requests.', 'A trace is composed of segments from the services a request touches.', 'It stores container images.', 'It records every API call made to your AWS account.'],
      answer: ['B', 'C'],
      explanation: 'X-Ray builds service maps from traces made of segments. API call history is CloudTrail.',
    },
  ],
  keyFacts: [
    'Trace = request journey; segments and subsegments describe each service and downstream call.',
    'Service map shows latency and error rates per node.',
    'Daemon batches segments; built in on Lambda and Elastic Beanstalk; Lambda needs active tracing enabled.',
    'Annotations are indexed for filtering; metadata is not.',
  ],
  traps: [
    { clue: 'Trace request across microservices', answer: 'X-Ray.' },
    { clue: 'Who called an API', answer: 'CloudTrail.' },
    { clue: 'CPU metrics and alarms', answer: 'CloudWatch.' },
  ],
  related: ['cloudwatch', 'cloudtrail', 'lambda', 'api-gateway', 'ecs', 'elastic-beanstalk'],
  sources: [
    { title: 'What is AWS X-Ray?', url: 'https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html' },
    { title: 'AWS X-Ray concepts', url: 'https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html' },
    { title: 'Visualize Lambda function invocations using AWS X-Ray', url: 'https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html' },
    { title: 'AWS CLI xray commands', url: 'https://docs.aws.amazon.com/cli/latest/reference/xray/index.html' },
  ],
};
